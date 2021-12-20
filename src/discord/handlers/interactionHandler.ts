/*
 * Copyright (c) 2021 Nico Finkernagel
 * This code is licensed under the MIT license
 * (see https://github.com/gruselhaus/studip-people-searcher/blob/main/LICENSE.md for details)
 */

import { ApplicationCommandDataResolvable, CommandInteraction } from "discord.js";
import { Bot } from "../bot";

export class InteractionHandler {
  commandCallbacks: Map<string, (interaction: CommandInteraction) => Promise<void>> = new Map();

  constructor(private bot: Bot) {}

  async register(command: ApplicationCommandDataResolvable, callback: (interaction: CommandInteraction) => Promise<void>) {
    // get guild from cache first. If guild is not present fetch from API.
    let guild = this.bot.client.guilds.cache.get(process.env.GUILD_ID);
    if (!guild) {
      guild = await this.bot.client.guilds.fetch(process.env.GUILD_ID);
    }

    //register the command
    this.commandCallbacks.set(command.name, callback);
    return await guild?.commands.set([command]);
  }
}
