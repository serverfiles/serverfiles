#!/usr/bin/env bash
#
#  Check for updates using GitHub's RESTful API.
#  Created On 19 November 2021
#

# Note: This is a standalone script invoked by the main script
# to check for updates in background, so that we can notify the user
# next time when the main script is launched to pull the updates

set -e

SCRIPT=$(realpath $0)
SCRIPTPATH=$(dirname $(dirname $SCRIPT))

# grab the latest commit SHA from GitHub main branch
LATEST_SHA=$(curl -sS https://api.github.com/repos/serverfiles/serverfiles/commits?per_page=1 | grep "sha" | head -n 1 | awk '$1=$1')

# handle rate limiting
[[ -z $LATEST_SHA ]] && exit

# only get the SHA
LATEST_SHA=${LATEST_SHA:8}
LATEST_SHA=${LATEST_SHA::-2}

# get current sha hash
cd "$SCRIPTPATH"
CURRENT_SHA=$(git rev-parse HEAD)

# we assume we've got an update if both SHAs are
# not equal
if [[ $CURRENT_SHA != $LATEST_SHA ]]; then
    touch "$SCRIPTPATH/.update-available"
fi
