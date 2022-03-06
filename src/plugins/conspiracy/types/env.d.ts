/*
 * Copyright (c) 2021 - 2022 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/v5/blob/main/LICENSE for details)
 */

declare namespace NodeJS {
  interface ProcessEnv {
    CONSPIRACY_GUILD_ID: string;
    CONSPIRACY_ADMINCHANNEL_ID: string;
    ROLLBUTLER_KEY: string;
    ROLLBUTLER_PASS: string;
  }
}
