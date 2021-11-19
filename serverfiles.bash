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
MAGENTA=$(tput setaf 5)
GRAY=$(tput setaf 0)
RED=$(tput setaf 9)
GREEN=$(tput setaf 10)

# automatically link itself as a universal executable
if [ ! -f /usr/local/bin/serverfile ]; then
    echo "⚠️ ${AMBER}Warning:${RESET} Universal executable not detected"
    echo "🔊 ${BLUE}Info:${RESET} Attempting to link as universal executable password may be asked"
    sudo ln -sf "$SCRIPT" /usr/local/bin/serverfile
    sudo chmod +x /usr/local/bin/serverfile
    echo ""
    echo "🔊 ${BLUE}Info:${RESET} You can now invoke \"${WHITE}${BOLD}serverfile${RESET}\" command system-wide"
    exit 0
fi

# perform a program update
source "$SCRIPTPATH/updates/update.bash"

# parse command line arguments and show help if asked
source "$SCRIPTPATH/args/defaults.bash"
source "$SCRIPTPATH/args/help.bash"
source "$SCRIPTPATH/args/args.bash"

# only allow running as root, so we can
# set permissions & ownership correctly
if [[ $(id -u) -ne 0 ]]; then
    echo "🚨 ${RED}Error:${RESET} Please run this script with ${WHITE}${BOLD}sudo${RESET}, so permissions &"
    echo "   ownership can be set correctly"
    exit 1
fi

# check for program updates in background
bash "$SCRIPTPATH/updates/check.bash" &

# register the install_serverfile() function
source "$SCRIPTPATH/serverfile.bash"

# handle when no config scripts are passed
if [ -z $@ ]; then
    display_help
fi

# loop through each config script provided
for CSCRIPT in $@; do
    install_serverfile $(realpath $CSCRIPT)
done
