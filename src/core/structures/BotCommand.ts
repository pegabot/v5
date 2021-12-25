/*
 * Copyright (c) 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/v5/blob/main/LICENSE for details)
 */

import { ApplicationCommandData, Collection, CommandInteraction, PermissionString } from "discord.js";

export interface BotCommand {
  ids?: Collection<string, string>;
  alias?: string[];
  data: ApplicationCommandData & { permissions?: PermissionString[] };
  callback: (interaction: CommandInteraction, locale: string) => Promise<void>;
}
