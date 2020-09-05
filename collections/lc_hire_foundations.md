# 运用你的编程能力解决现实问题

## 问题描述

假设我们在业务中有一个需求是将浏览器中的错误上报到日志中心。
在上报前，我们需要在前端先将错误的各种信息序列化为日志中心可以处理的 `JSON` 形式。

## 输入

输入是一个 `Error` 对象，但是在不同的浏览器下它有着细微的区别。

在 `Chrome` 中，我们捕获到的错误的 `stack` 属性是以下格式:

```js
const fixtureStack = `TypeError: Error raised
  at bar http://192.168.31.8:8000/c.js:2:9
  at foo http://192.168.31.8:8000/b.js:4:15
  at calc http://192.168.31.8:8000/a.js:4:3
  at <anonymous>:1:11
  at http://192.168.31.8:8000/a.js:22:3
`;
```

在 `Firefox` 中，我们捕获到的错误的 `stack` 属性是以下格式:

```js
const fixtureFirefoxStack = `
  bar@http://192.168.31.8:8000/c.js:2:9
  foo@http://192.168.31.8:8000/b.js:4:15
  calc@http://192.168.31.8:8000/a.js:4:3
  <anonymous>:1:11
  http://192.168.31.8:8000/a.js:22:3
`;
```

如果 `stack` 中某一行不带文件路径，则忽略掉这行信息

## 输出

日志中心接受这样格式的数据:

```ts
interface ErrorMessage {
    message: string;
    stack: Array<{
        line: number;
        column: number;
        filename: string;
    }>;
}
```

如果输入:

```ts
TypeError: Error raised
  at bar http://192.168.31.8:8000/c.js:2:9
```

则输出:

```ts
{
  message: 'Error raised',
  stack: [
    {
      line: 2,
      column: 9,
      filename: 'http://192.168.31.8:8000/c.js'
    }
  ]
}
```

## 要求

请使用 `TypeScript` 完成 [index.ts](./foundations-zh/src/index.ts) 中的函数.
可以引入部分工具类第三方库，比如 `Lodash`.

## 评判标准

-   完成所描述功能. `50 分`
-   完整的单元测试，覆盖 `输入` 中举例的 `Chrome` 和 `Firefox` 的两个 `Fixture`. `30 分`
-   配置 `lint` 与 `format`. `10 分`
-   配置 `precommit` 与 `commitlint`. `10 分`
-   配置 `CI`, 并且在 `CI` 上运行 `单元测试与 Lint`. `30 分`

# 解题记录

**仓库地址**

https://github.com/suukii/leetcode-hire-foundations_zh

## 初始化

初始化项目：

`npm init`

初始化 GIT 仓库：

`git init`

## 配置 precommit 和 commitlint

安装：

`npm i -D husky @commitlint/cli @commitlint/config-conventional`

> [@commitlint/cli](https://github.com/conventional-changelog/commitlint) 是基于 husky 的，所以得先安装 husky。这里选的是 @commitlint/config-conventional，也可以选择其他规则。

配置 husky hook：

方式 1：`.huskyrc`

```
{
  "hooks": {
    "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
  }
}
```

方式 2：`package.json`

```json
{
    "husky": {
        "hooks": {
            "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
        }
    }
}
```

配置 commitlint：`commitlint.config.js`

```js
module.exports = {
    extends: ['@commitlint/config-conventional'],
};
```

## TypeScript

安装：

`npm i -D typescript ts-node-dev`

> [`ts-node-dev`](https://github.com/whitecolor/ts-node-dev) 监听文件变化，重启 node 程序，可以不装。

初始化配置：

`npx tsc --init`

增加 npm 命令：

```json
{
    "scripts": {
        "dev": "ts-node-dev --respawn --transpile-only ./index.ts"
    }
}
```

> 默认所有 ts 文件都应该放在 src 文件夹中

## 单元测试

安装：

`npm i -D jest ts-jest @types/jest`

> 单元测试用的是 [jest](https://github.com/facebook/jest)，同时还需要安装 Typescript preprocessor [ts-jest](https://github.com/kulshekhar/ts-jest) 和 `@types/jest`

初始化配置：

`npx ts-jest config:init`

在 `tsconfig.json` 中加上以下代码：

```json
{
    "compilerOptions": {
        "types": ["jest"]
    }
}
```

增加 npm 命令：

```json
{
    "scripts": {
        "test": "jest"
    }
}
```

运行测试：

`npx jest` 或者 `npm t`

> `npm t` is short for `npm test`

## ESLint 和 Prettier

安装 Prettier：

`npm i -D prettier eslint-config-prettier eslint-plugin-prettier`

配置：`.prettierrc.js`

```js
module.exports = {
    semi: true,
    trailingComma: 'all',
    singleQuote: true,
    printWidth: 120,
    tabWidth: 4,
    endOfLine: 'crlf',
};
```

安装 ESLint：

`npm i -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin`

配置：`.eslintrc.js`

```js
module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
    },
    extends: [
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
        'plugin:prettier/recommended',
    ],
    rules: {},
};
```

> "plugin:prettier/recommended" 需要放到最后

修改 VSCode 配置：`setting.json`

```json
{
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    }
}
```

> 这相当于自动执行 eslint --fix

## 代码

```ts
interface StackMessage {
    line: number;
    column: number;
    filename: string;
}

export interface ErrorMessage {
    message: string;
    stack: Array<StackMessage>;
}

export function parseError(err: Error): ErrorMessage {
    const stack: Array<string> = (err.stack || '').split('\n').slice(1);

    const parsedStack = stack
        .map(
            (msg: string): StackMessage => {
                const detail =
                    /([^\s|@]+\.[^\.]+)?:(\d+):(\d+)$/.exec(msg) || [];
                const [, filename, line, column] = detail;
                return {
                    line: Number(line),
                    column: Number(column),
                    filename: filename || '',
                };
            },
        )
        .filter((detail: StackMessage): boolean => detail.filename !== '');

    return {
        message: err.message,
        stack: parsedStack,
    };
}
```

## 测试

```ts
import { parseError } from '../src/index';

test('test', () => {
    const error1: Error = {
        name: 'TypeError',
        message: 'Error raised',
        stack: `TypeError: Error raised
          at bar http://192.168.31.8:8000/c.js:2:9
          at foo http://192.168.31.8:8000/b.js:4:15
          at calc http://192.168.31.8:8000/a.js:4:3
          at <anonymous>:1:11
          at http://192.168.31.8:8000/a.js:22:3`,
    };
    const ans1 = {
        message: 'Error raised',
        stack: [
            { line: 2, column: 9, filename: 'http://192.168.31.8:8000/c.js' },
            { line: 4, column: 15, filename: 'http://192.168.31.8:8000/b.js' },
            { line: 4, column: 3, filename: 'http://192.168.31.8:8000/a.js' },
            { line: 22, column: 3, filename: 'http://192.168.31.8:8000/a.js' },
        ],
    };

    expect(parseError(error1)).toStrictEqual(ans1);

    const error2: Error = {
        name: 'Error',
        message: '',
        stack: `
      bar@http://192.168.31.8:8000/c.js:2:9
      foo@http://192.168.31.8:8000/b.js:4:15
      calc@http://192.168.31.8:8000/a.js:4:3
      <anonymous>:1:11
      http://192.168.31.8:8000/a.js:22:3`,
    };

    const ans2 = {
        message: '',
        stack: [
            { line: 2, column: 9, filename: 'http://192.168.31.8:8000/c.js' },
            { line: 4, column: 15, filename: 'http://192.168.31.8:8000/b.js' },
            { line: 4, column: 3, filename: 'http://192.168.31.8:8000/a.js' },
            { line: 22, column: 3, filename: 'http://192.168.31.8:8000/a.js' },
        ],
    };
    expect(parseError(error2)).toStrictEqual(ans2);
});
```

## CI

点击 GitHub 仓库的 Actions 标签，选一个 Action 模板。

> 这里选的是 Node.js。

根据需要修改 `node.js.yml` 并提交修改到仓库中。

```yml
# This workflow will do a clean install of node dependencies, build the source code and run tests across different versions of node
# For more information see: https://help.github.com/actions/language-and-framework-guides/using-nodejs-with-github-actions

name: Node.js CI

on:
    push:
        branches: [master]
    pull_request:
        branches: [master]

jobs:
    test:
        runs-on: ubuntu-latest

        strategy:
            matrix:
                node-version: [10.x]

        steps:
            - uses: actions/checkout@v2
            - name: Use Node.js ${{ matrix.node-version }}
              uses: actions/setup-node@v1
              with:
                  node-version: ${{ matrix.node-version }}
            - run: npm install
            - run: npm run lint
            - run: npm test
```
