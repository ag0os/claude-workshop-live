#!/usr/bin/env -S bun run
import { parseArgs } from "node:util";
import { query } from "@anthropic-ai/claude-agent-sdk";
import { $ } from "bun";
import systemPrompt from "../prompts/claude-mix.md" with { type: "text" };

const args = parseArgs({
	allowPositionals: true,
});

const userPrompt = args.positionals[0];

if (!userPrompt) {
	console.error("Usage: bun run agents/claude-mix.ts <prompt>");
	process.exit(1);
}

const response = query({
	prompt: userPrompt,
	options: {
		systemPrompt: systemPrompt,
		mcpServers: {},

		allowedTools: ["Bash(repomix:*)"],
		pathToClaudeCodeExecutable: await (async () => {
			// Check for CLAUDE_PATH environment variable first
			if (process.env.CLAUDE_PATH) {
				return process.env.CLAUDE_PATH;
			}
			try {
				const cmd = process.platform === "win32" ? "where" : "which";
				const p = (await $`${cmd} claude`.text()).trim();
				if (!p) {
					throw new Error("Claude CLI not found in PATH");
				}
				return p;
			} catch {
				console.error("Error: Claude CLI not found in PATH");
				console.error(
					"Please install it: npm install -g @anthropic-ai/claude-code",
				);
				console.error(
					"Or set CLAUDE_PATH environment variable to your Claude executable",
				);
				process.exit(1);
			}
		})(),
	},
});

try {
	for await (const chunk of response) {
		if (
			chunk.type === "assistant" &&
			chunk.message.content[0]?.type === "text"
		) {
			process.stdout.write(chunk.message.content[0].text);
		} else {
			process.stderr.write(JSON.stringify(chunk, null, 2));
		}
	}
} catch (error) {
	console.error(
		"\nError during agent execution:",
		error instanceof Error ? error.message : String(error),
	);
	process.exit(1);
}
