#!/usr/bin/env bash
#
#  Installs serverfiles program into a Linux server.
#  Created On 19 November 2021
#

set -e

# Note: This is a standlone script that should be able
# to be executed over the network with least dependencies

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

# tell the user we're installing
echo "🔊 ${BLUE}Info:${RESET} Downloading ${WHITE}${BOLD}serverfiles${RESET} program"
echo "   Install location: ${GRAY}/opt/serverfiles${RESET}"
echo ""

# create the opt directory, if doesn't exist
sudo mkdir -p /opt/serverfiles
sudo chown -R $SUDO_USER /opt/serverfiles

# clone the repository
su $SUDO_USER -c 'git clone https://github.com/serverfiles/serverfiles.git "/opt/serverfiles"'

# make scripts executable & link
# them to be used universally
cd /opt/serverfiles
ln -sf "/opt/serverfiles/serverfiles.bash" /usr/local/bin/serverfile

chmod +x ./serverfiles.bash
chmod +x ./updates/check.bash
chmod +x /usr/local/bin/serverfile

# tell the user we're done
echo ""
echo "✅ ${GREEN}Success:${RESET} Successfully installed ${WHITE}${BOLD}serverfiles${RESET} on $(hostname)"
echo "   You can now access the ${GRAY}serverfile${RESET} command system-wide"
