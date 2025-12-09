## Claude Code Power User Workshop: FAQ

Curated from attendee questions and live answers. Where discussion was incomplete, references are included for definitive guidance.

### How do I install Claude Code?

- macOS/Linux/WSL (npm): `npm install -g @anthropic-ai/claude-code`
- Native installer (beta): `curl -fsSL https://claude.ai/install.sh | bash`
- Start in a project: `cd your-project && claude`

Docs: [Set up Claude Code](https://docs.anthropic.com/en/docs/claude-code/setup)

### Which plan do I need to use Claude Code?

- Pro: Includes Claude Code in terminal/IDE.
- Max: Includes Claude Code with higher usage.
- Team/Enterprise: Claude Code is available separately (pay-as-you-go via Console/API).

Docs: [Pricing](https://www.anthropic.com/pricing), [Manage costs effectively](https://docs.anthropic.com/en/docs/claude-code/costs)

### Where do I add Claude Code to my IDE?

- Use the IDE integration instructions in the setup docs and ensure `claude` is on your PATH.

Docs: [Add Claude Code to your IDE](https://docs.anthropic.com/en/docs/claude-code/setup)

### Does Claude Code support custom slash commands with arguments?

Yes. Create markdown commands in `.claude/commands/`. Use `$ARGUMENTS` in the command body and pass them after the command name (e.g., `/fix-issue 1234`).

Docs: [Slash commands](https://docs.anthropic.com/en/docs/claude-code/slash-commands)

### Can hooks run format/lint/tests only on changed files?

Claude hooks don’t track git state by default. Create custom hook logic (e.g., run `git diff --name-only HEAD` to target changed files) or use git pre-commit hooks/CI steps to format and test.

Docs: [Hooks reference](https://docs.anthropic.com/en/docs/claude-code/hooks)

### Chrome DevTools MCP: will it keep my login session?

Yes—persist and reuse auth by keeping Chrome open with your logged-in session. The Chrome DevTools MCP connects to an existing Chrome instance, so your session state is maintained as long as Chrome is running.

Docs: [Chrome DevTools MCP](https://github.com/anthropics/anthropic-quickstarts/tree/main/mcp-chrome-devtools)

### What is JSONL and why use it for logs/streams?

JSONL (JSON Lines) stores one JSON object per line—great for streaming, big logs, and incremental parsing. It’s not the same as `jq` (a JSON processor).

References: [JSON Lines examples](https://jsonlines.org/examples/), [What is JSONL?](https://jsonltools.com/what-is-jsonl)

### Do XML tags actually improve prompting?

Yes. Use XML-like tags (e.g., `<instructions>`, `<data>`, `<format>`) to structure prompts and outputs for higher accuracy.

Docs: [Use XML tags](https://docs.anthropic.com/en/docs/use-xml-tags), [Long context tips](https://docs.anthropic.com/en/docs/long-context-window-tips)

### How do I connect Chrome DevTools (or other tools) via MCP?

- Add an MCP server entry pointing at the server command (often via `npx`).
- For Claude Desktop, edit `claude_desktop_config.json` and restart; for Cursor, edit `~/.cursor/mcp.json` or project `.cursor/mcp.json`.

References: [Chrome DevTools MCP](https://github.com/anthropics/anthropic-quickstarts/tree/main/mcp-chrome-devtools), [Claude Desktop MCP setup](https://help.emporiaenergy.com/en/articles/11519323-claude-desktop-mcp-setup)

### Can I run Claude Code itself as an MCP server?

Yes. Run `claude mcp serve` and connect from MCP clients.

Reference: [Claude Code MCP Server overview](https://playbooks.com/mcp/claude-code)

### GitHub Actions for Claude Code: how do I ensure formatting?

Add a workflow step to run your formatter (e.g., Prettier/biome) after the Claude Code action completes, or enforce via pre-commit hooks.

Reference: Search examples for `anthropics/claude-code-action` on GitHub. Docs: [GitHub Actions](https://docs.anthropic.com/en/docs/claude-code/github-actions)

### Recommended shell tools and GH CLI?

Install `gh` so Claude can manage PRs/issues from the terminal more effectively.

Reference: [Claude Code best practices](https://www.anthropic.com/engineering/claude-code-best-practices)

### Does “container-use” (cuse) train on my code?

No. It’s a local container execution wrapper/sandbox for agent workflows; your code isn’t sent for training.

Reference: [dagger/container-use](https://github.com/dagger/container-use)

### Superwhisper: local vs cloud?

Superwhisper supports local and cloud speech-to-text models. For strict privacy, run a local model (e.g., Parakeet) and feed transcripts into Claude Code as needed.

### Any quick tips for large codebases and cost control?

- Keep `CLAUDE.md` concise and hierarchical; generate with `/init`, then prune.
- Ask Claude to plan first (Plan Mode) before edits.
- Use `/compact` and clear context between tasks.

Docs: [Best practices](https://www.anthropic.com/engineering/claude-code-best-practices), [Cost management](https://docs.anthropic.com/en/docs/claude-code/costs)

### How do I add MCP servers to Claude Code (scopes)?

Use `claude mcp add` with `--scope` (`local`, `project`, or `user`) or `claude mcp add-json` to register servers. Restart clients after changes.

Reference: Example guide on adding servers: [Adding MCP servers](https://mehmetbaykar.com/posts/adding-mcp-servers-in-claude-code/)

### n8n: Is self-host free and what are the limits?

The Community Edition is free for self-hosting with unlimited workflows; advanced enterprise features (environments, SSO, log streaming, etc.) are paid.

References: [Community edition features](https://docs.n8n.io/hosting/community-edition-features/), [Self-hosted features (community thread)](https://community.n8n.io/t/self-hosted-available-features/42599), [Pricing](https://n8n.io/pricing/)


