/*
 * Copyright (c) 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/v5/blob/main/LICENSE for details)
 */

import { bot } from "../main";
import { deleteGuildLocale } from "../utils/guildLocale";

bot.EventManager.register("guildDelete", (guild) => {
  // when the bot leaves a guild he needs to delete all configs related to this guild
  deleteGuildLocale(guild.id);
});
