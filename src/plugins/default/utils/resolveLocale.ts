/*
 * Copyright (c) 2021 - 2022 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/v5/blob/main/LICENSE for details)
 */

import { ModifiedInteraction } from "../../../core/types/discord";
import { getGuildLocale } from "./guildLocale";

const localesMap = new Map(
  Object.entries({
    de: "de",
    "en-GB": "en",
    "en-US": "en",
  }),
);

export const resolveLocale = async (interaction: ModifiedInteraction): Promise<string> => {
  if (localesMap.has(interaction.locale)) return localesMap.get(interaction.locale) as string;

  const customLocale = await getGuildLocale(interaction.guildId);
  if (customLocale) return customLocale;

  if (localesMap.has(interaction.guildLocale || "")) return localesMap.get(interaction.guildLocale || "") as string;

  return "en";
};
