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
  /**
   * the plugins name
   */
  abstract name: string;
  /**
   * @optional if set, the commands will only be deployed to those guilds
   */
  guildIDs?: string[];
  /**
   * the core will store the events of this plugin in this array on startup
   */
  events: BotEvent<keyof ClientEvents>[] = [];
  /**
   * the core will store the commands of this plugin in this array on startup
   */
  commands: BotCommand[] = [];
  /**
   * the core will store the tasks of this plugin in this array on startup
   */
  tasks: BotTask[] = [];
  /**
   * @optional if set, the core will check if those env keys are available on startup
   */
  envs?: string[];

  getDatastore() {
    const store = new Keyv(process.env.REDIS_URL, { namespace: `plugin-${this.name}-${process.env.NODE_ENV}` });

    store.on("error", (error) => {
      bot.panic(`the datastore of plugin (${this.name}) throw an error => ${error}.`);
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
