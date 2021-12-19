import { bot } from "../../main";

export default bot.registerEvent("ready", () => {
  // the bot is ready => load and register the commands
  require("../commands");

  console.log("ONLINE");
});
