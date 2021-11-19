#
#  Registers the help message as a function.
#  Created On 17 November 2021
#

display_help() {
    echo ""
    echo " ${WHITE}${BOLD}USAGE${RESET}"
    echo "    ${WHITE}$(basename $0)${RESET} [${AMBER}options${RESET}] <${BLUE}config scripts...${RESET}>"
    echo ""
    echo "    Dynamically write ⚗️ config files to 🐧 Linux servers."
    echo ""
    echo " ${WHITE}${BOLD}OPTIONS${RESET}"
    echo "    ${AMBER}-d${RESET}, ${AMBER}--dir${RESET} <${MAGENTA}path${RESET}>      Directory to write config files to ${GRAY}${DIM}($DEST_DIR)${RESET}"
    echo "    ${AMBER}-n${RESET}, ${AMBER}--no-functions${RESET}    Don't run ${DIM}before_write()${RESET} & ${DIM}after_write()${RESET} functions ${GRAY}${DIM}($FUNCTIONS)${RESET}"
    echo "    ${AMBER}-v${RESET}, ${AMBER}--verbose${RESET}         Show ${DIM}before_write()${RESET} & ${DIM}after_write()${RESET} outputs ${GRAY}${DIM}($VERBOSE)${RESET}"
    echo "    ${AMBER}-h${RESET}, ${AMBER}--help${RESET}            Show this help message"
    echo ""
    echo "    Licensed under ${WHITE}${BOLD}MIT${RESET}"
    echo "    Read more ${WHITE}${BOLD}${UNDERLINE}https://github.com/serverfiles/serverfiles${RESET}"
    echo ""
    echo "    See \"${WHITE}${BOLD}$(basename $0)${RESET} ${AMBER}--help${RESET}\""
    exit 0
}
