/*
 * Copyright (c) 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { bot } from "../main";

export const setGuildLocale = async (guildID: string, locale: string): Promise<true> => {
  return bot.redis.set(`${guildID}-locale`, locale);
};

export const getGuildLocale = async (guildID: string): Promise<string> => {
  return (await bot.redis.get(`${guildID}-locale`)) || "en";
};
