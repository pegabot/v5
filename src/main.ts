/*
 * Copyright (c) 2021 - 2022 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/v5/blob/main/LICENSE for details)
 */

import { config } from "dotenv";
import { createLogger, format, transports } from "winston";
import { Bot } from "./core/bot";
import { getArgs } from "./utils/getArgs";

const logger = createLogger({
  transports: [new transports.Console({ level: "debug" })],
  format: format.combine(format.errors({ stack: true }), format.splat(), format.colorize(), format.simple()),
});

// if the NODE_ENV is not set we default to production
if (!process.env.NODE_ENV) process.env.NODE_ENV = "production";

// this enables source map support for development with TypeScript
if (process.env.NODE_ENV === "development") {
  try {
    require("source-map-support").install();
  } catch (error) {
    logger.warn("source-map-support can't be enabled. missing dependency!");
  }
}

config();

export const bot = new Bot(logger);

(async () => {
  // load the plugins from disk
  await bot.PluginManager.loadPlugins();

  // get the args passed to this process and register the modules
  const args = await getArgs(bot);
  bot.PluginManager.registerModules(args);

  // log into the Discord API
  await bot.login();
})();
