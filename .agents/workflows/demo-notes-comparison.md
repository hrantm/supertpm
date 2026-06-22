# Demo Notes Comparison Workflow

Use this workflow when comparing the current demo app to the call notes in `initial_ideas.md`.

## Inputs

- `initial_ideas.md`
- Current React app:
  - `src/App.jsx`
  - `src/data.js`
  - `src/main.jsx` if UI/theme claims matter
- `video_to_prototype_audit.md` if present

## Steps

1. Read `.agents/technical-program-manager.md`.
2. Read `initial_ideas.md`.
3. Extract the core themes from Chris and Areg:
   - AI-enabled Xcelforce resources
   - EM/TPM visibility pain
   - weekly health probe and readout rhythm
   - fragmented delivery signals
   - evidence-backed judgment
   - human-reviewed communication
   - security, SOC 2, data access, and IP concerns
4. Inspect the current app and data.
5. Create a theme-by-theme comparison:
   - represented well
   - partially represented
   - missing
   - overrepresented
   - risky or unsupported
6. Recommend changes in two groups:
   - demo changes worth making now
   - future product/architecture backlog
7. Prepare questions for Chris and Areg that would sharpen the next iteration.

## Output Format

```text
TPM readout

Overall fit

Theme comparison

Well represented

Partially represented

Missing

Too much / distracting

Unsupported implications

Recommended demo changes

Future backlog

Questions for Chris and Areg
```

## Checks

- Does the audit distinguish prototype from production product?
- Does it avoid treating the app as a Jira replacement?
- Does it keep the EM/TPM visibility job central?
- Does it separate product UX gaps from architecture/security gaps?
- Does it produce actionable changes for the demo?
