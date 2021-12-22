/*
 * Copyright (c) 2021 Nico Finkernagel
 * This code is licensed under the MIT license
 * (see https://github.com/gruselhaus/studip-people-searcher/blob/main/LICENSE.md for details)
 */

import { messages } from "../../constants/messages";
import { bot } from "../../main";
import { getGuildLocale, setGuildLocale } from "../utils/guildLocale";

bot.InteractionManager.register(
  {
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
  async (interaction, locale) => {
    const option = interaction.options.getString(bot.i18n.__({ phrase: "language", locale }));
    if (!option) return interaction.reply(bot.i18n.__(messages.COMMAND_TRY_AGAIN));

    const current = await getGuildLocale(interaction.guildId);

    if (current === option) return interaction.reply(bot.i18n.__({ phrase: "Hey, looks like everything will stay the same 🤣", locale }));

    await setGuildLocale(interaction.guildId, option);
    bot.InteractionManager.publish();

    await interaction.reply(
      bot.i18n.__(
        { phrase: `Changed the language from \`{{old}}\` to \`{{new}}\`. It may take a while for the change to be completed.`, locale },
        {
          old: bot.i18n.__({ phrase: current || "none", locale: current }),
          new: bot.i18n.__({ phrase: option, locale: current }),
        },
      ),
    );
  },
);
