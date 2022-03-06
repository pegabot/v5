/*
 * Copyright (c) 2021 - 2022 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/v5/blob/main/LICENSE for details)
 */

import { bot } from "../../../main";
import Default from "../../default/plugin";

Default.registerCommand({
  data: {
    // generateTranslation "plugin.default.command.ping.name"
    name: "plugin.default.command.ping.name",
    // generateTranslation "plugin.default.command.ping.description"
    description: "plugin.default.command.ping.description",
  },
  callback: (interaction, locale) => {
    // generateTranslation "plugin.default.command.ping.response"
    interaction.reply({ content: bot.i18n.__({ phrase: "plugin.default.command.ping.response", locale }), ephemeral: true });
  },
});
