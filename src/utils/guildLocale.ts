/*
 * Copyright (c) 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/v5/blob/main/LICENSE for details)
 */

import { bot } from "../main";

export const setGuildLocale = async (guildID: string, locale: string) => {
  return bot.redis.set(`${guildID}-locale`, locale);
};

export const getGuildLocale = async (guildID: string): Promise<string> => {
  return (await bot.redis.get(`${guildID}-locale`)) || "en";
};

export const deleteGuildLocale = async (guildID: string) => {
  return await bot.redis.delete(`${guildID}-locale`);
};
