/*
 * Copyright (c) 2021 Nico Finkernagel
 * This code is licensed under the MIT license
 * (see https://github.com/gruselhaus/studip-people-searcher/blob/main/LICENSE.md for details)
 */

import { ClientEvents } from "discord.js";
import { Bot } from "../bot";

export class EventManager {
  constructor(private bot: Bot) {}

  register<K extends keyof ClientEvents>(name: K, callback: (...args: ClientEvents[K]) => void) {
    this.bot.client.on(name, callback);
  }
}
