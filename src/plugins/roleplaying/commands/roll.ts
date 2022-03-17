/*
 * Copyright (c) 2021 - 2022 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/v5/blob/main/LICENSE for details)
 */

import { ButtonInteraction, MessageActionRow, MessageAttachment, MessageButton, TextChannel } from "discord.js";
import { messages } from "../../../constants/messages";
import { ModifiedInteraction } from "../../../core/types/discord";
import { bot } from "../../../main";
import { fetchWithTimeout } from "../../../utils/fetchWithTimeout";
import Roleplaying from "../plugin";
import { RollbutlerEmbed, rollDice } from "../utils/RollButler";

Roleplaying.registerCommand({
  data: {
    // generateTranslation "plugin.roleplaying.command.roll.name"
    name: "plugin.roleplaying.command.roll.name",

    // generateTranslation "plugin.roleplaying.command.roll.description"
    description: "plugin.roleplaying.command.roll.description",

    options: [
      {
        required: true,
        // generateTranslation "plugin.roleplaying.command.roll.option.command.name"
        name: "plugin.roleplaying.command.roll.option.command.name",
        type: "STRING",
        // generateTranslation "plugin.roleplaying.command.roll.option.command.description"
        description: "plugin.roleplaying.command.roll.option.command.description",
      },
    ],
  },
  callback: async (interaction, locale, guildLocale) => {
    await interaction.deferReply();
    const dice = interaction.options.getString(bot.i18n.__({ phrase: "plugin.roleplaying.command.roll.option.command.name", locale: guildLocale }));

    if (!dice || dice.match(/([\dßo]{4,}[dw]|[\dßo]{2,}[dw][\dßo]{6,}|^\/teste?)/i)) return;

    roll(dice, interaction, locale);
  },
  buttons: new Map<string, (interaction: ButtonInteraction, locale: string) => void>().set("reroll", async (interaction, locale) => {
    await interaction.deferReply();
    const dice = await Roleplaying.store.get(`roll-dice-${interaction.message.id}`);

    // generateTranslation "plugin.roleplaying.command.roll.dice_not_found"
    if (!dice) return interaction.reply(bot.i18n.__({ phrase: "plugin.roleplaying.command.roll.dice_not_found", locale }));

    roll(dice, interaction, locale);
  }),
});

const roll = async (dice: string, interaction: ModifiedInteraction | ButtonInteraction, locale: string) => {
  let rollbutlerResponse: any = await rollDice(dice, locale);

  try {
    rollbutlerResponse = JSON.parse(rollbutlerResponse);
  } catch (error) {
    Roleplaying.logger.warn(`an error occured while parsing the response recieved from RollButler => response: ${rollbutlerResponse}, error: ${error}`);
    return interaction.editReply(bot.i18n.__({ phrase: messages.COMMAND_INTERNAL_ERROR, locale }));
  }

  const channel = await interaction.channel?.fetch();
  if (!channel) return interaction.editReply(bot.i18n.__({ phrase: messages.COMMAND_INTERNAL_ERROR, locale }));

  const successRow = new MessageActionRow().addComponents(
    // generateTranslation "plugin.roleplaying.command.roll.reroll"
    new MessageButton()
      .setCustomId("Roleplaying.reroll")
      .setEmoji("🎲")
      .setStyle("PRIMARY")
      .setLabel(bot.i18n.__({ phrase: "plugin.roleplaying.command.roll.reroll", locale })),
    // generateTranslation "plugin.roleplaying.command.roll.rules"
    new MessageButton()
      .setStyle("LINK")
      .setEmoji("📄")
      .setLabel(bot.i18n.__({ phrase: "plugin.roleplaying.command.roll.rules", locale }))
      .setURL("https://jaegers.net/rbtlri"),
  );

  const errorRow = new MessageActionRow().addComponents(
    // generateTranslation "plugin.roleplaying.command.roll.rules"
    new MessageButton()
      .setStyle("LINK")
      .setEmoji("📄")
      .setLabel(bot.i18n.__({ phrase: "plugin.roleplaying.command.roll.rules", locale }))
      .setURL("https://jaegers.net/rbtlri"),
  );

  const success: boolean = !rollbutlerResponse.message.match(/.*fehlgeschlagen.*/);

  let replied;
  if (rollbutlerResponse?.image) {
    const result: any = await fetchWithTimeout(`https:${rollbutlerResponse.image}?${new Date().getTime()}`);
    const buffer = await result.buffer();
    replied = await (channel as TextChannel).send({
      content: rollbutlerResponse.message,
      files: [new MessageAttachment(buffer)],
      components: success === true ? [successRow] : [errorRow],
    });
  } else {
    const embed = RollbutlerEmbed(dice, interaction.user, rollbutlerResponse);
    replied = await (channel as TextChannel).send({ embeds: [embed], components: success === true ? [successRow] : [errorRow] });
  }

  // generateTranslation "plugin.roleplaying.command.roll.response"
  interaction.editReply({ content: bot.i18n.__({ phrase: "plugin.roleplaying.command.roll.response", locale }) });
  if (!success) return;

  Roleplaying.store.set(`roll-dice-${replied.id}`, dice, 1000 * 3600 * 24);
};
