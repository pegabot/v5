/*
 * Copyright (c) 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { bot } from "../../main";

bot.eventManager.register("guildCreate", (guild) => {
  // when the bot joins a new server he has to deploy his commands
  bot.InteractionManager.deploy(guild.id);
});
