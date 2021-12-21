/*
 * Copyright (c) 2021 Nico Finkernagel
 * This code is licensed under the MIT license
 * (see https://github.com/gruselhaus/studip-people-searcher/blob/main/LICENSE.md for details)
 */

import { bot } from "../../main";

export const setLocale = async (guildID: string, locale: string): Promise<true> => {
  return bot.keyv.set(`${guildID}-locale`, locale);
};

export const getLocale = async (guildID: string): Promise<string> => {
  return (await bot.keyv.get(`${guildID}-locale`)) || "en";
};
