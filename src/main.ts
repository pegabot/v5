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
