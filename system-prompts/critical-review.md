## Critical Review (per your “sparring partner” rules)

Use this as a generic addendum to append or prepend to any prompt to reinforce critical, outcome‑oriented behavior and verification discipline.

### Universal Best Practices Addendum
- Private scratchpad: critique privately; do not reveal chain-of-thought.
- Structured output: When used, emit a compact <review> block containing:
  <assumptions>bulleted list</assumptions>
  <counterpoints>bulleted list</counterpoints>
  <stress_tests>bulleted scenarios and outcomes</stress_tests>
  <alternatives>viable alternative approaches</alternatives>
  <recommendations>actionable changes to the plan/prompt</recommendations>
  </review>

**1) Assumptions you’re making**

* *Three options are always optimal.* This constrains exploration and prevents “none of the above.” You partially mitigate this with “I choose 2 but …,” but that still nudges toward premature convergence.
* *State file + Git is worth the duplication.* It offers machine‑readable audits and human diffs, but raises drift risk unless the schema is validated and commits are atomic.
* *Verification plans can be decided a priori.* In reality, verification often evolves with implementation; over‑specifying early can waste time. These prompts enforce a useful discipline but may feel rigid under ambiguity.

**2) Counterpoints**

* *Speed vs. ceremony.* For small fixes, this process may feel heavy. The Fix prompt insists on a failing test first—a best practice—but it can be overkill for trivial content changes unless you allow a “fast path.”
* *Tooling coupling.* Storybook/Chrome DevTools MCP/Vitest are great defaults, but CLI apps, libraries, or data pipelines need different verification. The prompts assume a web‑app bias.
* *Dictation fidelity.* The Feature prompt relies on accurate transcription. If the dictation is messy, the three interpretations might all anchor on a misheard premise.

**3) Stress‑testing the logic**

* *Feature with ambiguous scope:* The Intake phase forces three interpretations with explicit out‑of‑scope and risks. That guards against scope creep and creates testable acceptance criteria before code—sound under pressure.
* *Flaky bug:* The Fix prompt’s repro-first rule will block progress until flakiness is tamed. That’s correct engineering but frustrating; still, it’s the only reliable way to prove you fixed the right thing.
* *Large refactor:* The Refactor prompt’s baseline + micro‑commits + churn cap reduces risk and keeps PRs reviewable. The strangler/adapter/ports choices are a solid triad that covers most refactors.

**4) Alternative perspectives**

* *Outcome‑driven adjustments:* Allow a “discovery spike” option that explicitly doesn’t commit code, only learning artifacts, when uncertainty is high.
* *Risk‑based branching:* Permit relaxing ceremony for low‑risk docs/content changes while enforcing the full workflow for code paths that touch critical systems.
* *Domain‑agnostic verification:* Swap Storybook/Chrome DevTools MCP with contract tests and snapshot testing for service‑only repos to avoid UI bias.

**5) Truth over agreement**
These prompts impose a disciplined loop that prevents common failure modes: unverified features, “works on my machine” fixes, and risky refactors. The rigidity is a feature, not a bug, for workshops that teach **trustable AI‑assisted development**. The cost is overhead on small tasks and a mild bias toward web‑centric tooling. If you adopt them as defaults and consciously permit exceptions for trivial or non‑web tasks, they will improve clarity, auditability, and correctness without becoming process theater.

