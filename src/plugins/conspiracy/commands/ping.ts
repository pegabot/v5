/*
 * Copyright (c) 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/v5/blob/main/LICENSE for details)
 */

import CONspiracy from "../plugin";

CONspiracy.registerCommand({
  data: {
    name: "ping",
    description: "Ping Pong 🏓",
    permissions: ["ADMINISTRATOR"],
  },
  callback: (interaction) => {
    interaction.reply({ content: "Pong 🏓", ephemeral: true });
  },
});
