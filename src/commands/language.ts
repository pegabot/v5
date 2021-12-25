/*
 * Copyright (c) 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/v5/blob/main/LICENSE for details)
 */

import { messages } from "../constants/messages";
import { bot } from "../main";
import { setGuildLocale } from "../utils/guildLocale";

bot.InteractionManager.register({
  data: {
    permissions: ["ADMINISTRATOR"],
    name: "language",
    description: "Set the language this bot uses on this server",
    type: "CHAT_INPUT",
    options: [
      {
        required: true,
        name: "language",
        type: "STRING",
        description: "Choose a language for this server",
        choices: [
          { name: "German", value: "de" },
          { name: "English", value: "en" },
        ],
      },
    ],
  },
  callback: async (interaction, current) => {
    const option = interaction.options.getString(bot.i18n.__({ phrase: "language", locale: current }));
    if (!option) return interaction.reply(bot.i18n.__(messages.COMMAND_TRY_AGAIN));

    if (current === option) return interaction.reply(bot.i18n.__({ phrase: "Hey, looks like everything will stay the same 🤣", locale: current }));

    await setGuildLocale(interaction.guildId, option);
    bot.InteractionManager.deploy(interaction.guild?.id as string);

    await interaction.reply(
      bot.i18n.__(
        { phrase: `Changed the language from \`{{old}}\` to \`{{new}}\`. It may take a while for the change to be completed.`, locale: option },
        {
          old: bot.i18n.__({ phrase: current || "none", locale: option }),
          new: bot.i18n.__({ phrase: option, locale: option }),
        },
      ),
    );
  },
});
