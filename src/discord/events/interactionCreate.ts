/*
 * Copyright (c) 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
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
      bot.logger.error(`Error ocurred during execution of (${interaction.commandName}) => ${e}`);

      interaction.followUp({ content: bot.i18n.__({ phrase: messages.COMMAND_INTERNAL_ERROR, locale }), ephemeral: interaction.ephemeral || false });
    }
  }
});
