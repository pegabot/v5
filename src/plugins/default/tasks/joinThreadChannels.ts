/*
 * Copyright (c) 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/v5/blob/main/LICENSE for details)
 */

import { bot } from "../../../main";
import Default from "../plugin";

Default.registerTask({
  name: "join thread channels",
  interval: 5000,
  callback: async () => {
    (await bot.client.guilds.fetch()).forEach(async (guild) => {
      (await guild?.fetch())?.channels.cache.forEach(async (channel) => {
        if (!channel.isThread()) return;
        if (channel.joinable) {
          channel.join();
          bot.logger.info(`joined thread channel (${channel.name}) on guild (${guild.name})`);
        }
      });
    });
  },
});
