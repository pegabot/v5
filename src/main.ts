/*
 * Copyright (c) 2021 - 2022 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/v5/blob/main/LICENSE for details)
 */

if (!process.env.NODE_ENV) process.env.NODE_ENV = "production";
if (process.env.NODE_ENV === "development") {
  require("source-map-support").install();
}

import { config } from "dotenv";
import yargs from "yargs";
import { Bot } from "./core/bot";

config();

export const bot = new Bot();

(async () => {
  // load the plugins from disk
  await bot.PluginManager.loadPlugins();

  const pluginsWithArg = bot.PluginManager.plugins.filter((p) => p.arg !== undefined);

  const argv = await yargs(process.argv).options(
    pluginsWithArg.reduce((map: { [key: string]: {} }, p) => {
      map[p.name] = {
        type: "boolean",
        description: `Set this arg to enable plugin (${p.name})`,
      };
      return map;
    }, {}),
  ).argv;

  bot.PluginManager.registerModules(argv);

  // await bot.login();
})();
