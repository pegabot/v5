/*
 * Copyright (c) 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/v5/blob/main/LICENSE for details)
 */

require("source-map-support").install();

import { config } from "dotenv";
import { Bot } from "./core/bot";

config();

export const bot = new Bot();

(async () => {
  // load the event handlers
  require("./events");

  await bot.login();
})();
