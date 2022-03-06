/*
 * Copyright (c) 2021 - 2022 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/v5/blob/main/LICENSE for details)
 */

import { ClientEvents } from "discord.js";
import { config } from "dotenv";
import Keyv from "keyv";
import { bot } from "../../main";
import { BotCommand } from "./BotCommand";
import { BotEvent } from "./BotEvent";
import { BotTask } from "./BotTask";

config();

export abstract class BotPlugin {
  abstract name: string;
  guildIDs?: string[];
  events: BotEvent<keyof ClientEvents>[] = [];
  commands: BotCommand[] = [];
  tasks: BotTask[] = [];

  getDatastore() {
    const store = new Keyv(process.env.REDIS_URL, { namespace: `plugin-${this.name}-${process.env.NODE_ENV}` });

    store.on("error", (error) => {
      bot.panic(`The datastore of plugin (${this.name}) throw an error => ${error}`);
    });

    return store;
  }

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
