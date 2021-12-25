/*
 * Copyright (c) 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/v5/blob/main/LICENSE for details)
 */

import prettyMs from "pretty-ms";
import { messages } from "../../../constants/messages";
import { bot } from "../../../main";
import { getGuildLocale } from "../../../utils/guildLocale";
import Default from "../plugin";

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
      bot.logger.info(`${interaction.guild?.name} - ${locale} => executing (${interaction.commandName}) took ${prettyMs(ended - started)}`);
    } catch (e) {
      bot.logger.error(`Error ocurred during execution of (${interaction.commandName}) => ${e}`);

      interaction.followUp({ content: bot.i18n.__({ phrase: messages.COMMAND_INTERNAL_ERROR, locale }), ephemeral: interaction.ephemeral || false });
    }
  }
});