import { readFile, stat } from "node:fs/promises";
import { gzipSync } from "node:zlib";

const manifestPath = ".next/server/app/page_client-reference-manifest.js";
const routeKey = "/page";
const manifestMarker = `globalThis.__RSC_MANIFEST["${routeKey}"] = `;

const manifestSource = await readFile(manifestPath, "utf8").catch(() => {
  throw new Error("Production build not found. Run `npm run build` first.");
});
const manifestStart = manifestSource.indexOf(manifestMarker);

if (manifestStart === -1) {
  throw new Error(`Route manifest ${routeKey} is missing from ${manifestPath}.`);
}

const jsonStart = manifestStart + manifestMarker.length;
const routeManifest = JSON.parse(manifestSource.slice(jsonStart, manifestSource.lastIndexOf(";")));
const layoutEntry = Object.keys(routeManifest.entryJSFiles)
  .find((entry) => entry.endsWith("/src/app/layout"));

if (!layoutEntry) {
  throw new Error("Client layout entry is missing from the route manifest.");
}

const chunks = await Promise.all(
  routeManifest.entryJSFiles[layoutEntry].map(async (file) => {
    const path = `.next/${file}`;
    const [metadata, contents] = await Promise.all([
      stat(path),
      readFile(path),
    ]);

    return {
      file,
      gzipBytes: gzipSync(contents).length,
      rawBytes: metadata.size,
    };
  }),
);
const total = chunks.reduce(
  (result, chunk) => ({
    gzipBytes: result.gzipBytes + chunk.gzipBytes,
    rawBytes: result.rawBytes + chunk.rawBytes,
  }),
  { gzipBytes: 0, rawBytes: 0 },
);

console.log(JSON.stringify({
  entry: layoutEntry,
  chunkCount: chunks.length,
  ...total,
  chunks: chunks.sort((left, right) => right.gzipBytes - left.gzipBytes),
}, null, 2));
