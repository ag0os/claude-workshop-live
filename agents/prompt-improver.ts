#!/usr/bin/env -S bun run
/**
 * PROMPT-IMPROVER: Launch Claude with a prompt-engineering system prompt
 *
 * - Appends a system prompt that turns a provided prompt/spec into three
 *   structured Markdown variations plus a brief winner rationale.
 * - Follows the conventions used by other agents in this repo.
 *
 * Usage:
 *   bun run agents/prompt-improver.ts "<your prompt or diagram description>"
 */

import { spawn } from "bun";
import type { ClaudeFlags } from "../lib/claude-flags.types";
import { buildClaudeFlags, getPositionals, parsedArgs } from "../lib/flags";

import promptImproverSystemPrompt from "../system-prompts/prompt-improver-prompt.md" with {
	type: "text",
};

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
			"append-system-prompt": promptImproverSystemPrompt,
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
