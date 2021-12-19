import { bot } from "../../main";

bot.registerEvent("interactionCreate", async (interaction) => {
  //Type Guard to ensure that interaction is a message command
  if (interaction.isCommand()) {
    // get the callback from the callback map and execute
    const callback = bot.commandCallbacks.get(interaction.commandName);

    if (!callback) return interaction.reply("Der zugehörige Command wurde nicht gefunden");

    try {
      await callback(interaction);
    } catch (e) {
      interaction.followUp("Beim Verarbeiten deiner Anfrage kam es zu einem Fehler!");
    }
  }
});
