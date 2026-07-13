#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { createHash, createPublicKey, verify } from "node:crypto";
import {
  cpSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const publicKey =
  "MCowBQYDK2VwAyEAsVwKniCvpHDwbbnjTPP0SuIIG97cRL+iFBQvay9OrU4=";
const billingUrl = "https://billing.hqbase.io";

export async function deploy() {
  const configFile = resolve(root, "wrangler.jsonc");
  synchronizeQueueConfigFile(configFile);
  if (!process.env.HQBASE_PRO_LICENSE_KEY) {
    const bootstrapConfigFile = resolve(root, ".wrangler-bootstrap.jsonc");
    const config = JSON.parse(readFileSync(configFile, "utf8"));
    writeFileSync(
      bootstrapConfigFile,
      `${JSON.stringify(bootstrapQueueConfig(config), null, 2)}\n`,
    );
    try {
      run(
        "pnpm",
        ["exec", "wrangler", "deploy", "--config", bootstrapConfigFile],
        root,
      );
    } finally {
      rmSync(bootstrapConfigFile, { force: true });
    }
    console.log(
      "HQBase Pro installer deployed. Open the Worker URL to finish installation.",
    );
    return;
  }
  if (!process.env.HQBASE_INSTALLATION_ID)
    throw new Error("HQBASE_INSTALLATION_ID is required for licensed builds.");

  const workspace = mkdtempSync(resolve(tmpdir(), "hqbase-pro-release-"));
  try {
    const envelope = await json(`${billingUrl}/v1/releases/pro/stable`);
    const manifest = verifyManifest(envelope, publicKey);
    const authorization = await json(
      `${billingUrl}/v1/releases/pro/${manifest.version}/authorize`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          licenseKey: process.env.HQBASE_PRO_LICENSE_KEY,
          installationId: process.env.HQBASE_INSTALLATION_ID,
          hostname: process.env.HQBASE_WORKER_NAME ?? "hqbase-pro",
          appVersion: manifest.version,
        }),
      },
    );
    const artifactResponse = await fetch(authorization.artifactUrl, {
      headers: { authorization: `Bearer ${authorization.downloadToken}` },
    });
    if (!artifactResponse.ok)
      throw new Error(
        `Licensed release download failed (${artifactResponse.status}).`,
      );
    const bytes = Buffer.from(await artifactResponse.arrayBuffer());
    if (
      bytes.length !== manifest.artifact.size ||
      createHash("sha256").update(bytes).digest("hex") !==
        manifest.artifact.sha256
    )
      throw new Error("Release artifact integrity check failed.");
    const archive = resolve(workspace, "release.tar.gz");
    const source = resolve(workspace, "source");
    writeFileSync(archive, bytes);
    run("mkdir", ["-p", source], root);
    run("tar", ["-xzf", archive, "-C", source], root);
    const config = JSON.parse(
      readFileSync(resolve(root, "wrangler.jsonc"), "utf8"),
    );
    config.main = "worker/index.ts";
    config.assets = {
      directory: "./dist",
      binding: "ASSETS",
      not_found_handling: "single-page-application",
    };
    config.vars = { ...config.vars, HQBASE_APP_VERSION: manifest.version };
    delete config.secrets;
    writeFileSync(
      resolve(source, "wrangler.jsonc"),
      `${JSON.stringify(config, null, 2)}\n`,
    );
    cpSync(
      resolve(root, "pnpm-workspace.yaml"),
      resolve(source, "pnpm-workspace.yaml"),
    );
    run("pnpm", ["install", "--frozen-lockfile"], source);
    run("pnpm", ["build"], source);
    run(process.execPath, ["scripts/hqbase-pro/deploy.mjs"], source, {
      HQBASE_TARGET_VERSION: manifest.version,
    });
  } finally {
    rmSync(workspace, { recursive: true, force: true });
  }
}

export function bootstrapQueueConfig(config) {
  return {
    ...config,
    queues: {
      ...config.queues,
      // The installer has no queue() handler. The licensed release attaches
      // the consumer after its handler has been deployed.
      consumers: [],
    },
  };
}

export function synchronizeQueueConfig(config) {
  const producers = config.queues?.producers ?? [];
  const jobs = producers.find((producer) => producer.binding === "PRO_JOBS");
  const deadLetters = producers.find(
    (producer) => producer.binding === "PRO_JOBS_DLQ",
  );
  if (!jobs?.queue || !deadLetters?.queue) {
    throw new Error(
      "Both PRO_JOBS and PRO_JOBS_DLQ queues must be configured.",
    );
  }

  return {
    ...config,
    queues: {
      ...config.queues,
      consumers: (config.queues?.consumers ?? []).map((consumer) => ({
        ...consumer,
        queue: jobs.queue,
        dead_letter_queue: deadLetters.queue,
      })),
    },
  };
}

function synchronizeQueueConfigFile(configFile) {
  const config = JSON.parse(readFileSync(configFile, "utf8"));
  writeFileSync(
    configFile,
    `${JSON.stringify(synchronizeQueueConfig(config), null, 2)}\n`,
  );
}

export function verifyManifest(envelope, publicKeyBase64 = publicKey) {
  if (
    !envelope ||
    typeof envelope.payload !== "string" ||
    typeof envelope.signature !== "string"
  )
    throw new Error("Release manifest envelope is invalid.");
  const key = createPublicKey({
    key: Buffer.from(publicKeyBase64, "base64"),
    format: "der",
    type: "spki",
  });
  if (
    !verify(
      null,
      Buffer.from(envelope.payload, "base64url"),
      key,
      Buffer.from(envelope.signature, "base64url"),
    )
  )
    throw new Error("Release manifest signature is invalid.");
  const manifest = JSON.parse(
    Buffer.from(envelope.payload, "base64url").toString("utf8"),
  );
  if (
    manifest.format !== "hqbase-release-v1" ||
    manifest.edition !== "pro" ||
    manifest.channel !== "stable" ||
    !/^\d+\.\d+\.\d+/.test(manifest.version) ||
    !/^[a-f0-9]{64}$/.test(manifest.artifact?.sha256)
  )
    throw new Error("Release manifest is incompatible.");
  return manifest;
}

async function json(url, init) {
  const response = await fetch(url, init);
  if (!response.ok)
    throw new Error(
      `Release service rejected the request (${response.status}).`,
    );
  return response.json();
}
function run(command, args, cwd, extraEnv = {}) {
  execFileSync(command, args, {
    cwd,
    env: { ...process.env, ...extraEnv },
    stdio: "inherit",
  });
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === resolve(import.meta.filename)
) {
  await deploy();
}
