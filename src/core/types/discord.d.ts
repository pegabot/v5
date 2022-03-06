/*
 * Copyright (c) 2021 - 2022 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/v5/blob/main/LICENSE for details)
 */

import { CommandInteraction } from "discord.js";

type ModifiedInteraction = Omit<CommandInteraction, "guildId"> & { guildId: string };
