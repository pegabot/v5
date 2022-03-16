/*
 * Copyright (c) 2021 - 2022 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/v5/blob/main/LICENSE for details)
 */

type Question = {
  question: string;
  answers: string[];
  correctIndex: number;
};

type QuizData = {
  name: string;
  questions: Question[];
};

type VoucherData = {
  code: string;
}[];
