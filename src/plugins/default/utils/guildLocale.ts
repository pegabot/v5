/*
 * Copyright (c) 2021 - 2022 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/v5/blob/main/LICENSE for details)
 */

import Default from "../plugin";

export const setGuildLocale = async (guildID: string, locale: string) => {
  return Default.store.set(`${guildID}-locale`, locale);
};

export const getGuildLocale = async (guildID: string): Promise<string | undefined> => {
  return await Default.store.get(`${guildID}-locale`);
};

export const deleteGuildLocale = async (guildID: string) => {
  return await Default.store.delete(`${guildID}-locale`);
};
