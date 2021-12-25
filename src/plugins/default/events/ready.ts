/*
 * Copyright (c) 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/v5/blob/main/LICENSE for details)
 */

import { bot } from "../../../main";
import Default from "../plugin";

Default.registerEvent("ready", async () => {
  // the bot is ready => deploy the commands
  // on all servers the bot is a member of
  bot.InteractionManager.deploy();

  bot.client.user?.presence.set({ status: "online" });

  bot.logger.info("Bot is online and ready");
});
