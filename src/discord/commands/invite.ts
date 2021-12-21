/*
 * Copyright (c) 2021 Nico Finkernagel
 * This code is licensed under the MIT license
 * (see https://github.com/gruselhaus/studip-people-searcher/blob/main/LICENSE.md for details)
 */

import { MessageActionRow, MessageButton } from "discord.js";
import { bot } from "../../main";
import { getLocale } from "../utils/locales";

bot.InteractionManager.register({ name: "invite", description: "Invite this bot to your server!", type: "CHAT_INPUT" }, async (interaction) => {
  const locale = await getLocale(interaction.guildId);
  bot.i18n.setLocale(locale);

  const row = new MessageActionRow().addComponents(
    new MessageButton().setLabel(bot.i18n.__("Invite this bot")).setStyle("LINK").setURL(process.env.INVITE_LINK),
  );

  interaction.reply({ content: bot.i18n.__("Here you go 🎉"), components: [row] });
});
