/*
 * Copyright (c) 2021 - 2022 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/v5/blob/main/LICENSE for details)
 */

import yargs from "yargs";
import { Bot } from "../core/bot";

export const getArgs = async (bot: Bot) => {
  const pluginsWithArg = bot.PluginManager.plugins.filter((p) => p.arg !== undefined);

  return yargs(process.argv).options(
    pluginsWithArg.reduce((map: { [key: string]: {} }, p) => {
      if (p.arg)
        map[p.arg] = {
          type: "boolean",
          description: `Set this arg to enable plugin (${p.name})`,
        };
      return map;
    }, {}),
  ).argv;
};
