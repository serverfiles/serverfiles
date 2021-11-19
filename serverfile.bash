#
#  Takes indivudial config script and works on it.
#  Created On 18 November 2021
#

install_serverfile() {
    # load the config script into memory
    source "$@"

    # add the base path to WRITE_TO variable from the config script
    if [[ $DEST_DIR = '/' ]]; then
        WRITE_TO="/${WRITE_TO#/}"
    else
        WRITE_TO="$DEST_DIR/${WRITE_TO#/}"
    fi

    # automatically detect which user to execute
    # as depending on the writing path
    if [[ "$WRITE_TO" == /home* ]]; then
        EXE_USER=$(echo ${WRITE_TO:6} | cut -f1 -d"/")
    else
        EXE_USER=root
    fi

    # execute the before_write function
    if [ $FUNCTIONS = true ]; then
        # export the before_write function to be accessible
        # to the subshell we'll be creating
        export -f before_write

        if [ $VERBOSE = true ]; then
            su $EXE_USER -c 'bash -c before_write'
        else
            OUTPUT=$(su $EXE_USER -c 'bash -c before_write')    
        fi

        # grab exit code & check if it's not zero
        # which means the function failed
        EXIT_CODE=$?
        if [ $EXIT_CODE -ne 0 ]; then
            echo "$OUTPUT"
            # todo: output the user that this config failed
            echo "Exit code was $EXIT_CODE"
        fi
    fi

    # write the config file to the destination
    CONFIG_STRING=$(config | sed -Ez '$ s/\n+$//' | sed -e :a -e '/./,$!d;/^\n*$/{$d;N;};/\n$/ba')
    sudo -u $EXE_USER mkdir -p $(dirname $WRITE_TO)
    echo "$CONFIG_STRING" | sudo -u $EXE_USER tee "$WRITE_TO" > /dev/null

    # execute the after_write function
    if [ $FUNCTIONS = true ]; then
        # export the after_write function to be accessible
        # to the subshell we'll be creating
        export -f after_write

        if [ $VERBOSE = true ]; then
            su $EXE_USER -c 'bash -c after_write'
        else
            OUTPUT=$(su $EXE_USER -c 'bash -c after_write')    
        fi

        # grab exit code & check if it's not zero
        # which means the function failed
        EXIT_CODE=$?
        if [ $EXIT_CODE -ne 0 ]; then
            echo "$OUTPUT"
            # todo: output the user that this config failed
            echo "Exit code was $EXIT_CODE"
        fi
    fi

    # tell the user we've updated a config file
    echo "✅ ${GREEN}Success:${RESET} Updated ${GRAY}${UNDERLINE}$WRITE_TO${RESET}"
}
