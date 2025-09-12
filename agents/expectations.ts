#!/usr/bin/env -S bun run
/**
 * EXPECTATIONS: Launch Claude with the prompts/expectations.md system prompt
 *
 * Usage:
 *   bun run agents/expectations.ts                 # interactive
 *   bun run agents/expectations.ts "<your prompt>"  # with initial user prompt
 */

import { spawn } from "bun";
import type { ClaudeFlags } from "../lib/claude-flags.types";
import { buildClaudeFlags, getPositionals, parsedArgs } from "../lib/flags";
import expectationsPrompt from "../prompts/expectations.md" with { type: "text" };

function resolvePath(relativeFromThisFile: string): string {
  const url = new URL(relativeFromThisFile, import.meta.url);
  return url.pathname;
}

const projectRoot = resolvePath("../");

async function main() {
  const positionals = getPositionals();
  const userPrompt = positionals.join(" ").trim();

  // Merge user-provided flags with our defaults
  const flags = buildClaudeFlags(
    {
      "append-system-prompt": expectationsPrompt,
    },
    parsedArgs.values as ClaudeFlags,
  );
  const args = userPrompt ? [...flags, userPrompt] : [...flags];

  const child = spawn(["claude", ...args], {
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit",
    env: {
      ...process.env,
      CLAUDE_PROJECT_DIR: projectRoot,
    },
  });

  const onExit = () => {
    try {
      child.kill("SIGTERM");
    } catch {}
  };
  process.on("SIGINT", onExit);
  process.on("SIGTERM", onExit);

  await child.exited;
  process.exit(child.exitCode ?? 0);
}

await main();

