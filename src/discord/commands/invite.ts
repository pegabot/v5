/*
 * Copyright (c) 2021 Nico Finkernagel
 * This code is licensed under the MIT license
 * (see https://github.com/gruselhaus/studip-people-searcher/blob/main/LICENSE.md for details)
 */

import { MessageActionRow, MessageButton } from "discord.js";
import { bot } from "../../main";

bot.interactionHandler.register({ name: "invite", description: "Lade diesen Bot auf deinen Server ein!", type: "CHAT_INPUT" }, async (interaction) => {
  const row = new MessageActionRow().addComponents(new MessageButton().setLabel("Diesen Bot einladen").setStyle("LINK").setURL(process.env.INVITE_LINK));
  interaction.reply({ content: "Here you go 🎉", components: [row] });
});
