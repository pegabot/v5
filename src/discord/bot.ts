/*
 * Copyright (c) 2021 Nico Finkernagel
 * This code is licensed under the MIT license
 * (see https://github.com/gruselhaus/studip-people-searcher/blob/main/LICENSE.md for details)
 */

import { Client, Intents } from "discord.js";
import { createLogger, format, transports } from "winston";
import { EventHandler } from "./handlers/eventHandler";
import { InteractionHandler } from "./handlers/interactionHandler";
import { ProcessEventHandler } from "./handlers/processEventHandler";

export class Bot {
  client = new Client({
    intents: new Intents([Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_MESSAGES]),
    partials: ["MESSAGE", "CHANNEL", "REACTION"],
  });

  eventHandler = new EventHandler(this);
  interactionHandler = new InteractionHandler(this);
  processEventHandler = new ProcessEventHandler(this);

  logger = createLogger();

  constructor() {
    this.processEventHandler.setupEvents();
    this.logger.add(new transports.Console({ format: format.combine(format.errors({ stack: true }), format.splat(), format.colorize(), format.simple()) }));
  }

  login() {
    return this.client.login(process.env.BOT_TOKEN);
  }
}
