/*
 * Copyright (c) 2021 Nico Finkernagel
 * This code is licensed under the MIT license
 * (see https://github.com/gruselhaus/studip-people-searcher/blob/main/LICENSE.md for details)
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

  private async destroy(signal?: NodeJS.Signals): Promise<void> {
    console.log(`${signal || "Exit signal"} recieved, destroying the bot.`);

    this.bot.client.destroy();
    process.exit(0);
  }
}
