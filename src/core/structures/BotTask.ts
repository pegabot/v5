/*
 * Copyright (c) 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/v5/blob/main/LICENSE for details)
 */

export interface BotTask {
  name: string;
  interval?: number;
  setup?(): any | Promise<any>;
  callback?(): any | Promise<any>;
}
