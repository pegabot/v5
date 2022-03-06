/*
 * Copyright (c) 2021 - 2022 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/v5/blob/main/LICENSE for details)
 */

import { ApplicationCommandData, ButtonInteraction, Collection, CommandInteraction, PermissionString } from "discord.js";

export interface BotCommand {
  ids?: Collection<string, string>;
  alias?: string[];
  guildIDs?: string[];
  data: ApplicationCommandData & { permissions?: PermissionString[] };
  callback: (interaction: Omit<CommandInteraction, "guildId"> & { guildId: string }, locale: string) => any | Promise<any>;
  buttons?: Map<string, (interaction: ButtonInteraction, locale: string) => void | Promise<void>>;
}
