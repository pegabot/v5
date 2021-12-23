/*
 * Copyright (c) 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { MessageActionRow, MessageButton } from "discord.js";
import { bot } from "../main";

bot.InteractionManager.register({ name: "invite", description: "Invite this bot to your server!", type: "CHAT_INPUT" }, async (interaction, locale) => {
  const row = new MessageActionRow().addComponents(
    new MessageButton()
      .setLabel(bot.i18n.__({ phrase: "Invite this bot", locale }))
      .setStyle("LINK")
      .setURL(process.env.INVITE_LINK),
  );

  interaction.reply({ content: bot.i18n.__({ phrase: "Here you go 🎉", locale }), components: [row] });
});
