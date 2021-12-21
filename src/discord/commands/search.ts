/*
 * Copyright (c) 2021 Nico Finkernagel
 * This code is licensed under the MIT license
 * (see https://github.com/gruselhaus/studip-people-searcher/blob/main/LICENSE.md for details)
 */

import { messages } from "../../constants/messages";
import { bot } from "../../main";
import { getSearchResult } from "../../studip/search";
import { getLocale } from "../utils/locales";

bot.InteractionManager.register(
  {
    name: "search",
    type: "CHAT_INPUT",
    description: "Search for a person on Stud.Ip",
    options: [{ type: "STRING", name: "name", description: "Wie lautete die Person, nach welcher du suchst?", required: true }],
  },
  async (interaction) => {
    await interaction.deferReply();

    const locale = await getLocale(interaction.guildId);
    bot.i18n.setLocale(locale);

    const name = interaction.options.getString("name");
    if (!name) return interaction.reply(bot.i18n.__(messages.COMMAND_INTERNAL_ERROR));

    const list = await getSearchResult(name);
    if (!list) return interaction.reply(bot.i18n.__(messages.COMMAND_INTERNAL_ERROR));

    if (list?.users.length) return interaction.reply(bot.i18n.__(messages.COMMAND_USER_NOT_FOUND));

    // TODO: this command needs attention and currently fails
    // await interaction.editReply({ files: [list.screenshot] });
  },
);
