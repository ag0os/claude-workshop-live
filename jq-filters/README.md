# JSONL Formatter JQ Filters

This directory contains individual jq filter scripts that can be used to process Claude's JSONL output. These are designed to be piped from any claude command, giving you maximum flexibility in how you run Claude and process its output.

## Quick Start

1. Run Claude with JSONL output:
```bash
claude "your prompt" --print --output-format json --verbose
```

2. Pipe to any jq filter:
```bash
claude "your prompt" --print --output-format json --verbose | ./jq-filters/assistant-text-reply.jq
```

3. Or test with sample data:
```bash
echo '[{"type":"assistant","message":{"content":[{"type":"text","text":"Hello!"}]}}]' | ./jq-filters/assistant-text-reply.jq
# Output: Hello!
```

## Available Filters

### Assistant's Text Reply
**File:** `assistant-text-reply.jq`
**Purpose:** Extract just the assistant's text response (raw text)
**Example:**
```bash
claude "hello world" --print --output-format json --verbose | ./jq-filters/assistant-text-reply.jq
# Output: Hello! How can I help you today?
```

### Session Summary
**File:** `session-summary.jq`
**Purpose:** Get session statistics, token counts, and cost
**Example:**
```bash
claude "complex task" --print --output-format json --verbose | ./jq-filters/session-summary.jq
# Output: JSON with session_id, models, turns, input_tokens, output_tokens, total_cost_usd
```

### MCP Servers Table
**File:** `mcp-servers-table.jq`
**Purpose:** Display MCP server statuses in a Markdown table
**Example:**
```bash
claude "test" --print --output-format json --verbose | ./jq-filters/mcp-servers-table.jq
# Output:
# | Server | Status |
# |---|---|
# | chrome-devtools | connected |
# | deepwiki | connected |
```

### Tool Counts
**File:** `tool-counts.jq`
**Purpose:** Count available tools and slash commands
**Example:**
```bash
claude "test" --print --output-format json --verbose | ./jq-filters/tool-counts.jq
# Output: {"tool_count": 43, "slash_command_count": 42}
```

### Tools by Origin
**File:** `tools-by-origin.jq`
**Purpose:** Group tools by whether they're core Claude tools or MCP-provided
**Example:**
```bash
claude "test" --print --output-format json --verbose | ./jq-filters/tools-by-origin.jq
# Output: [{"group": "core", "count": 16}, {"group": "chrome-devtools", "count": 24}]
```

### Timeline Summary
**File:** `timeline-summary.jq`
**Purpose:** Create human-readable one-line summaries of each event
**Example:**
```bash
claude "test" --print --output-format json --verbose | ./jq-filters/timeline-summary.jq
# Output: system(init) model=claude-opus-4-1-20250805
#         assistant model=claude-opus-4-1-20250805 text="Hello!"
```

### Duration Analysis
**File:** `duration-analysis.jq`
**Purpose:** Convert durations to seconds and show service tier info
**Example:**
```bash
claude "test" --print --output-format json --verbose | ./jq-filters/duration-analysis.jq
# Output: {"duration_s": 2.53, "duration_api_s": 2.49, "web_searches": 0, "service_tier": "standard"}
```

### Human Sentence
**File:** `human-sentence.jq`
**Purpose:** Format assistant responses as natural language sentences
**Example:**
```bash
claude "hello" --print --output-format json --verbose | ./jq-filters/human-sentence.jq
# Output: claude-opus-4-1-20250805 said: Hello! How can I help you today?
```

## Advanced Usage

### With Custom Claude Settings
```bash
# Use your own Claude configuration
claude "prompt" --settings /path/to/settings.json --mcp-config /path/to/mcp.json --print --output-format json --verbose | ./jq-filters/recipe-2.jq
```

### With Different Output Formats
```bash
# Use stream-json for real-time processing
claude "prompt" --print --output-format stream-json --verbose | ./jq-filters/recipe-7.jq
```

### Chaining with Other Tools
```bash
# Process with jq filter, then format with other tools
claude "prompt" --print --output-format json --verbose | ./jq-filters/recipe-2.jq | jq '.total_cost_usd'
```

### In Scripts
```bash
#!/bin/bash
PROMPT="$1"
echo "Processing: $PROMPT"
claude "$PROMPT" --print --output-format json --verbose | ./jq-filters/recipe-1.jq
```

## Benefits of This Approach

1. **Flexibility**: Use any Claude configuration you want
2. **Modularity**: Each filter is independent and focused
3. **Performance**: No overhead from agent frameworks
4. **Composability**: Easy to chain with other tools
5. **Portability**: Just jq scripts that work anywhere
6. **Maintainability**: Simple, focused scripts are easy to update

## Requirements

- `jq` installed on your system
- Claude CLI with appropriate permissions

## Tips

- All filters expect JSONL input from Claude's `--output-format json` or `--output-format stream-json`
- The `-r` flag in the shebang gives raw output (no JSON quotes) where appropriate
- You can modify these scripts or create your own based on the patterns shown
- Use `--verbose` with Claude to get more detailed output data
