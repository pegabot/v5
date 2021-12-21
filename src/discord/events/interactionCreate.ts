/*
 * Copyright (c) 2021 Nico Finkernagel
 * This code is licensed under the MIT license
 * (see https://github.com/gruselhaus/studip-people-searcher/blob/main/LICENSE.md for details)
 */

import { bot } from "../../main";
import { getLocale } from "../utils/locales";

bot.eventManager.register("interactionCreate", async (interaction) => {
  //Type Guard to ensure that interaction is a message command
  if (interaction.isCommand()) {
    // get the callback from the callback map and execute
    const callback = bot.InteractionManager.commandCallbacks.get(interaction.commandName);

    if (!callback) return interaction.reply("Der zugehörige Command wurde nicht gefunden");

    try {
      const locale = await getLocale(interaction.guildId);
      bot.i18n.setLocale(locale);
      await callback(interaction);
    } catch (e) {
      interaction.followUp("Beim Verarbeiten deiner Anfrage kam es zu einem Fehler!");
    }
  }
});
