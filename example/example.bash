#
#  Example config script to be used with serverfiles bash project.
#  Created On 17 November 2021
#

# absolute path where the rendered config should be written
WRITE_TO="example.txt"

# before_write() is optional will be executed before writing the config file
# if this function fails to execute (ie. returns a non-zero exit code)
# the config file will be aborted and the error will be reported
before_write() {
    echo "I will be executed before writing the file
    useful to stop processes & services to release files to be
    deleted or overwritten." | awk '$1=$1'
}

# after_write() is optional and will be executed after writing the config file
# useful in restarting services to apply the new configuration
after_write() {
    echo "I will be executed after writing the file
    useful to re/start processes or services to load changed config files." | awk '$1=$1'
}

# the output of the config() is what is written as the
# contents of the config file, this function is required for every serverfiles
# config script
config() {
    echo "hello $(hostname)"
}
