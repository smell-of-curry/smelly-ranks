import * as esbuild from "esbuild";
import * as fsExtra from "fs-extra";
const isDev = process.argv[2] === "dev";

const dir = "./scripts";

if (!fsExtra.pathExists(dir)) {
  fsExtra.mkdirSync(dir);
}
fsExtra.emptyDirSync(dir);

esbuild
  .build({
    entryPoints: ["src/index.ts"],
    bundle: true,
    outfile: "scripts/index.js",
    minify: !isDev,
    platform: "neutral",
    external: ["@minecraft/server", "@minecraft/server-ui"],
    legalComments: isDev ? "none" : "none",
  })
  .then((_r) => {
    console.log(
      `\x1b[33m%s\x1b[0m`,
      `[${new Date().toLocaleTimeString()}]`,
      `Built for ${isDev ? "development" : "production"}...`
    );
  });
