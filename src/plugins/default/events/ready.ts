/*
 * Copyright (c) 2021 - 2022 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/v5/blob/main/LICENSE for details)
 */

import { bot } from "../../../main";
import Default from "../plugin";

Default.registerEvent("ready", async () => {
  bot.logger.info("Bot is online and ready");

  // the bot is ready => deploy the commands
  // on all servers the bot is a member of &
  // setup task executions
  bot.InteractionManager.deploy();
  bot.TaskManager.setupExecutions();

  bot.client.user?.presence.set({ status: "online" });
});
