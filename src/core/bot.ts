/*
 * Copyright (c) 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/v5/blob/main/LICENSE for details)
 */

import { Client, Intents } from "discord.js";
import { I18n } from "i18n";
import Keyv from "keyv";
import path from "path";
import { createLogger, format, transports } from "winston";
import { EventManager } from "./managers/EventManager";
import { InteractionManager } from "./managers/InteractionManager";
import { PluginManager } from "./managers/PluginManager";
import { ProcessEventManager } from "./managers/ProcessEventManager";
import { TaskManager } from "./managers/TaskManager";

export class Bot {
  client = new Client({
    intents: new Intents([Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_MESSAGES]),
    partials: ["MESSAGE", "CHANNEL", "REACTION"],
  });

  PluginManager = new PluginManager(this);
  EventManager = new EventManager(this);
  InteractionManager = new InteractionManager(this);
  ProcessEventManager = new ProcessEventManager(this);
  TaskManager = new TaskManager(this);

  logger = createLogger({
    transports: [new transports.Console({ level: "debug" })],
    format: format.combine(format.errors({ stack: true }), format.splat(), format.colorize(), format.simple()),
  });

  // TODO: change the namespace once this becomes the new Pegabot
  redis = new Keyv(process.env.REDIS_URL, { namespace: `v5-${process.env.NODE_ENV}` });
  i18n = new I18n();

  constructor() {
    this.ProcessEventManager.setupEvents();
    this.i18n.configure({
      defaultLocale: "en",
      locales: ["de", "en"],
      objectNotation: true,
      directory: path.join(__dirname, "/../../i18n/locales"),
      syncFiles: true,
      autoReload: true,
      updateFiles: false,
    });
  }

  login() {
    return this.client.login(process.env.BOT_TOKEN);
  }
}
