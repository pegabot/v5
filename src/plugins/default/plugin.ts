/*
 * Copyright (c) 2021 - 2022 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/v5/blob/main/LICENSE for details)
 */

import { BotPlugin } from "../../core/structures/BotPlugin";

class Plugin extends BotPlugin {
  name = "Default";
  envs = ["REDIS_URL", "BOT_TOKEN", "DEFAULT_INVITE_LINK"];
  store = this.getDatastore();
  logger = this.getLogger();
}

export default new Plugin();

require("./commands/invite");
require("./commands/language");
require("./commands/ping");
require("./events/debug");
require("./events/error");
require("./events/guildCreate");
require("./events/guildDelete");
require("./events/interactionCreate");
require("./events/ready");
require("./events/warn");
require("./tasks/joinThreadChannels");
