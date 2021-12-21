/*
 * Copyright (c) 2021 Nico Finkernagel
 * This code is licensed under the MIT license
 * (see https://github.com/gruselhaus/studip-people-searcher/blob/main/LICENSE.md for details)
 */

import { messages } from "../../constants/messages";
import { bot } from "../../main";
import { getSearchResult } from "../../studip/search";

bot.InteractionManager.register(
  {
    name: "search",
    type: "CHAT_INPUT",
    description: "Search for a person on Stud.Ip",
    options: [{ type: "STRING", name: "name", description: "What's the name of the person you are looking for?", required: true }],
  },
  async (interaction, locale) => {
    await interaction.deferReply();

    const name = interaction.options.getString("name");
    if (!name) {
      interaction.editReply(bot.i18n.__({ phrase: messages.COMMAND_INTERNAL_ERROR, locale }));
      return;
    }

    const list = await getSearchResult(name);
    if (!list) {
      interaction.editReply(bot.i18n.__({ phrase: messages.COMMAND_INTERNAL_ERROR, locale }));
      return;
    }

    if (list?.users.length < 1 || !list.screenshot) {
      interaction.editReply(bot.i18n.__({ phrase: messages.COMMAND_USER_NOT_FOUND, locale }));
      return;
    }

    await interaction.editReply({ files: [list.screenshot] });
  },
);
