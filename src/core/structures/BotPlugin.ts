/*
 * Copyright (c) 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/v5/blob/main/LICENSE for details)
 */

import { ClientEvents } from "discord.js";
import { BotCommand } from "./BotCommand";
import { BotEvent } from "./BotEvent";

export abstract class BotPlugin {
  abstract name: string;
  events: BotEvent<keyof ClientEvents>[] = [];
  commands: BotCommand[] = [];

  registerEvent<K extends keyof ClientEvents>(name: K, callback: (...args: ClientEvents[K]) => any) {
    this.events.push({
      name,
      callback,
    });
  }

  registerCommand(command: BotCommand) {
    this.commands.push(command);
  }
}
