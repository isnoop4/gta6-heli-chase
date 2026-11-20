import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? ".";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "out";
const sourcePath = join(botDir, "VIDEO.json");

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

if (!existsSync(sourcePath)) {
  fail(`VIDEO.json not found at ${sourcePath} (MAKEFUN_BOT_DIR=${botDir})`);
}

let parsed: unknown;
try {
  parsed = JSON.parse(readFileSync(sourcePath, "utf8"));
} catch {
  fail(`VIDEO.json at ${sourcePath} is not valid JSON`);
}

const url =
  typeof parsed === "object" && parsed !== null
    ? (parsed as Record<string, unknown>).url
    : undefined;
if (typeof url !== "string" || url.trim() === "") {
  fail(`VIDEO.json at ${sourcePath} must contain a non-empty string field "url"`);
}
if (!url.startsWith("http://") && !url.startsWith("https://")) {
  fail(`VIDEO.json "url" must start with http:// or https://, got: ${url}`);
}

mkdirSync(outDir, { recursive: true });
copyFileSync(sourcePath, join(outDir, "VIDEO.json"));
