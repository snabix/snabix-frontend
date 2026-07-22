import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          message:
            "Ordinary callback props must use names such as onChange or onRetry. Reserve the Action suffix for real Server Actions.",
          selector: "Identifier[name=/^on[A-Z][A-Za-z0-9]*Action$/]",
        },
      ],
    },
  },
  {
    files: ["src/shared/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              message:
                "FSD boundary violation: shared may not import app, entities, features, screens, or widgets.",
              regex:
                "^(?:@/src/(?:app|entities|features|screens|widgets)(?:/|$)|(?:\\.\\./)+(?:app|entities|features|screens|widgets)(?:/|$))",
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    ".next-e2e-*/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
