/*
 * Copyright (c) 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { bot } from "../main";

export default bot.eventManager.register("ready", async () => {
  // the bot is ready => register and deploy the commands
  await require("../commands");
  bot.InteractionManager.deploy();

  bot.client.user?.presence.set({ status: "online" });

  bot.logger.info("Bot is online and ready");
});
