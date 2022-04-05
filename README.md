[_简体中文_](README.zh-cn.md) | _English_

# Vite-Plugin-Remain-Exports

This plugin is aimed to remaining the exports from entry scripts that imported by entry HTML.

## 1. Use case

It is important for those micro frond-end project builded with ES-Module style.

Some micro frond-end framework, like IceStark, need each micro modules export two life-cycle: mount and unmount.

If entry scripts can't export those two life-cycle, the micro module would't been rendered to page.

## 2. Usage

### 2.1 Install

```bash
npm i -D vite-plugin-remain-exports
yarn add -D vite-plugin-remain-exports
pnpm i -D vite-plugin-remain-exports
```

### 2.2 Using plugin

```ts
import remainExports from 'vite-plugin-remain-exports'

// @see https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // ...other plugins
    remainExports(),
  ],
})
```

## 3. Core Theory

As follow, it is an entry html in vite project：

```HTML
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/src/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

And the entry scripts imported by entry html is `/src/main.tsx`.

### 3.1 How entry html was handled by vite

By default, vite will transfer the entry html to the following js code:

```javascript
import "vite/modulepreload-polyfill";

import "/src/main.tsx";
```

The build process of vite is based on rollup. For the rollup project, entry html is the entry file. And in the build process, rollup will only remain the exports of entry file, then tree-shaking other depends.

So for remaining the entry scripts (`main.tsx`) exports, we need some magic. Here leading in a concept -- module double.

### 3.2 Module double

```typescript
// index.ts
export * from 'another.ts'

// another.ts
export const demo = 1;
```

For importers, `index.ts` and `another.ts` is working the same.

### 3.3 Plugin core

After introducing how entry html was handled by vite and the module double concept, we can modify the transfer result of entry html, as following:

```javascript
export * from "vite/modulepreload-polyfill";

export * from "/src/main.tsx";
```

Thus, for vite user, the entry scripts （`main.tsx`）work as the entry file, and the exports of them will can be remained.
