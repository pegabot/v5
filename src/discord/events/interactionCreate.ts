/*
 * Copyright (c) 2021 Nico Finkernagel
 * This code is licensed under the MIT license
 * (see https://github.com/gruselhaus/studip-people-searcher/blob/main/LICENSE.md for details)
 */

import { messages } from "../../constants/messages";
import { bot } from "../../main";
import { getGuildLocale } from "../utils/guildLocale";

bot.eventManager.register("interactionCreate", async (interaction) => {
  //Type Guard to ensure that interaction is a message command
  if (interaction.isCommand()) {
    // get the callback from the callback map and execute
    const callback = bot.InteractionManager.commandCallbacks.get(interaction.commandName);
    const locale = await getGuildLocale(interaction.guildId);

    if (!callback) return interaction.reply(bot.i18n.__({ phrase: messages.COMMAND_NOT_FOUND, locale }));

    try {
      bot.logger.info(`${interaction.guild?.name} - ${locale} => executing (${interaction.commandName})`);
      await callback(interaction, locale);
    } catch (e) {
      interaction.followUp(bot.i18n.__({ phrase: messages.COMMAND_INTERNAL_ERROR, locale }));
    }
  }
});
