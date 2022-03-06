/*
 * Copyright (c) 2021 - 2022 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/v5/blob/main/LICENSE for details)
 */

import { Collection } from "discord.js";
import prettyMs from "pretty-ms";
import { bot } from "../../main";
import { Bot } from "../bot";
import { BotTask } from "../structures/BotTask";

export class TaskManager {
  /**
   * holds all tasks registered by all plugins
   */
  tasks: Collection<string, BotTask> = new Collection();

  constructor(protected bot: Bot) {}

  register(task: BotTask) {
    if (this.tasks.has(task.name)) {
      return bot.logger.info(`Task (${task.name}) exists already.`);
    }

    this.bot.logger.info(`registering task (${task.name})`);
    this.tasks.set(task.name, task);
  }

  async setupExecutions() {
    [...this.tasks.values()].forEach(async (task) => {
      this.bot.logger.info(`setting up task (${task.name})${task.interval ? ` => interval (${prettyMs(task.interval)}` : ""})`);

      // if the task has a setup method we need to call it
      if (task.setup) {
        try {
          await task.setup();
        } catch (error) {
          this.bot.logger.error(`An error occured during the setup of task (${task.name}) => ${error}`);
        }
      }

      // if the task has a callback method we need to set up the scheduler
      if (task.callback) {
        let running = false;

        if (task.interval) {
          setInterval(async () => {
            if (task.callback) {
              try {
                // we need to check if the previous execution is still running. If it's the case,
                // we skip the execution of this cycle
                if (running) {
                  return this.bot.logger.info(`The task (${task.name}) is still running ... skipping this cycle`);
                }

                running = true;
                const started = Date.now();
                await task.callback();
                const ended = Date.now();
                running = false;

                this.bot.logger.info(`The execution of task (${task.name}) took ${prettyMs(ended - started)}`);
              } catch (error) {
                running = false;

                this.bot.logger.error(`An error ocurred during the execution of task (${task.name}). => ${error}!`);
              }
            }
          }, task.interval);
        }
      }
    });
  }
}
