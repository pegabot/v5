/*
 * Copyright (c) 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/v5/blob/main/LICENSE for details)
 */

import { MessageActionRow, MessageButton } from "discord.js";
import { bot } from "../../../main";
import Default from "../plugin";

Default.registerCommand({
  data: {
    permissions: ["ADMINISTRATOR"],
    // generateTranslation "plugin.default.command.invite.name"
    name: "plugin.default.command.invite.name",
    // generateTranslation "plugin.default.command.invite.description"
    description: "plugin.default.command.invite.description",
    type: "CHAT_INPUT",
  },
  callback: async (interaction, locale) => {
    const row = new MessageActionRow().addComponents(
      new MessageButton()
        // generateTranslation "plugin.default.command.invite.buttonText"
        .setLabel(bot.i18n.__({ phrase: "plugin.default.command.invite.buttonText", locale }))
        .setStyle("LINK")
        .setURL(process.env.DEFAULT_INVITE_LINK),
    );

    // generateTranslation "plugin.default.command.invite.response"
    interaction.reply({ content: bot.i18n.__({ phrase: "plugin.default.command.invite.response", locale }), components: [row] });
  },
});
