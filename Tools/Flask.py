import zlib
import urllib.parse
from itsdangerous import base64_decode
import tkinter
from sys import exit

r = tkinter.Tk()
data = r.clipboard_get()
r.withdraw()
r.update()
r.destroy()
data = data.replace('"','').replace("'","")

if not data[0] == '.':
    session = '.'+data
else:
    session = data

session = urllib.parse.unquote(urllib.parse.unquote(session))


decode = 'y'
try:
    output = zlib.decompress(base64_decode(session.split(".")[1]))
    try:
        print(output.decode('utf-8').replace('\\t','\t').replace('\\n','\n'))
    except:
        print("Error decoding the data")
        decode = input("Try latin decoding? [Y]/N: ")
    
        if decode.lower() == 'y':
            print(output.decode('latin').replace('\\t','\t').replace('\\n','\n'))    
            exit(0)
except:
    print("Not recognizable zlib data")
    exit(0)
    