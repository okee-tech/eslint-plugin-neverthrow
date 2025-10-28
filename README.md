# eslint-plugin-neverthrow

ESLint plugin to enforce proper handling of Result types from the [neverthrow](https://github.com/supermacro/neverthrow) package.
Plugin [NPM](https://www.npmjs.com/package/@okee-tech/eslint-plugin-neverthrow)

## Installation

```bash
npm install -D @okee-tech/eslint-plugin-neverthrow
# or
yarn add -D @okee-tech/eslint-plugin-neverthrow
```

## Configuration Node (flat config)

**File:** `eslint.config.ts`

```typescript
import neverthrowPlugin from "@okee-tech/eslint-plugin-neverthrow";
import TSESLint from "typescript-eslint";

export default [
  // Use default config
  neverthrowPlugin.configs.node,
  // Or have custom config
  {
    plugins: { neverthrowPlugin },
    languageOptions: {
      parser: TSESLint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        projectService: {
          allowDefaultProject: ["*.ts"],
        },
      },
    },
    rules: {
      "@okee-tech/eslint-plugin-neverthrow/must-consume-result": "error",
    },
  },
];
```

Ensures that Result objects returned from functions are properly handled.

## Configuration Nuxt

_provided default config for Nuxt works only for nuxt >= 4.0.0_

**File:** `eslint.config.mjs`

```typescript
// @ts-check
import neverthrowPlugin from "@okee-tech/eslint-plugin-neverthrow";
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt(neverthrowPlugin.configs.nuxt);
```

✅ Valid:

```typescript
// Direct method calls
genResult().unwrapOr("default");
genResult().isOk();

// Assigned and consumed
const result = genResult();
result._unsafeUnwrap();

// Chained references
const r1 = genResult();
const r2 = r1;
r2.isOk();

// Returned from functions
function example() {
  return genResult();
}
```

❌ Invalid:

```typescript
// Result not consumed
genResult();

// Result assigned but not used
const result = genResult();
```

## Rules

<!-- begin auto-generated rules list -->

🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).\
💡 Manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).\
💭 Requires [type information](https://typescript-eslint.io/linting/typed-linting).

| Name                                                     | Description                                                                   | 🔧  | 💡  | 💭  |
| :------------------------------------------------------- | :---------------------------------------------------------------------------- | :-- | :-- | :-- |
| [must-consume-result](docs/rules/must-consume-result.md) | Enforce proper handling of Result objects returned from neverthrow operations | 🔧  | 💡  | 💭  |

<!-- end auto-generated rules list -->

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
