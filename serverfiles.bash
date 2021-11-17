#!/usr/bin/env bash
#
#  Updates a config file by taking a serverfiles config script.
#  Created On 17 November 2021
#

SCRIPT=$(realpath $0)
SCRIPTPATH=$(dirname $SCRIPT)

# COLORS
RESET=$(tput sgr0)
DIM=$(tput dim)
BOLD=$(tput bold)
UNDERLINE=$(tput smul)
WHITE=$(tput setaf 7)
AMBER=$(tput setaf 11)
BLUE=$(tput setaf 14)

# automatically link itself as a universal execiable
source "$SCRIPTPATH/install.bash"

# parse command line arguments and show help if asked
source "$SCRIPTPATH/args/help.bash"
source "$SCRIPTPATH/args/args.bash"
