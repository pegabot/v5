/*
 * Copyright (c) 2021 - 2022 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/v5/blob/main/LICENSE for details)
 */

import { messages } from "../../../constants/messages";
import { bot } from "../../../main";
import Default from "../plugin";
import { setGuildLocale } from "../utils/guildLocale";

Default.registerCommand({
  data: {
    permissions: ["ADMINISTRATOR"],
    // generateTranslation "plugin.default.command.language.name"
    name: "plugin.default.command.language.name",
    // generateTranslation "plugin.default.command.language.description"
    description: "plugin.default.command.language.description",
    type: "CHAT_INPUT",
    options: [
      {
        required: true,
        // generateTranslation "plugin.default.command.language.option.language.name"
        name: "plugin.default.command.language.option.language.name",
        type: "STRING",
        // generateTranslation "plugin.default.command.language.option.language.description"
        description: "plugin.default.command.language.option.language.description",
        choices: [
          // generateTranslation "plugin.default.command.language.option.language.choice.de"
          { name: "plugin.default.command.language.option.language.choice.de", value: "de" },
          // generateTranslation "plugin.default.command.language.option.language.choice.en"
          { name: "plugin.default.command.language.option.language.choice.en", value: "en" },
        ],
      },
    ],
  },
  callback: async (interaction, _, current) => {
    // generateTranslation "plugin.default.command.language.option.language.name"
    const option = interaction.options.getString(bot.i18n.__({ phrase: "plugin.default.command.language.option.language.name", locale: current }));
    if (!option) return interaction.reply(bot.i18n.__(messages.COMMAND_TRY_AGAIN));

    // generateTranslation "plugin.default.command.language.same"
    if (current === option) return interaction.reply(bot.i18n.__({ phrase: "plugin.default.command.language.same", locale: current }));

    await setGuildLocale(interaction.guildId, option);
    bot.InteractionManager.deploy(interaction.guild?.id as string);

    await interaction.reply(
      bot.i18n.__(
        // generateTranslation "plugin.default.command.language.response"
        { phrase: "plugin.default.command.language.response", locale: option },
        {
          // generateTranslation "plugin.default.command.language.locale.de"
          // generateTranslation "plugin.default.command.language.locale.en"
          // generateTranslation "plugin.default.command.language.locale.none"
          old: bot.i18n.__({ phrase: `plugin.default.command.language.locale.${current || "none"}`, locale: option }),
          new: bot.i18n.__({ phrase: `plugin.default.command.language.locale.${option}`, locale: option }),
        },
      ),
    );
  },
});
