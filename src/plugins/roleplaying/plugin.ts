/*
 * Copyright (c) 2021 - 2022 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/v5/blob/main/LICENSE for details)
 */

import { BotPlugin } from "../../core/structures/BotPlugin";

class Roleplaying extends BotPlugin {
  name = "Roleplaying";
  arg = "roleplaying";
  envs = ["ROLEPLAYING_ROLLBUTLER_KEY", "ROLEPLAYING_ROLLBUTLER_PASS"];
  store = this.getDatastore();
  logger = this.getLogger();
}

export default new Roleplaying();

require("./commands/name");
require("./commands/roll");
