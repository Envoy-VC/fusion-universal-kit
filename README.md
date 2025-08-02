# Turbo Full-stack Starter

This is a starter kit for bootstrapping full-stack applications with Turborepo. This starter kit is designed to be used with [TurboRepo](https://turborepo.org) and other accompanying starter kits. These are:

- [Next Starter Kit](https://github.com/Envoy-VC/next-starter): End-to-End Type-safe Next.js Starter Kit
- [Vite Starter Kit](https://github.com/Envoy-VC/vite-starter): Vite Starter Kit using `@tanstack/router`
- [Package Starter Kit](https://github.com/Envoy-VC/package-starter): Library Starter Kit using `tsup` and `vitest`
- [@shadcn/ui monorepo](https://github.com/Envoy-VC/shadcn-ui-monorepo): Monorepo `@shadcn/ui` setup

# Features

- 🏎️ Uses [turborepo](https://turborepo.org) for monorepo management.
- 📦 Packages are managed with [pnpm](https://pnpm.io) 
- 🌎 Uses `@biome/biomejs` for code formatting and linting.
- ✅ Uses a strict opinionated linting setup using [klarity](https://github.com/Envoy-VC/klarity).
- 🪝 Uses [lefthook](https://github.com/evilmartians/lefthook) for git hooks.
- 📝 Uses [commitlint](https://github.com/conventional-changelog/commitlint) for commit message formatting.

# Project Structure

The starter kit uses `next-starter` and `shadcn-ui-monorepo` you will have a full-stack application with the following structure:

```
├── packages
│   ├── ui
├── apps
│   ├── web
├── README.md
├── LICENSE
├── .gitignore
├── .npmrc
├── package.json
├── tsconfig.json
├── turbo.json
├── biome.jsonc
├── commitlint.config.ts
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── lefthook.yml
```

---


1. Maker creates Order (Off chain order creation) ✅
2. Taker create a HTLC (off chain compute) ✅
3. Maker deploys Escrow Contract (on chain) ✅
4. Taker Funds the htlc (on chain)
5. Maker reveals secret and claims btc from htlc
6. Taker sees the revealed secret and claims the eth from Escrow