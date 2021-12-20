/*
 * Copyright (c) 2021 Nico Finkernagel
 * This code is licensed under the MIT license
 * (see https://github.com/gruselhaus/studip-people-searcher/blob/main/LICENSE.md for details)
 */

import { ApplicationCommandDataResolvable, Client, ClientEvents, CommandInteraction, Intents } from "discord.js";

export class Bot {
  client = new Client({
    intents: new Intents([Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_MESSAGES]),
    partials: ["MESSAGE", "CHANNEL", "REACTION"],
  });

  commandCallbacks: Map<string, (interaction: CommandInteraction) => Promise<void>> = new Map();

  constructor() {
    this.setupProcessEventHandlers();
  }

  login() {
    return this.client.login(process.env.BOT_TOKEN);
  }

  registerEvent<K extends keyof ClientEvents>(name: K, callback: (...args: ClientEvents[K]) => void) {
    this.client.on(name, callback);
  }

  async regsisterCommand(command: ApplicationCommandDataResolvable, callback: (interaction: CommandInteraction) => Promise<void>) {
    // get guild from cache first. If guild is not present fetch from API.
    let guild = this.client.guilds.cache.get(process.env.GUILD_ID);
    if (!guild) {
      guild = await this.client.guilds.fetch(process.env.GUILD_ID);
    }

    //register the command
    this.commandCallbacks.set(command.name, callback);
    return await guild?.commands.set([command]);
  }

  private setupProcessEventHandlers(): void {
    process.on("SIGINT", (signal) => {
      this.destroy(signal);
    });

    process.on("SIGTERM", (signal) => {
      this.destroy(signal);
    });
  }

  private async destroy(signal?: NodeJS.Signals): Promise<void> {
    console.log(`${signal || "Exit signal"} recieved, destroying the bot.`);

    this.client.destroy();
    process.exit(0);
  }
}
