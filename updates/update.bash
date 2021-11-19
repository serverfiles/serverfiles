#
#  Automatically updates the program to the latest version
#  by clonning from GitHub's main branch.
#  Created On 19 November 2021
#

if [ -e "$SCRIPTPATH/.update-available" ]; then
    # perform the update
    echo "🔊 ${BLUE}Info:${RESET} New updates found, fetching updating now"
    su $SUDO_USER -c "cd \"$SCRIPTPATH\" && git pull"
    rm "$SCRIPTPATH/.update-available"
    
    # tell the user we've updated the script
    # and to re-issue the command
    echo ""
    echo "✅ ${GREEN}Success:${RESET} Updated ${WHITE}${BOLD}serverfiles${RESET} to the latest version."
fi
