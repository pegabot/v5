/*
 * Copyright (c) 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/v5/blob/main/LICENSE for details)
 */

import { ClientEvents } from "discord.js";
import { Bot } from "../bot";
import { BotEvent } from "../structures/BotEvent";

export class EventManager {
  constructor(private bot: Bot) {}

  register<K extends keyof ClientEvents>(event: BotEvent<K>) {
    this.bot.client.on(event.name, event.callback);
  }
}
