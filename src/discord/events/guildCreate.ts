/*
 * Copyright (c) 2021 Nico Finkernagel
 * This code is licensed under the MIT license
 * (see https://github.com/gruselhaus/studip-people-searcher/blob/main/LICENSE.md for details)
 */

import { bot } from "../../main";

bot.eventManager.register("guildCreate", (guild) => {
  // when the bot joins a new server he has to deploy his commands
  bot.InteractionManager.deploy(guild.id);
});
