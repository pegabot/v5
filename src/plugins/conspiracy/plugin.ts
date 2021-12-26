/*
 * Copyright (c) 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/v5/blob/main/LICENSE for details)
 */

import { BotPlugin } from "../../core/structures/BotPlugin";

class CONspiracy extends BotPlugin {
  name = "CONspiracy";
  guildIDs = [process.env.CONSPIRACY_GUILD_ID];
}

export default new CONspiracy();

require("./commands/name");
require("./commands/ping");
