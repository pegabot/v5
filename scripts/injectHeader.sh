#!bin/bash

# Copyright (c) 2021 Nico Finkernagel
# This code is licensed under the MIT license
# (see https://github.com/gruselhaus/studip-people-searcher/blob/main/LICENSE.md for details)

echo "$(echo '/*\n * Copyright (c) 2021 Nico Finkernagel\n * This code is licensed under the MIT license\n * (see https://github.com/gruselhaus/studip-people-searcher/blob/main/LICENSE.md for details)\n */\n'; cat './src/types/env.d.ts')" > ./src/types/env.d.ts