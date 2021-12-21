/*
 * Copyright (c) 2021 Nico Finkernagel
 * This code is licensed under the MIT license
 * (see https://github.com/gruselhaus/studip-people-searcher/blob/main/LICENSE.md for details)
 */

import { ApplicationCommandData, CommandInteraction } from "discord.js";

export interface BotCommand {
  command: ApplicationCommandData;
  callback: (interaction: CommandInteraction, locale: string) => Promise<void>;
}
