[![Netlify Status](https://api.netlify.com/api/v1/badges/e3b752a5-e80b-4c4a-87db-2e7ca6b6d78a/deploy-status?branch=master)](https://app.netlify.com/sites/curate-v2/deploys)

# curate-v2

Decentralized curation protocol for lists on-chain.

> Types and schemas may change — product under development. See **[docs/README.md](docs/README.md)** for types, schemas, and templates.

## Setup

```bash
yarn
```

## Development

**Frontend**

```bash
cd web && yarn start
```

## Project structure

```
contracts/   # CurateV2, CurateFactory
subgraph/    # Subgraph indexing
templates/   # Dispute templates
web/         # Frontend
docs/        # Types, schemas, API reference
```

For deployment, env vars, and more: see `contracts/README.md` and `web/` package scripts.
