# Hosting this site on an Ubuntu server

Target: **https://www.dev-esakki.pp.ua**

This is not a static site. It has three server-dependent routes — `/api/contact`,
`/api/github` and the dynamic `/opengraph-image` — so it needs Node running
continuously behind a reverse proxy. `scp`-ing a folder of HTML will not work.

Two facts about the current setup that shape everything below:

1. **The domain is proxied through Cloudflare** (its A records point at
   `104.21.21.85` / `172.67.197.79` and responses carry `CF-RAY`). So the TLS the
   visitor sees is Cloudflare's. The certificate on your server only has to
   satisfy Cloudflare, which means a **Cloudflare Origin Certificate** is easier
   and longer-lived than Let's Encrypt — and Certbot's HTTP-01 challenge will
   fail anyway while the orange cloud is on.
2. Ubuntu hosting and the Cloudflare Workers setup already in this repo
   (`wrangler.jsonc`) are alternatives. Pick one. If you go with Ubuntu you can
   ignore `npm run deploy`.

---

## 1. Server prerequisites

Assumes Ubuntu 22.04 or 24.04 and a non-root user with sudo.

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx git curl ufw
```

Install Node 22 LTS (this project is built and tested on Node 22/24):

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node -v && npm -v
```

Firewall — open SSH and web, then enable:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
```

---

## 2. Get the code and build it

```bash
sudo mkdir -p /var/www
sudo chown "$USER":"$USER" /var/www
cd /var/www
git clone https://github.com/Esakki-devops/portfolio.git
cd portfolio
npm ci
npm run build
```

`npm ci` (not `npm install`) so the lockfile is respected. Confirm it serves
before wiring up nginx:

```bash
npm start          # listens on :3000
curl -I http://127.0.0.1:3000
```

You want `HTTP/1.1 200 OK`. Then `Ctrl+C`.

> Low-memory VPS (1 GB or less)? `npm run build` can be OOM-killed. Either add
> swap, or build locally and rsync the `.next` directory up.

---

## 3. Run it as a service

systemd rather than PM2 — no extra dependency, and it survives reboots.

```bash
sudo tee /etc/systemd/system/portfolio.service >/dev/null <<'EOF'
[Unit]
Description=Esakki Alaguvel portfolio (Next.js)
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/portfolio
Environment=NODE_ENV=production
Environment=PORT=3000
Environment=HOSTNAME=127.0.0.1
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal

# Hardening
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/var/www/portfolio/.next

[Install]
WantedBy=multi-user.target
EOF

sudo chown -R www-data:www-data /var/www/portfolio
sudo systemctl daemon-reload
sudo systemctl enable --now portfolio
sudo systemctl status portfolio --no-pager
```

`HOSTNAME=127.0.0.1` binds Node to loopback only, so the app is reachable
exclusively through nginx.

Logs: `sudo journalctl -u portfolio -f`

---

## 4. TLS certificate (Cloudflare Origin CA)

In the Cloudflare dashboard: **SSL/TLS → Origin Server → Create Certificate**.
Accept the defaults (RSA, 15 years). You get two blocks of text.

```bash
sudo mkdir -p /etc/ssl/cloudflare
sudo nano /etc/ssl/cloudflare/dev-esakki.pem   # paste the certificate
sudo nano /etc/ssl/cloudflare/dev-esakki.key   # paste the private key
sudo chmod 600 /etc/ssl/cloudflare/dev-esakki.key
```

Then set **SSL/TLS → Overview → Full (strict)**. Anything less leaves the
Cloudflare-to-origin hop unverified.

---

## 5. nginx

```bash
sudo tee /etc/nginx/sites-available/portfolio >/dev/null <<'EOF'
# Restore the visitor's real IP from Cloudflare instead of logging Cloudflare's.
# Refresh this list from https://www.cloudflare.com/ips/ occasionally.
set_real_ip_from 173.245.48.0/20;
set_real_ip_from 103.21.244.0/22;
set_real_ip_from 103.22.200.0/22;
set_real_ip_from 103.31.4.0/22;
set_real_ip_from 141.101.64.0/18;
set_real_ip_from 108.162.192.0/18;
set_real_ip_from 190.93.240.0/20;
set_real_ip_from 188.114.96.0/20;
set_real_ip_from 197.234.240.0/22;
set_real_ip_from 198.41.128.0/17;
set_real_ip_from 162.158.0.0/15;
set_real_ip_from 104.16.0.0/13;
set_real_ip_from 104.24.0.0/14;
set_real_ip_from 172.64.0.0/13;
set_real_ip_from 131.0.72.0/22;
set_real_ip_from 2400:cb00::/32;
set_real_ip_from 2606:4700::/32;
set_real_ip_from 2803:f800::/32;
set_real_ip_from 2405:b500::/32;
set_real_ip_from 2405:8100::/32;
set_real_ip_from 2a06:98c0::/29;
set_real_ip_from 2c0f:f248::/32;
real_ip_header CF-Connecting-IP;

server {
    listen 80;
    listen [::]:80;
    server_name dev-esakki.pp.ua www.dev-esakki.pp.ua;
    return 301 https://www.dev-esakki.pp.ua$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name dev-esakki.pp.ua;

    ssl_certificate     /etc/ssl/cloudflare/dev-esakki.pem;
    ssl_certificate_key /etc/ssl/cloudflare/dev-esakki.key;

    return 301 https://www.dev-esakki.pp.ua$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name www.dev-esakki.pp.ua;

    ssl_certificate     /etc/ssl/cloudflare/dev-esakki.pem;
    ssl_certificate_key /etc/ssl/cloudflare/dev-esakki.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;

    add_header X-Content-Type-Options nosniff always;
    add_header X-Frame-Options SAMEORIGIN always;
    add_header Referrer-Policy strict-origin-when-cross-origin always;

    # The contact form posts JSON; nothing here needs large uploads.
    client_max_body_size 1m;

    gzip on;
    gzip_types text/plain text/css application/javascript application/json image/svg+xml;
    gzip_min_length 1024;

    # Next.js fingerprints these filenames, so they are safe to cache hard.
    location /_next/static/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_read_timeout 60s;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/portfolio
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

---

## 6. Point Cloudflare at the server

DNS → edit the `A` record for `www` (and the apex) to your server's IPv4, proxy
status **Proxied** (orange cloud). Delete the records that pointed at the old
Pages deployment.

Cloudflare caches aggressively; after cutting over, purge it:
**Caching → Configuration → Purge Everything.**

---

## 7. Verify

```bash
curl -I https://www.dev-esakki.pp.ua/
curl -s https://www.dev-esakki.pp.ua/ | grep -o '/_next/[^"]*' | head -3
curl -s https://www.dev-esakki.pp.ua/api/github | head -c 200
curl -I https://www.dev-esakki.pp.ua/Esakki-Alaguvel-Resume.pdf
curl -o /dev/null -s -w 'total %{time_total}s  ttfb %{time_starttransfer}s\n' https://www.dev-esakki.pp.ua/
```

You are looking for: `200`, `/_next/` paths present (proves it's the new build,
not the old Vite one), JSON from the GitHub route, `application/pdf` for the
resume.

---

## 8. Updating after a push

```bash
sudo tee /usr/local/bin/deploy-portfolio >/dev/null <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
cd /var/www/portfolio
sudo -u www-data git pull --ff-only
sudo -u www-data npm ci
sudo -u www-data npm run build
systemctl restart portfolio
echo "deployed: $(git rev-parse --short HEAD)"
EOF
sudo chmod +x /usr/local/bin/deploy-portfolio
```

Then `sudo deploy-portfolio` after each push. Brief downtime during restart; if
that matters, build into a fresh directory and swap a symlink.

---

## Troubleshooting

| Symptom | Cause |
|---|---|
| 502 Bad Gateway | App isn't running — `systemctl status portfolio`, `journalctl -u portfolio -n 50` |
| 521 from Cloudflare | Origin refused the connection; check `ufw` and that nginx is listening on 443 |
| 526 from Cloudflare | Invalid origin certificate — SSL mode is Full (strict) but the cert is wrong or missing |
| Still seeing the old site | Cloudflare cache — purge everything; confirm the page contains `/_next/` |
| Redirect loop | SSL mode set to Flexible; use Full (strict) |
| Build killed | Out of memory — add swap or build off-server |

## Notes

- `src/lib/site.ts` has `url: "https://www.dev-esakki.pp.ua"`. If the domain ever
  changes, update it and rebuild — canonical, Open Graph and sitemap URLs all
  derive from it.
- The contact form still has **no mail transport**. `/api/contact` validates and
  logs, returning `{ ok: true, delivered: false }`. Add a provider before relying
  on it, and keep the API key in an `Environment=` line in the systemd unit or an
  `EnvironmentFile`, never in git.
- Set `GITHUB_TOKEN` the same way if the GitHub panel ever hits rate limits;
  unauthenticated requests get 60/hour per IP.
