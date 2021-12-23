/*
 * Copyright (c) 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Client, Intents } from "discord.js";
import { I18n } from "i18n";
import Keyv from "keyv";
import path from "path";
import { createLogger, format, transports } from "winston";
import { locales } from "../constants/locales";
import { EventManager } from "./managers/EventManager";
import { InteractionManager } from "./managers/InteractionManager";
import { ProcessEventManager } from "./managers/ProcessEventManager";

export class Bot {
  client = new Client({
    intents: new Intents([Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_MESSAGES]),
    partials: ["MESSAGE", "CHANNEL", "REACTION"],
  });

  EventManager = new EventManager(this);
  InteractionManager = new InteractionManager(this);
  ProcessEventManager = new ProcessEventManager(this);

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
      locales: locales,
      directory: path.join(__dirname, "/../../locales"),
    });
  }

  login() {
    return this.client.login(process.env.BOT_TOKEN);
  }
}
