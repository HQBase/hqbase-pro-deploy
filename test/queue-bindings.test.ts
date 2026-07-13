import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

// biome-ignore format: The suppression must immediately precede this single-line import.
// @ts-expect-error The executable deploy script is intentionally plain ESM.
import { bootstrapQueueConfig, synchronizeQueueConfig } from "../scripts/deploy.mjs";

const root = resolve(import.meta.dirname, "..");

describe("one-click queue bindings", () => {
  it("declares both the primary queue and its dead-letter queue", () => {
    const config = JSON.parse(
      readFileSync(resolve(root, "wrangler.jsonc"), "utf8"),
    );
    const bindings = JSON.parse(
      readFileSync(resolve(root, "package.json"), "utf8"),
    ).cloudflare.bindings;

    expect(config.queues.producers).toEqual(
      expect.arrayContaining([
        { binding: "PRO_JOBS", queue: "hqbase-pro-jobs" },
        { binding: "PRO_JOBS_DLQ", queue: "hqbase-pro-jobs-dlq" },
      ]),
    );
    expect(config.queues.consumers[0].dead_letter_queue).toBe(
      "hqbase-pro-jobs-dlq",
    );
    expect(bindings.PRO_JOBS).toBeDefined();
    expect(bindings.PRO_JOBS_DLQ).toBeDefined();
  });

  it("synchronizes consumer names selected by the one-click form", () => {
    const config = {
      queues: {
        producers: [
          { binding: "PRO_JOBS", queue: "workspace-jobs" },
          { binding: "PRO_JOBS_DLQ", queue: "workspace-jobs-dlq" },
        ],
        consumers: [
          {
            queue: "hqbase-pro-jobs",
            dead_letter_queue: "hqbase-pro-jobs-dlq",
            max_retries: 3,
          },
        ],
      },
    };

    expect(synchronizeQueueConfig(config).queues.consumers).toEqual([
      {
        queue: "workspace-jobs",
        dead_letter_queue: "workspace-jobs-dlq",
        max_retries: 3,
      },
    ]);
  });

  it("does not attach a consumer until the licensed Worker is installed", () => {
    const config = {
      queues: {
        producers: [{ binding: "PRO_JOBS", queue: "workspace-jobs" }],
        consumers: [{ queue: "workspace-jobs", max_retries: 3 }],
      },
    };

    expect(bootstrapQueueConfig(config).queues).toEqual({
      producers: [{ binding: "PRO_JOBS", queue: "workspace-jobs" }],
      consumers: [],
    });
  });
});
