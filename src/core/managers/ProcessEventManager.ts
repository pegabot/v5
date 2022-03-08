/*
 * Copyright (c) 2021 - 2022 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/v5/blob/main/LICENSE for details)
 */

import { Bot } from "../bot";

export class ProcessEventManager {
  constructor(private bot: Bot) {}

  setupEvents(): void {
    process.on("SIGINT", (signal) => {
      this.destroy(signal);
    });

    process.on("SIGTERM", (signal) => {
      this.destroy(signal);
    });
  }

  destroy(signal?: NodeJS.Signals): void {
    this.bot.logger.warn(`${signal || "Exit signal"} recieved, destroying the bot.`);

    this.bot.client.destroy();
    process.exit(0);
  }
}
