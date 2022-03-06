/*
 * Copyright (c) 2021 - 2022 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/v5/blob/main/LICENSE for details)
 */

import { BotPlugin } from "../../core/structures/BotPlugin";

class CONspiracy extends BotPlugin {
  name = "CONspiracy";
  envs = ["CONSPIRACY_GUILD_ID", "CONSPIRACY_ADMINCHANNEL_ID", "ROLLBUTLER_KEY", "ROLLBUTLER_PASS"];
  guildIDs = [process.env.CONSPIRACY_GUILD_ID];
  store = this.getDatastore();
}

export default new CONspiracy();

require("./commands/name");
require("./commands/roll");
