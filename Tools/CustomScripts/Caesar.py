#!/usr/bin/python3
string = input('Input your string: ')

for i in range(1,26):
    output = ''
    for j in string:
        if j != ' ' and j.islower():
            output += chr((ord(j)-ord('a')+i)%26+ord('a'))
        elif j != ' ' and j.isupper():
            output += chr((ord(j)-ord('A')+i)%26+ord('A'))
        else:
            output += ' '
    print(str(i)+". " + output)
    
