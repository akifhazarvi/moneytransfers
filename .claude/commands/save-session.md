Save a structured session summary to help resume work in a future conversation.

Analyze the current conversation and write a session file to `~/.claude/sessions/` with this exact format:

**Filename**: `YYYY-MM-DD-<short-descriptive-id>-session.md`

**Template**:

```
# Session: <short title>
Date: <today's date>
Branch: <current git branch>

## What We Were Working On
<1-3 sentences describing the goal>

## What WORKED (with evidence)
- <thing that worked> — <proof: file path, commit hash, test output>
- ...

## What Did NOT Work (with exact failure reasons)
- <thing that failed> — <exact error message or reason>
- ...

## What Has NOT Been Tried
- <potential approach not yet explored>
- ...

## Current State of Files
- <list of files modified/created in this session>

## Decisions Made
- <key decisions and their rationale>

## Blockers
- <anything preventing progress, or "None">

## Exact Next Step
<the single most important thing to do next session>
```

After writing the file, confirm the path so it can be loaded in a future session.
