/*
 * Copyright (c) 2021 Nico Finkernagel
 * This code is licensed under the MIT license
 * (see https://github.com/gruselhaus/studip-people-searcher/blob/main/LICENSE.md for details)
 */

import { bot } from "../../main";
import { getLocale, setLocale } from "../utils/locales";

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
  async (interaction) => {
    const option = interaction.options.getString("language");
    if (!option) return;

    const current = await getLocale(interaction.guildId);

    await setLocale(interaction.guildId, option);

    bot.i18n.setLocale(option);
    await interaction.reply(
      bot.i18n.__(`Changed the language from \`{{old}}\` to \`{{new}}\``, { old: bot.i18n.__(current || "none"), new: bot.i18n.__(option) }),
    );
  },
);
