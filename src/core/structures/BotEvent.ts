/*
 * Copyright (c) 2021 - 2022 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/v5/blob/main/LICENSE for details)
 */

import { ClientEvents } from "discord.js";

export interface BotEvent<K extends keyof ClientEvents> {
  /**
   * the event name
   */
  name: K;
  /**
   * callback will be triggered if event is fired
   */
  callback: (...args: ClientEvents[K]) => Promise<any> | any;
}
