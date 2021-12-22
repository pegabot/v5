/*
 * Copyright (c) 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { ApplicationCommandData, CommandInteraction } from "discord.js";

export interface BotCommand {
  command: ApplicationCommandData;
  callback: (interaction: CommandInteraction, locale: string) => Promise<void>;
}