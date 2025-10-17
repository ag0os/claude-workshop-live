#!/usr/bin/env -S bun run
/**
 * RAILS BACKLOG TASK COORDINATOR: Analyze backlog tasks and coordinate specialized Rails sub-agents
 *
 * This agent reads tasks from backlog.md using the backlog CLI, analyzes them,
 * and coordinates the appropriate specialized sub-agents to accomplish them efficiently.
 *
 * Key capabilities:
 * - Task analysis and understanding
 * - Sub-agent coordination and assignment
 * - Task lifecycle management
 * - Quality assurance and Definition of Done verification
 *
 * Usage:
 *   bun run agents/rails-backlog.ts "Work on task 42"
 *   bun run agents/rails-backlog.ts "What's next on the backlog?"
 *   bun run agents/rails-backlog.ts             # interactive mode
 */

import { spawn } from "bun";

function resolvePath(relativeFromThisFile: string): string {
	const url = new URL(relativeFromThisFile, import.meta.url);
	return url.pathname;
}

const projectRoot = resolvePath("../");
const settingsPath = resolvePath("../settings/rails-backlog.settings.json");
const mcpPath = resolvePath("../settings/rails-backlog.mcp.json");

const args = [
	"--settings",
	settingsPath,
	"--mcp-config",
	mcpPath,
	...process.argv.slice(2),
];

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
