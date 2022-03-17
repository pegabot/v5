/*
 * Copyright (c) 2021 - 2022 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/v5/blob/main/LICENSE for details)
 */

import fs from "fs";
import path from "path";
import { BotPlugin } from "../../core/structures/BotPlugin";
import { asyncFilter } from "../../utils/asyncFilter";

class Quiz extends BotPlugin {
  name = "Quiz";
  arg = "quiz";
  envs = ["QUIZ_GUILD_ID"];
  guildIDs = [process.env.QUIZ_GUILD_ID];
  store = this.getDatastore();
  logger = this.getLogger();
  quizData?: QuizData;
  voucherData?: VoucherData;

  async setVoucherData(promise: Promise<any>) {
    this.voucherData = await promise;
  }
}

const plugin = new Quiz();
export default plugin;

// only load data if quiz data is present
if (fs.existsSync(path.join(process.cwd(), "quizData.json")) && fs.existsSync(path.join(process.cwd(), "voucherData.json"))) {
  const quizData: QuizData = require(path.join(process.cwd(), "quizData.json"));
  const voucherData: VoucherData = require(path.join(process.cwd(), "voucherData.json"));

  // since we load the quiz data from a json file we need to verify all the types by ourself
  let valid = true;

  if (!quizData.name || typeof quizData.name !== "string" || !quizData.questions || typeof quizData.questions !== "object") valid = false;
  for (const question of quizData.questions) {
    if (
      !question.question ||
      typeof question.question !== "string" ||
      !question.answers ||
      question.answers.length < 1 ||
      typeof question.correctIndex === "undefined" ||
      typeof question.correctIndex !== "number"
    ) {
      plugin.logger.warn(`quiz data is invalid => ${JSON.stringify(question, null, 2)}`);
      valid = false;
      break;
    }
  }

  for (const voucher of voucherData) {
    if (!voucher.code || typeof voucher.code !== "string") {
      plugin.logger.warn(`voucher data is invalid => ${JSON.stringify(voucher, null, 2)}`);
      valid = false;
      break;
    }
  }

  if (valid) {
    plugin.quizData = quizData;
    plugin.setVoucherData(asyncFilter(voucherData, async (v) => !(await plugin.store.get(`used-voucher-${v.code}`))));

    require("./commands/quiz");
  }
} else {
  plugin.logger.warn("quiz data file or voucher data file is not present, components won't be loaded.");
}
