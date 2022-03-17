/*
 * Copyright (c) 2021 - 2022 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/v5/blob/main/LICENSE for details)
 */

import bent from "bent";
import { MessageEmbed, User } from "discord.js";
import { colors } from "../../../constants/colors";

const generateParams = (dice: string, locale: string): URLSearchParams => {
  const params = new URLSearchParams();
  params.append("job", "api");
  params.append("source", "Pegabot");
  params.append("user_id", "1");
  params.append("usr", "Pegabot");
  params.append("api_key", process.env.ROLEPLAYING_ROLLBUTLER_KEY || "");
  params.append("api_pass", process.env.ROLEPLAYING_ROLLBUTLER_PASS || "");
  params.append("roll", dice);
  params.append("logit", "true");
  params.append("lang", locale.toUpperCase());
  params.append("format", "extended");
  return params;
};

export const rollDice = async (dice: string, locale: string): Promise<string> => {
  const handler = bent(`https://rollbutler.net/index.php?`, "string", {
    HttpMethod: "GET",
    Headers: {
      Authorization: `BOT ${process.env.ROLLBUTLER_KEY}`,
      Accept: "application/json",
      "User-Agent": "Pegabot",
      "Content-Type": "application/json",
    },
  });

  return handler(`${generateParams(dice, locale).toString()}`);
};

export const RollbutlerEmbed = (dice: string, user: User, response: any): MessageEmbed => {
  const embed = new MessageEmbed();
  embed.setColor(colors.blurple);
  embed.setTitle(`${dice}`);
  embed.setDescription(`${user}, ${response.message.charAt(0).toLowerCase() + response.message.slice(1)}`);
  embed.footer = {
    text: "powered by RollButler",
  };
  return embed;
};
