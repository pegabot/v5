/*
 * Copyright (c) 2021 - 2022 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/v5/blob/main/LICENSE for details)
 */

import fs from "fs";
import path from "path";
import { BotPlugin } from "../../core/structures/BotPlugin";

class Quiz extends BotPlugin {
  name = "Quiz";
  arg = "quiz";
  envs = ["QUIZ_GUILD_ID"];
  store = this.getDatastore();
  logger = this.getLogger();
  quizData?: QuizData;
  voucherData?: VoucherData;
}

const plugin = new Quiz();
export default plugin;

// only load data if quiz data is present
if (fs.existsSync(path.join(process.cwd(), "quizData.json")) && fs.existsSync(path.join(process.cwd(), "voucherData.json"))) {
  require("./commands/quiz");

  const quizData: QuizData = require(path.join(process.cwd(), "quizData.json"));
  plugin.quizData = quizData;

  const voucherData: VoucherData = require(path.join(process.cwd(), "voucherData.json"));
  plugin.voucherData = voucherData.filter(async (v) => !(await plugin.store.get(`voucher-${v.code}`)));
} else {
  plugin.logger.warn("quiz data file is not present, components won't be loaded.");
}
