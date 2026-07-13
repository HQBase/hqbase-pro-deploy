import { generateKeyPairSync, sign } from "node:crypto";
import { describe, expect, it } from "vitest";
import { verifyManifest } from "../scripts/deploy.mjs";

describe("signed release verification", () => {
  it("accepts a matching Pro manifest and rejects tampering", () => {
    const { privateKey, publicKey } = generateKeyPairSync("ed25519");
    const manifest = {
      format: "hqbase-release-v1",
      edition: "pro",
      channel: "stable",
      version: "1.2.3",
      artifact: { sha256: "a".repeat(64), size: 1 },
    };
    const payload = Buffer.from(JSON.stringify(manifest)).toString("base64url");
    const envelope = {
      payload,
      signature: sign(
        null,
        Buffer.from(payload, "base64url"),
        privateKey,
      ).toString("base64url"),
    };
    const encodedPublic = publicKey
      .export({ type: "spki", format: "der" })
      .toString("base64");
    expect(verifyManifest(envelope, encodedPublic)).toMatchObject({
      version: "1.2.3",
    });
    expect(() =>
      verifyManifest(
        { ...envelope, signature: `A${envelope.signature.slice(1)}` },
        encodedPublic,
      ),
    ).toThrow("signature");
  });
});
