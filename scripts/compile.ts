#!/usr/bin/env bun
import { $ } from "bun";
import { basename } from "path";

const input = process.argv[2];
if (!input) {
  console.error("Usage: bun c <typescript-file>");
  process.exit(1);
}

const outputName = basename(input, ".ts");
const outputPath = `./bin/${outputName}`;

// Generate static asset maps so Bun can inline all assets
await $`bun scripts/gen-assets.ts`;

// Build a single-file binary
await $`bun build --compile ${input} --outfile ${outputPath}`;
