/*
 * Copyright (c) 2021 Nico Finkernagel
 * This code is licensed under the MIT license
 * (see https://github.com/gruselhaus/studip-people-searcher/blob/main/LICENSE.md for details)
 */

import { ApplicationCommandDataResolvable, Collection, CommandInteraction, Guild, OAuth2Guild } from "discord.js";
import { Bot } from "../bot";

export class InteractionHandler {
  commandData: Array<ApplicationCommandDataResolvable> = new Array();
  commandCallbacks: Map<string, (interaction: CommandInteraction) => Promise<void>> = new Map();

  constructor(private bot: Bot) {}

  register(command: ApplicationCommandDataResolvable, callback: (interaction: CommandInteraction) => Promise<void>) {
    this.bot.logger.info(`registering command (${command.name})`);

    //register the command
    this.commandData.push(command);
    this.commandCallbacks.set(command.name, callback);
  }

  async publish() {
    // get guilds from cache first. If guilds are not present fetch from API.
    let guilds: Collection<string, Guild | OAuth2Guild> = this.bot.client.guilds.cache;

    if (!guilds || guilds.size < 1) {
      guilds = await this.bot.client.guilds.fetch();
    }

    this.bot.logger.info(`publishing ${this.commandData.length} commands on ${guilds.size} servers`);

    //publish the commands on all servers the bot is a member of
    return await Promise.all([
      guilds.forEach(async (guild) => {
        await (guild as Guild)?.commands.set(this.commandData);
      }),
    ]);
  }
}
