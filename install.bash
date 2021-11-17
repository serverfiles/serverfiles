#
#  Installs itself as an executable and outputs a friendly message.
#  Created On 17 November 2021
#

if [ ! -f /usr/local/bin/serverfile ]; then
    echo "⚠️ ${AMBER}Warning:${RESET} Universal executable not detected"
    echo "🔊 ${BLUE}Info:${RESET} Attempting to link as universal executable password may be asked"
    sudo ln -sf "$SCRIPT" /usr/local/bin/serverfile
    sudo chmod +x /usr/local/bin/serverfile
    echo ""
    echo "🔊 ${BLUE}Info:${RESET} You can now invoke \"${WHITE}${BOLD}serverfile${RESET}\" command system-wide"
    exit 0
fi
