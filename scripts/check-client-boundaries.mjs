import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const sourceRoot = path.resolve("src");
const maximumClientBoundaries = 53;
const sourceFiles = await collectSourceFiles(sourceRoot);
const clientBoundaries = [];
const callbackActionViolations = [];

for (const filePath of sourceFiles) {
  const source = await readFile(filePath, "utf8");

  if (/^(?:"use client"|'use client');?\s/u.test(source)) {
    clientBoundaries.push(filePath);
  }

  for (const match of source.matchAll(/\bon[A-Z][A-Za-z0-9]*Action\b/gu)) {
    callbackActionViolations.push({
      filePath,
      identifier: match[0],
    });
  }
}

if (clientBoundaries.length > maximumClientBoundaries) {
  console.error(
    `Client boundary budget exceeded: ${clientBoundaries.length}/${maximumClientBoundaries}.`,
  );
  process.exitCode = 1;
}

if (callbackActionViolations.length > 0) {
  for (const violation of callbackActionViolations) {
    console.error(
      `${path.relative(process.cwd(), violation.filePath)}: ordinary callback ${violation.identifier} must not use the Action suffix.`,
    );
  }

  process.exitCode = 1;
}

if (process.exitCode === undefined) {
  console.log(
    `Client architecture guard passed: ${clientBoundaries.length}/${maximumClientBoundaries} boundaries, no on*Action callbacks.`,
  );
}

async function collectSourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...await collectSourceFiles(entryPath));
      continue;
    }

    if (entry.isFile() && /\.(?:ts|tsx)$/u.test(entry.name)) {
      files.push(entryPath);
    }
  }

  return files;
}
