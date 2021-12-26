/*
 * Copyright (c) 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/v5/blob/main/LICENSE for details)
 */

import prettyMs from "pretty-ms";
import { messages } from "../../../constants/messages";
import { bot } from "../../../main";
import Default from "../plugin";
import { getGuildLocale } from "../utils/guildLocale";

Default.registerEvent("interactionCreate", async (interaction) => {
  // Type Guard to ensure that interaction is a message command
  if (interaction.isCommand()) {
    const locale = await getGuildLocale(interaction.guildId);

    // get the callback from the callback map and execute
    const callback = bot.InteractionManager.commandCallbacks.get(interaction.commandName);
    if (!callback) return interaction.reply(bot.i18n.__({ phrase: messages.COMMAND_NOT_FOUND, locale }));

    try {
      const started = Date.now();
      await callback(interaction, locale);
      const ended = Date.now();
      bot.logger.info(`${interaction.guild?.name} - ${locale} => execution of command (${interaction.commandName}) took ${prettyMs(ended - started)}`);
    } catch (error) {
      bot.logger.error(`An error ocurred during the execution of command (${interaction.commandName}). => ${error}!`);

      interaction.deferred
        ? interaction.editReply(bot.i18n.__({ phrase: messages.COMMAND_INTERNAL_ERROR, locale }))
        : interaction.reply({ content: bot.i18n.__({ phrase: messages.COMMAND_INTERNAL_ERROR, locale }), ephemeral: interaction.ephemeral || false });
    }
  }
});
