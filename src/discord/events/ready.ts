import { bot } from "../../main";

export default bot.registerEvent("ready", () => {
  // the bot is ready => load and register the commands
  require("../commands");

  bot.client.user?.presence.set({ status: "idle", activities: [{ type: "WATCHING", name: "aus dem Fenster 🪟" }] });

  console.log("ONLINE");
});
