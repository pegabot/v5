/*
 * Copyright (c) 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/v5/blob/main/LICENSE for details)
 */

import { ClientEvents } from "discord.js";
import { Bot } from "../bot";

export class EventManager {
  constructor(private bot: Bot) {}

  register<K extends keyof ClientEvents>(name: K, callback: (...args: ClientEvents[K]) => void) {
    this.bot.client.on(name, callback);
  }
}
