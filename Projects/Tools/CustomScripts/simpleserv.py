#!/usr/bin/python
import sys

answer = ''
while answer != 'q':
    sys.stdout.write("what would you like to do: ")
    sys.stdout.flush()
    answer = raw_input()
    sys.stdout.write("you chose {}\n".format(answer))
    sys.stdout.flush()
    if answer=='f':
        sys.stdout.write("flag_is_here\n")
        sys.stdout.flush()