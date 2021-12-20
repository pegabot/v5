/*
 * Copyright (c) 2021 Nico Finkernagel
 * This code is licensed under the MIT license
 * (see https://github.com/gruselhaus/studip-people-searcher/blob/main/LICENSE.md for details)
 */

declare namespace NodeJS {
  interface ProcessEnv {
    STUDIP_USER: string;
    STUDIP_PASSWORD: string;
    BOT_TOKEN: string;
    INVITE_LINK: string;
  }
}
