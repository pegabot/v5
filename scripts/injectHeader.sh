#!bin/bash

# Copyright (c) 2021 The Pegabot authors
# This code is licensed under GNU Affero General Public License v3.0
# (see https://github.com/pegabot/discord/blob/main/LICENSE for details)

echo "$(echo '/*\n * Copyright (c) 2021 The Pegabot authors\n * This code is licensed under GNU Affero General Public License v3.0\n * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)\n */\n'; cat './src/types/env.d.ts')" > ./src/types/env.d.ts