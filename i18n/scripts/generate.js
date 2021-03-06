/*
 * Copyright (c) 2021 - 2022 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/v5/blob/main/LICENSE for details)
 */

const path = require("path");
const fs = require("fs");
const { I18n } = require("i18n");
const { glob } = require("glob");
const i18n = new I18n();
const sortJson = require("sort-json");

i18n.configure({
  defaultLocale: "en",
  locales: ["en", "de"],
  objectNotation: true,
  directory: path.join(__dirname, "../locales"),
  syncFiles: true,
});

const processData = () => {
  return new Promise((resolve, reject) => {
    glob(path.resolve(__dirname, "../../src/**/*.ts"), async (error, files) => {
      for (const file of files) {
        const content = fs.readFileSync(file, "utf8");
        const matches = content.match(/\/\/.*generateTranslation.*"/g);
        if (!matches) continue;

        for (const match of matches) {
          const command = match.match(/".*"/);
          console.log(`executing ${command}`);
          eval(`i18n.__(${command})`);
        }
      }

      glob(path.resolve(__dirname, "../**/*.json"), async (error, files) => {
        for (const file of files) {
          sortJson.overwrite(file, { ignoreCase: true, depth: 99999 });
        }
        resolve();
      });
    });
  });
};

(async () => {
  await processData();
  process.exit(0);
})();
