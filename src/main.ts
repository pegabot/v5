/*
 * Copyright (c) 2021 Nico Finkernagel
 * This code is licensed under the MIT license
 * (see https://github.com/gruselhaus/studip-people-searcher/blob/main/LICENSE.md for details)
 */

require("source-map-support").install();

import { config } from "dotenv";
import { Bot } from "./discord/bot";

config();

export const bot = new Bot();

(async () => {
  // Load the event handlers
  require("./discord/events");

  await bot.login();
})();
