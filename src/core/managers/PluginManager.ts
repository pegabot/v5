/*
 * Copyright (c) 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/v5/blob/main/LICENSE for details)
 */

import { Collection } from "discord.js";
import { glob } from "glob";
import path from "path";
import { Bot } from "../bot";
import { BotPlugin } from "../structures/BotPlugin";

export class PluginManager {
  plugins: Collection<string, BotPlugin> = new Collection();
  constructor(private bot: Bot) {}

  async setup(): Promise<any> {
    await this.loadPlugins();
    this.registerModules();
  }

  private async loadPlugins(): Promise<any> {
    // this function loads all the plugin files
    // and stores the plugins internally
    return new Promise(async (resolve, reject) => {
      glob(path.resolve(__dirname, "./../../plugins/**/plugin.js"), async (error, files) => {
        for (const file of files) {
          const plugin: BotPlugin = await require(file).default;

          if (this.plugins.has(plugin.name)) {
            this.bot.logger.info(`Plugin (${plugin.name}) exists already.`);
            continue;
          }

          this.plugins.set(plugin.name, plugin);
          this.bot.logger.info(`loading plugin (${plugin.name})`);
        }
        resolve(true);
      });
    });
  }

  private registerModules() {
    // this function registers the events,
    // commands and tasks of the loaded plugins

    if (!this.plugins.get("Default")) {
      this.bot.logger.error("The plugin (Default) is not available but required for correct functionality. Exiting.");
      this.bot.ProcessEventManager.destroy();
    }

    for (const plugin of [...this.plugins.values()]) {
      if (plugin.events.length > 0) {
        for (const event of plugin.events) {
          this.bot.EventManager.register(event);
        }
      }

      if (plugin.commands.length > 0) {
        for (const command of plugin.commands) {
          this.bot.InteractionManager.register(command);
        }
      }

      if (plugin.tasks.length > 0) {
        for (const task of plugin.tasks) {
          this.bot.TaskManager.register(task);
        }
      }
    }
  }
}
