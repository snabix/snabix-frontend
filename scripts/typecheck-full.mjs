import { spawnSync } from "node:child_process";

const knownExternalDiagnostics = [
  /^node_modules\/@radix-ui\/react-popper\/dist\/index\.d\.mts\(\d+,\d+\): error TS2374:/,
  /^node_modules\/@radix-ui\/react-slider\/dist\/index\.d\.mts\(\d+,\d+\): error TS2374:/,
];

const result = spawnSync(
  "npx",
  ["tsc", "--noEmit", "--project", "tsconfig.typecheck-full.json", "--pretty", "false"],
  {
    encoding: "utf8",
    shell: process.platform === "win32",
  },
);

const output = [result.stdout, result.stderr].filter(Boolean).join("\n");
const diagnostics = output
  .split(/\r?\n/)
  .filter((line) => line.trim().length > 0);
const unexpectedDiagnostics = diagnostics.filter(
  (line) => !knownExternalDiagnostics.some((pattern) => pattern.test(line)),
);

if (unexpectedDiagnostics.length > 0 || result.error) {
  if (result.error) {
    console.error(result.error);
  }

  console.error(unexpectedDiagnostics.join("\n"));
  process.exit(result.status === 0 || result.status === null ? 1 : result.status);
}

if (diagnostics.length > 0) {
  console.warn("Ignored known external TypeScript diagnostics:");
  console.warn(diagnostics.join("\n"));
}
