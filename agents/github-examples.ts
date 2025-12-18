#!/usr/bin/env -S bun run
import { parseArgs } from "node:util";
import { type McpServerConfig, query } from "@anthropic-ai/claude-agent-sdk";
import { $ } from "bun";
import systemPrompt from "../prompts/github-examples.md" with { type: "text" };

const args = parseArgs({
	allowPositionals: true,
});

const userPrompt = args.positionals[0];

if (!userPrompt) {
	console.error(
		"Usage: bun run agents/github-examples.ts <code snippet or description>",
	);
	process.exit(1);
}

// Get GitHub token from 1Password with session management
const getGitHubToken = async () => {
	try {
		// First, ensure we're signed in with biometric unlock
		// This will prompt for fingerprint/TouchID only once per session
		await $`op signin --raw`.quiet();

		// Now get the token
		const result =
			await $`op item get "Github CLI Token" --fields password --reveal`.quiet();
		if (!result) {
			console.error("Failed to retrieve GitHub token from 1Password");
			process.exit(1);
		}
		return result.text().trim();
	} catch (error: unknown) {
		console.error(
			"Failed to retrieve GitHub token from 1Password:",
			error instanceof Error ? error.message : String(error),
		);
		process.exit(1);
	}
};

// Debug logging removed - system prompt is now properly used

const disallowedTools = [
	"Task",
	"Bash",
	"Glob",
	"Grep",
	"LS",
	"ExitPlanMode",
	"Read",
	"Edit",
	"MultiEdit",
	// "Write", // Allow Write to save examples
	"NotebookRead",
	"NotebookEdit",
	"WebFetch",
	"TodoWrite",
	// "WebSearch",
	"mcp__github__add_comment_to_pending_review",
	"mcp__github__add_issue_comment",
	"mcp__github__assign_copilot_to_issue",
	"mcp__github__cancel_workflow_run",
	"mcp__github__create_and_submit_pull_request_review",
	"mcp__github__create_branch",
	"mcp__github__create_issue",
	"mcp__github__create_or_update_file",
	"mcp__github__create_pending_pull_request_review",
	"mcp__github__create_pull_request",
	"mcp__github__create_pull_request_with_copilot",
	"mcp__github__create_repository",
	"mcp__github__delete_file",
	"mcp__github__delete_pending_pull_request_review",
	"mcp__github__delete_workflow_run_logs",
	"mcp__github__dismiss_notification",
	"mcp__github__download_workflow_run_artifact",
	"mcp__github__fork_repository",
	"mcp__github__get_code_scanning_alert",
	"mcp__github__get_commit",
	"mcp__github__get_dependabot_alert",
	"mcp__github__get_discussion",
	"mcp__github__get_discussion_comments",
	"mcp__github__get_issue",
	"mcp__github__get_issue_comments",
	"mcp__github__get_job_logs",
	"mcp__github__get_me",
	"mcp__github__get_notification_details",
	"mcp__github__get_pull_request",
	"mcp__github__get_pull_request_comments",
	"mcp__github__get_pull_request_diff",
	"mcp__github__get_pull_request_files",
	"mcp__github__get_pull_request_reviews",
	"mcp__github__get_pull_request_status",
	"mcp__github__get_secret_scanning_alert",
	"mcp__github__get_tag",
	"mcp__github__get_workflow_run",
	"mcp__github__get_workflow_run_logs",
	"mcp__github__get_workflow_run_usage",
	"mcp__github__list_branches",
	"mcp__github__list_code_scanning_alerts",
	"mcp__github__list_commits",
	"mcp__github__list_dependabot_alerts",
	"mcp__github__list_discussion_categories",
	"mcp__github__list_discussions",
	"mcp__github__list_issues",
	"mcp__github__list_notifications",
	"mcp__github__list_pull_requests",
	"mcp__github__list_secret_scanning_alerts",
	"mcp__github__list_tags",
	"mcp__github__list_workflow_jobs",
	"mcp__github__list_workflow_run_artifacts",
	"mcp__github__list_workflow_runs",
	"mcp__github__list_workflows",
	"mcp__github__manage_notification_subscription",
	"mcp__github__manage_repository_notification_subscription",
	"mcp__github__mark_all_notifications_read",
	"mcp__github__merge_pull_request",
	"mcp__github__push_files",
	"mcp__github__request_copilot_review",
	"mcp__github__rerun_failed_jobs",
	"mcp__github__rerun_workflow_run",
	"mcp__github__run_workflow",
	"mcp__github__search_users",
	"mcp__github__submit_pending_pull_request_review",
	"mcp__github__update_issue",
	"mcp__github__update_pull_request",
	"mcp__github__update_pull_request_branch",
	"ListMcpResourcesTool",
	"ReadMcpResourceTool",
];

const allowedTools = [
	"Write",
	"mcp__github__search_code",
	"mcp__github__search_issues",
	"mcp__github__search_orgs",
	"mcp__github__search_pull_requests",
	"mcp__github__search_repositories",
	"mcp__github__get_file_contents",
];

const githubToken = await getGitHubToken();

if (!githubToken) {
	console.error("Failed to retrieve GitHub token from 1Password");
	process.exit(1);
}

const mcpServers: Record<string, McpServerConfig> = {
	github: {
		url: "https://api.githubcopilot.com/mcp/",
		headers: {
			Authorization: `Bearer ${githubToken}`,
		},
		type: "http",
	},
};

// Resolve Claude CLI path
const claudePath = await (async () => {
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
})();

const response = query({
	prompt: userPrompt,
	options: {
		pathToClaudeCodeExecutable: claudePath,
		systemPrompt: systemPrompt,
		allowedTools,
		disallowedTools,
		mcpServers,
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
