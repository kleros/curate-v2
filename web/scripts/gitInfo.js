/* eslint-disable max-len */
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

import packageJson from "../package.json" assert { type: "json" };

const execSyncWrapper = (command) => {
  let stdout = null;
  try {
    stdout = execSync(command).toString().trim();
  } catch (error) {
    console.error(error);
  }
  return stdout;
};

const main = () => {
  let version = packageJson.version;
  let gitCommitHash = execSyncWrapper("git rev-parse HEAD");
  let gitCommitShortHash = execSyncWrapper("git rev-parse --short=7 HEAD");
  let gitBranch = execSyncWrapper("git rev-parse --abbrev-ref HEAD");
  let gitTags = execSyncWrapper("git tag --points-at HEAD  | tr '\n' ',' | sed 's/,$//'");
  let clean =
    execSyncWrapper(`[ -z "$(git status --short  | grep -v '^??')" ] && echo clean || echo dirty`) === "clean";

  const obj = {
    version,
    gitCommitHash,
    gitCommitShortHash,
    gitBranch,
    gitTags,
    clean,
  };

  const filePath = path.resolve("src", "generatedGitInfo.json");
  const fileContents = JSON.stringify(obj, null, 2);

  fs.writeFileSync(filePath, fileContents);
};

main();
