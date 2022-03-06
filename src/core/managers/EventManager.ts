/*
 * Copyright (c) 2021 - 2022 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/v5/blob/main/LICENSE for details)
 */

import { ClientEvents, Collection } from "discord.js";
import { Bot } from "../bot";
import { BotEvent } from "../structures/BotEvent";

export class EventManager {
  /**
   * holds all events registered by all plugins
   */
  events: Collection<string, BotEvent<any>> = new Collection();

  constructor(private bot: Bot) {}

  register<K extends keyof ClientEvents>(event: BotEvent<K>) {
    if (this.events.has(event.name)) {
      return this.bot.logger.info(`Event (${event.name}) exists already.`);
    }

    this.bot.client.on(event.name, event.callback);
    this.events.set(event.name, event);
  }
}
