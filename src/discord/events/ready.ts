/*
 * Copyright (c) 2021 Nico Finkernagel
 * This code is licensed under the MIT license
 * (see https://github.com/gruselhaus/studip-people-searcher/blob/main/LICENSE.md for details)
 */

import { bot } from "../../main";

export default bot.eventHandler.register("ready", async () => {
  // the bot is ready => register and publish the commands
  await require("../commands");
  bot.interactionHandler.publish();

  bot.client.user?.presence.set({ status: "idle", activities: [{ type: "WATCHING", name: "aus dem Fenster 🪟" }] });

  bot.logger.info("Bot is online and ready");
});
