/*
 * Copyright (c) 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/v5/blob/main/LICENSE for details)
 */

import { ClientEvents } from "discord.js";
import { BotCommand } from "./BotCommand";
import { BotEvent } from "./BotEvent";
import { BotTask } from "./BotTask";

export abstract class BotPlugin {
  abstract name: string;
  guildIDs?: string[];
  events: BotEvent<keyof ClientEvents>[] = [];
  commands: BotCommand[] = [];
  tasks: BotTask[] = [];

  registerEvent<K extends keyof ClientEvents>(name: K, callback: (...args: ClientEvents[K]) => Promise<any> | any) {
    this.events.push({
      name,
      callback: callback as any,
    });
  }

  registerCommand(command: BotCommand) {
    this.commands.push({ ...command, guildIDs: this.guildIDs });
  }

  registerTask(task: BotTask) {
    this.tasks.push(task);
  }
}
