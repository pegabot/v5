# Copyright (c) 2021 The Pegabot authors
# This code is licensed under GNU Affero General Public License v3.0
# (see https://github.com/pegabot/v5/blob/main/LICENSE for details)
 
if [ $(git status --porcelain | wc -l) -eq "0" ]; then
  echo "  🟢 Git repo is clean."
  exit 0
else
  echo "  🔴 Git repo dirty. Quit."
  exit 1
fi