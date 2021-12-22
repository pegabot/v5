/*
 * Copyright (c) 2021 Nico Finkernagel
 * This code is licensed under the MIT license
 * (see https://github.com/gruselhaus/studip-people-searcher/blob/main/LICENSE.md for details)
 */

import { bot } from "../../main";

export default bot.eventManager.register("ready", async () => {
  // the bot is ready => register and deploy the commands
  await require("../commands");
  bot.InteractionManager.deploy();

  bot.client.user?.presence.set({ status: "online" });

  bot.logger.info("Bot is online and ready");
});
