/*
 * Copyright (c) 2021 - 2022 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/v5/blob/main/LICENSE for details)
 */

import { createLogger, format, transports } from "winston";

export const getLogger = (label: string) =>
  createLogger({
    transports: [new transports.Console({ level: "debug" })],
    format: format.combine(
      format.label({ label }),
      format.errors({ stack: true }),
      format.splat(),
      format.colorize(),
      format.printf((info) => `${info.label} - ${info.level}:  ${info.message}`),
    ),
  });
