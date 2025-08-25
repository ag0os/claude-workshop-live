# Agents Cheatsheet

Quick reference for running the agents in this repo. Each agent launches a configured Claude session (or related tooling) to focus on a specific job. Prompts enforce structured outputs and safe tool use.

## Prerequisites

- `bun` installed, and `@anthropic-ai/claude-code` CLI on PATH.
- Some agents require: `GEMINI_API_KEY` (Gemini), 1Password CLI `op` (for secrets), a GitHub token (for MCP GitHub).
- From project root, you can run via `bun run agents/<file>.ts[...]` or the compiled binary in `bin/` if available.

## Core Build & Design

### designer — Token‑first design system
- Command:
  - `bun run agents/designer.ts "Design a settings panel"`
- Use when: Establishing/evolving design tokens, atoms → organisms → pages with Storybook/Playwright validation.

### builder — Iterative build partner
- Command:
  - `bun run agents/builder.ts "Implement user settings form from plan.md"`
- Use when: Implementing features phase-by-phase with per‑turn plan/preview/verification/commit.

### refactor — Behavior‑preserving refactors
- Command:
  - `bun run agents/refactor.ts "Refactor auth module into ports/adapters"`
- Use when: Improving structure without behavior changes; includes baselines and churn limits.

### planner — Planning orchestrator (no code changes)
- Commands:
  - Interactive: `bun run agents/planner.ts`
  - Print mode (pass-through flags): `bun run agents/planner.ts -p "Plan a CLI export tool" --print`
- Use when: Converging on a plan (commit sequence, files, tests) before building.

### contain — Project‑scoped, container‑like session
- Command:
  - `bun run agents/contain.ts`
- Use when: You want a standardized, repo‑scoped Claude session with configured MCP/tools.

### chain — Planner → Contain handoff
- Command:
  - `bun run agents/chain.ts "Add CSV export to reports page"`
- Use when: You want to generate a plan first, then immediately execute it in a constrained session.

## Orientation & Docs

### orient — Codebase orientation
- Commands:
  - Full: `bun run agents/orient.ts`
  - Quick: `bun run agents/orient.ts --quick`
  - Focused: `bun run agents/orient.ts --focus commands`
- Use when: Getting oriented on structure, tech stack, commands, and recent changes.

### update-claudemd — Maintain CLAUDE.md
- Commands:
  - Create/update: `bun run agents/update-claudemd.ts`
  - Targeted ask: `bun run agents/update-claudemd.ts "Add new npm scripts"`
- Use when: Creating or refreshing the project’s CLAUDE.md using best practices.

## JSONL & Conversations

### latest — Newest JSONL path/contents
- Commands:
  - Path: `bun run agents/latest.ts`
  - Print: `bun run agents/latest.ts --print`
  - JSON: `bun run agents/latest.ts --json`

### search — Search JSONL conversations
- Examples:
  - `bun run agents/search.ts "docker build"`
  - `bun run agents/search.ts "hooks" --role user,assistant --json`

### conv — Interactive conversation utilities (TUI)
- Commands:
  - Latest: `bun run agents/conv.ts latest`
  - Search: `bun run agents/conv.ts search "token"`
  - Export: `bun run agents/conv.ts export --md --stdout`

### jsonl-formatter — jq recipes over JSONL
- Commands:
  - All recipes: `bun run agents/jsonl-formatter.ts "hello"`
  - Specific: `bun run agents/jsonl-formatter.ts "hello" --recipe=2`
  - TUI: `bun run agents/jsonl-formatter.tsx "hello" --recipe=all`

## Research & Examples

### github-examples — Find real‑world code examples
- Command:
  - `bun run agents/github-examples.ts "TypeScript AST transform for import renames"`
- Notes: Uses GitHub MCP; requires valid token in 1Password or via headers as configured.

### list-mcp-tools — List MCP tools for a server
- Commands:
  - SSE/unauthenticated: `bun run agents/list-mcp-tools.ts https://mcp.deepwiki.com/sse`
  - Authenticated: `bun run agents/list-mcp-tools.ts https://api.githubcopilot.com/mcp --token "Bearer <token>"`

## Video & Gemini

### claude-video — Extract instructions from video, optionally execute
- Commands:
  - `bun run agents/claude-video.ts /path/to/video.mp4`
  - Skip executing in Claude: `... --skipClaude`
- Requires: `GEMINI_API_KEY`.

### gemsum — Summarize a video (Gemini)
- Command:
  - `bun run agents/gemsum.ts /path/to/video.mp4`
- Requires: `GEMINI_API_KEY`.

### print-key — Debug your Gemini key
- Command:
  - `bun run agents/print-key.ts`

## Inference Helpers (Gemini)

### infer — Infer commands or hooks from conversations
- Commands:
  - Commands (latest): `bun run agents/infer.ts -m commands`
  - Hooks (all): `bun run agents/infer.ts -m hooks -c all`
- Notes: Uses 1Password `op` to retrieve Gemini API key.

### infer-commands — Quick command inference
- Command:
  - `bun run agents/infer-commands.ts`
- Notes: Uses 1Password `op` to retrieve Gemini API key.

## Task Execution Patterns

### parallel — Split and run subtasks concurrently
- Command:
  - `bun run agents/parallel.ts "Write a 3‑paragraph story to story.md"`
- Use when: Tasks can be executed independently to speed up throughput.

### claude-mix — Repomix‑powered packing flows
- Command:
  - `bun run agents/claude-mix.ts "Pack repo with repomix for LLM analysis"`
- Use when: You want to pack repositories and feed compact artifacts downstream.

## Tips

- Prefer compiling frequently used agents: `bun compile agents/<name>.ts` (creates `bin/<name>`).
- Many agents accept pass-through flags to the Claude CLI (e.g., `--print`, models, verbosity).
- If you hit permissions or secrets prompts, ensure:
  - You’re signed in to 1Password CLI: `op signin --raw`
  - `GEMINI_API_KEY` is set: `export GEMINI_API_KEY=...`
  - GitHub MCP token is configured when required.

