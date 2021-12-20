/*
 * Copyright (c) 2021 Nico Finkernagel
 * This code is licensed under the MIT license
 * (see https://github.com/gruselhaus/studip-people-searcher/blob/main/LICENSE.md for details)
 */

import { bot } from "../../main";

export default bot.registerEvent("ready", () => {
  // the bot is ready => load and register the commands
  require("../commands");

  bot.client.user?.presence.set({ status: "idle", activities: [{ type: "WATCHING", name: "aus dem Fenster 🪟" }] });

  console.log("ONLINE");
});
