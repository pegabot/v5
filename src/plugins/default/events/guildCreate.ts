/*
 * Copyright (c) 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/v5/blob/main/LICENSE for details)
 */

import { bot } from "../../../main";
import Default from "../plugin";

Default.registerEvent("guildCreate", (guild) => {
  // when the bot joins a new server he has to deploy his commands
  bot.InteractionManager.deploy(guild.id);
});
