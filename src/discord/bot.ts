/*
 * Copyright (c) 2021 Nico Finkernagel
 * This code is licensed under the MIT license
 * (see https://github.com/gruselhaus/studip-people-searcher/blob/main/LICENSE.md for details)
 */

import { Client, Intents } from "discord.js";
import { I18n } from "i18n";
import Keyv from "keyv";
import path from "path";
import { createLogger, format, transports } from "winston";
import { locales } from "../constants/locales";
import { EventManager } from "./managers/eventManager";
import { InteractionManager } from "./managers/interactionManager";
import { ProcessEventManager } from "./managers/processEventManager";

export class Bot {
  client = new Client({
    intents: new Intents([Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_MESSAGES]),
    partials: ["MESSAGE", "CHANNEL", "REACTION"],
  });

  eventManager = new EventManager(this);
  InteractionManager = new InteractionManager(this);
  ProcessEventManager = new ProcessEventManager(this);

  logger = createLogger({
    transports: [new transports.Console({ level: "debug" })],
    format: format.combine(format.errors({ stack: true }), format.splat(), format.colorize(), format.simple()),
  });

  keyv = new Keyv(process.env.REDIS_URL, { namespace: `studip-searcher-${process.env.NODE_ENV}` });
  i18n = new I18n();

  constructor() {
    this.ProcessEventManager.setupEvents();
    // this.logger.add(new transports.Console({ format: format.combine(format.errors({ stack: true }), format.splat(), format.colorize(), format.simple()) }));
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
