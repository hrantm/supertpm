# Feature Build Workflow

Use this workflow when adding or changing a product feature.

## 1. Architect Pass

Read `.agents/architect.md`.

Answer:

- What user/business problem does this feature solve?
- What data does it imply?
- Does it require real integrations?
- Does it imply customer data egress?
- Does it create security/IP claims?
- What is MVP scope versus later scope?

Output:

```text
Architecture recommendation
MVP boundaries
Risks / unsupported claims
```

## 2. UI/UX Designer Pass

Read `.agents/ui-ux-designer.md`.

Answer:

- Where should this feature live?
- What should the user understand immediately?
- What labels should be used?
- What should be removed or downplayed?
- How should the interaction work?

Output:

```text
Design intent
Screen placement
Interaction behavior
Copy/labels
Polish checklist
```

## 3. Frontend Developer Pass

Read `.agents/frontend-developer.md`.

Implement the approved change.

Requirements:

- Keep the change scoped.
- Use existing React/MUI/lucide patterns.
- Update hardcoded data if needed.
- Run `pnpm build`.
- Report warnings.

Output:

```text
Files changed
Behavior changed
Verification
Known limitations
```

## 4. Final Review

Check:

- Does this still position Program Pulse as visibility, not project management?
- Does it keep humans in control?
- Does it avoid implying unsupported live integrations?
- Does the build pass?
- Is the demo story stronger?
