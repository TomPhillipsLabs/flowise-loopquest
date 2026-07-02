# flowise-loopquest

A [Flowise](https://flowiseai.com) tool node for [LoopQuest](https://loopquest.tomphillips.uk) — give an agent a **human-in-the-loop** step. Before doing something consequential, the agent calls the tool, a person reviews it in a quick game, and the **verdict returns to the agent** so it can proceed or stop.

## How it works

Flowise chatflows can't natively pause, so the tool runs a **blocking gate**: it creates a review task in `gate` mode, then polls `GET /api/v1/tasks/{id}` until the task resolves (or the fail-closed timeout fires), and returns a readable verdict string to the agent. No webhooks, no second flow. (Set **Mode = monitor** to create the review and return immediately without waiting.)

## What's in it

- **LoopQuest Human Review** (Tool node) — exposes a `request_human_review` tool to the agent. Config: game (Swiper, Versus, Sorter, Detective, Fixer, Redact, Grounding), mode (gate/monitor), gate timeout, max wait, poll interval. The LLM supplies `content` (and `title` / `claim` / `source` for grounding).
- **LoopQuest API** (credential) — an API key (Workspaces → API keys) and an optional Base URL for self-hosted deployments.

## Layout

Files mirror their destination in the Flowise monorepo:

| File | Monorepo path |
|------|---------------|
| `packages/components/nodes/tools/LoopQuest/LoopQuest.ts` | the tool node (`INode`) |
| `packages/components/nodes/tools/LoopQuest/core.ts` | pure helpers (task body + verdict formatting), unit-tested |
| `packages/components/nodes/tools/LoopQuest/loopquest.svg` | node icon |
| `packages/components/credentials/LoopQuestApi.credential.ts` | the API-key credential |

## Develop

```bash
npm test     # unit tests for the pure core (node --test)
```

The node itself compiles inside the Flowise monorepo (it imports Flowise internals + `@langchain/core/tools`). To publish, contribute these files to [FlowiseAI/Flowise](https://github.com/FlowiseAI/Flowise) and open a PR, or drop them into a self-hosted Flowise `packages/components` build.

## API endpoints used

| Purpose | Call |
|---------|------|
| Create gate task | `POST /api/v1/tasks` |
| Poll for the verdict | `GET /api/v1/tasks/{id}` |

Full API: https://loopquest.tomphillips.uk/docs · spec: https://loopquest.tomphillips.uk/openapi.json

## License

MIT
