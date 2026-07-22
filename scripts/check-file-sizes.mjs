import { readFileSync } from "node:fs";

const trackedFiles = [
  {
    path: "src/screens/account/listings/ui/listings-page.tsx",
    maxLines: 327,
    decision: "decompose on next functional change or document why it remains large",
  },
  {
    path: "src/screens/about/ui/about-page.tsx",
    maxLines: 323,
    decision: "static page can remain large until the next content or interaction change",
  },
  {
    path: "src/widgets/header/ui/HeaderSessionActions.tsx",
    maxLines: 310,
    decision: "decompose on next functional change or document why it remains large",
  },
];

let failed = false;

for (const file of trackedFiles) {
  const contents = readFileSync(file.path, "utf8");
  let lineCount = contents.split("\n").length - 1;

  if (contents.length > 0 && !contents.endsWith("\n")) {
    lineCount += 1;
  }

  if (lineCount > file.maxLines) {
    console.error(
      `${file.path} has ${lineCount} lines, baseline is ${file.maxLines}. ` +
        "Please decompose it or update the baseline with a documented reason.",
    );
    failed = true;
    continue;
  }

  console.log(`${file.path}: ${lineCount}/${file.maxLines} lines (${file.decision})`);
}

if (failed) {
  process.exit(1);
}
