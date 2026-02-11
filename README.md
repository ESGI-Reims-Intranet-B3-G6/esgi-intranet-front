# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Project Setup

```bash
$ npm install
$ cp .env.example .env
# edit .env variables for your environment...
```

## Development server

`npm run dev`

## Build

`npm run build`

## Pre-commit setup

`npx husky init`  
If using GitHub Desktop on Windows, and it doesn't work, check your PATH environment variable and make sure C:\Program Files\Git\bin is added before %SystemRoot%\system32 and C:\Program Files\Git\cmd
