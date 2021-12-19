import { bot } from "../../main";

bot.registerEvent("interactionCreate", (interaction) => {
  //Type Guard to ensure that interaction is a message command
  if (interaction.isCommand()) {
    // get the callback from the callback map and execute
    const callback = bot.commandCallbacks.get(interaction.commandName);

    if (!callback) return interaction.reply("Der zugehörige Command wurde nicht gefunden");

    callback(interaction);
  }
});
