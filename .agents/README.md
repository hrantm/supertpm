# Program Pulse Agents

This folder defines lightweight role agents for working on Program Pulse.

Use them as reusable instruction files before starting a feature, review, or architecture decision. They are not separate services; they are operating roles with clear responsibilities and output formats.

## Agents

- `ui-ux-designer.md`  
  Owns product experience, screen clarity, layout, visual polish, interaction quality, labels, and demo readiness.

- `architect.md`  
  Owns architecture, data flow, security, integrations, deployment choices, SOC 2 implications, and technical tradeoffs.

- `frontend-developer.md`  
  Owns React implementation, component structure, responsive behavior, build quality, and frontend verification.

## Recommended Flow

For a new feature:

1. Architect defines boundaries and risks.
2. UI/UX Designer defines the experience.
3. Frontend Developer implements.
4. UI/UX Designer reviews polish and usability.
5. Architect checks whether the UI implies unsupported technical claims.

For a design-only polish task:

1. UI/UX Designer audits.
2. Frontend Developer implements.
3. UI/UX Designer verifies.

For an architecture question:

1. Architect analyzes options.
2. UI/UX Designer identifies how the decision should be explained to users/buyers.
3. Frontend Developer implements only if a UI artifact is needed.

## Ground Rules

- Program Pulse is not a Jira replacement.
- It is a visibility layer for EMs and TPMs who are overloaded by fragmented delivery signals.
- The prototype is frontend-only with hardcoded data unless explicitly changed.
- Do not imply live integrations, autonomous writes, or production security controls unless they actually exist.
- Keep Chris/Areg's core thinking in mind:
  - Xcelforce-enabled resources.
  - EM/TPM visibility.
  - evidence-backed weekly intelligence.
  - human judgment remains in control.
  - IP protection and customer trust are major architecture concerns.
