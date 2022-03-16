/*
 * Copyright (c) 2020 - 2022 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/v4/blob/main/LICENSE for details)
 */

import { MessageOptions, MessagePayload } from "discord.js";

export const stripIndents = (input: string | MessagePayload | MessageOptions): string | MessagePayload | MessageOptions => {
  return typeof input === "string" ? input.replace(/^[ \\t]+/gm, "") : input;
};
