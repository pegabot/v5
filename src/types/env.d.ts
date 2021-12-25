/*
 * Copyright (c) 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/v5/blob/main/LICENSE for details)
 */

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    REDIS_URL: string;
    BOT_TOKEN: string;
  }
}
