/*
 * Copyright (c) 2021 Nico Finkernagel
 * This code is licensed under the MIT license
 * (see https://github.com/gruselhaus/studip-people-searcher/blob/main/LICENSE.md for details)
 */

import { bot } from "../../main";
import { getSearchResult } from "../../studip/bridge";

bot.interactionHandler.register(
  {
    name: "search",
    type: "CHAT_INPUT",
    description: "Suche nach einer Person auf Stud.Ip",
    options: [{ type: "STRING", name: "name", description: "Wie lautete die Person, nach welcher du suchst?", required: true }],
  },
  async (interaction) => {
    await interaction.deferReply();
    const name = interaction.options.getString("name");

    if (!name) return interaction.reply("Es gab einen Fehler, versuche es erneut!");

    const list = await getSearchResult(name);

    if (!list) return interaction.reply("Die Person konnte nicht gefunden werden!");

    await interaction.editReply({ files: [list.screenshot] });
  },
);
