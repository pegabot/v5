/*
 * Copyright (c) 2021 - 2022 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/v5/blob/main/LICENSE for details)
 */

import { bot } from "../../../main";
import CONspiracy from "../plugin";

CONspiracy.registerCommand({
  data: {
    // generateTranslation "plugin.conspiracy.command.ping.name"
    name: "plugin.conspiracy.command.ping.name",
    // generateTranslation "plugin.conspiracy.command.ping.description"
    description: "plugin.conspiracy.command.ping.description",
  },
  callback: (interaction, locale) => {
    // generateTranslation "plugin.conspiracy.command.ping.response"
    interaction.reply({ content: bot.i18n.__({ phrase: "plugin.conspiracy.command.ping.response", locale }), ephemeral: true });
  },
});
