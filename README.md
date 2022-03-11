# Vite-Plugin-Remain-Exports

这个插件的主旨是为了在使用vite的过程，保留html的入口文件的导出内容。

## 使用场景

对于使用ESModule构建的微前端项目来说，这是很有必要的。

一些框架，比如IceStark，会读取微前端模块的两个生命周期：mount和unmount。

如果无法保留入口文件导出的这两个生命周期，业务将无法进行。

## 使用方式

### 安装

```bash
npm i -D vite-plugin-remain-exports
yarn add -D vite-plugin-remain-exports
pnpm i -D vite-plugin-remain-exports
```

### 使用插件

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
## 详细说明

如下，是一个vite项目，它的入口文件是一个html。

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

而这个html的入口文件就是`/src/main.tsx`。

### vite处理html文件

默认情况下，vite会把html文件转换成如下js代码：

```javascript
import "vite/modulepreload-polyfill";

import "/src/main.tsx";
```

vite是基于rollup的，对于rollup项目而言，html是它的入口文件，在构建的时候，仅会保留这个入口文件的导出内容，而对它的所有依赖进行tree-shaking。

所以为了保留main.tsx文件的导出内容，我们需要一些魔法，这里我引用一个概念，**模块替身**。

### 模块替身

```typescript
// index.ts
export * from 'another.ts'

// another.ts
export const demo = 1;
```

对于外界而言，index.ts 和 another.ts的功能是完全一样的。


### 插件核心

介绍完vite是如何处理html文件的和模块替身概念后，我们可以对html的转换结果做一些修改，把它转换成如下：

```javascript
export * from "vite/modulepreload-polyfill";

export * from "/src/main.tsx";
```

这样一来，对于vite使用者来说，main.tsx就是入口文件，它的导出都可以得以保留。





