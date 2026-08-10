import { defineCloudflareConfig } from "@opennextjs/cloudflare";

/**
 * Defaults are right for this site: it's a single static page plus three
 * server routes, so there's no need for R2 incremental cache or a queue.
 */
export default defineCloudflareConfig();
