/*
 * Copyright (c) 2021 - 2022 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/v5/blob/main/LICENSE for details)
 */

import { exit } from "process";
import { Bot } from "../bot";

export class ProcessEventManager {
  private signals: NodeJS.Signals[] = ["SIGABRT", "SIGALRM", "SIGINT", "SIGHUP"];

  constructor(private bot: Bot) {}

  setupEvents(): void {
    this.signals.forEach((s) => {
      process.on(s, (signal: NodeJS.Signals) => {
        this.destroy(signal);
      });
    });
  }

  destroy(signal: NodeJS.Signals): void {
    this.bot.logger.warn(`${signal || "Exit signal"} recieved, destroying the bot.`);

    this.bot.client.destroy();
    exit(0);
  }
}
