#
#  Parsers command line arguments.
#  Created On 17 November 2021
#

POSITIONAL=()

while [[ $# -gt 0 ]]; do
    key="$1"

    case $key in
        -h|--help)
            display_help
            shift
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -n|--no-functions)
            FUNCTIONS=false
            shift
            ;;
        -d|--dir)
            DEST_DIR="$(realpath $2)"
            shift
            shift
            ;;
        *)
            POSITIONAL+=("$1")
            shift
            ;;
        esac
done

set -- "${POSITIONAL[@]}"
