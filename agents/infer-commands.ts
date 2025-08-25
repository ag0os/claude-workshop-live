#!/usr/bin/env -S bun run
import { GoogleGenAI } from "@google/genai";
import { $ } from "bun";
import { encoding_for_model } from "tiktoken";
import gitCommitCommandExample from "../infer/examples/commands/git-commit.md" with {
	type: "text",
};
import { getClaudeProjectsPath } from "../lib/claude";
import { readMostRecentJsonlAsText } from "../lib/jsonl";

// Get key from https://aistudio.google.com/apikey
// Store it in 1Password
// op item create --category="API Credential" --title="GEMINI_API_KEY_FREE" --vault="Employee" credential="<your-api-key>"
const apiKey = (
	await $`op item get "GEMINI_API_KEY_FREE" --fields credential --reveal`
		.quiet()
		.text()
).trim();

if (!apiKey) {
	console.error(
		"Failed to retrieve GEMINI_API_KEY from 1Password. Ensure 'op' is signed in and the item exists.",
	);
	process.exit(1);
}

const ai = new GoogleGenAI({
	apiKey,
});

// /Users/johnlindquist/.claude/projects/-Users-johnlindquist-dev-claude-hooks
// Get system username
// get pwd

const projectPath = await getClaudeProjectsPath();

// Read the most recent JSONL file
const result = await readMostRecentJsonlAsText(projectPath);
if (!result) {
	console.error("No JSONL files found");
	process.exit(1);
}

const systemPrompt = `
# Commands Extractor

You are given a JSONL that contains a conversation between a user and Claude Code.

## Steps
1. Read the JSONL file
2. Find where the user instructs Claude Code to take action
3. Extract the user's instructions into commands

## Example Commands

<example>
${gitCommitCommandExample}
</example>
`.trim();

// Count tokens before sending to Gemini
const encoder = encoding_for_model("gpt-4");
const tokens = encoder.encode(result.text);
console.log(`Token count for result.text: ${tokens.length}`);
encoder.free();

const response = await ai.models.generateContent({
	model: "gemini-2.5-pro",
	contents: [
		{
			role: "model",
			parts: [
				{
					text: systemPrompt,
				},
			],
		},
		{
			role: "user",
			parts: [
				{
					text: result.text,
				},
			],
		},
	],
});

const command = response.candidates?.[0]?.content?.parts?.[0]?.text;

console.log(command);
