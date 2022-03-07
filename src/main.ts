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
import { Bot } from "./core/bot";
import { getArgs } from "./utils/getArgs";

config();

export const bot = new Bot();

(async () => {
  // load the plugins from disk
  await bot.PluginManager.loadPlugins();

  // get the args passed to this process and register the modules
  const args = await getArgs(bot);
  bot.PluginManager.registerModules(args);

  // log into the Discord API
  await bot.login();
})();
