#!/usr/bin/python2.7
from scapy.all import *
from sys import stdout

KEY = "\x13\x14\x15\x16\x17"
standard_icmp = "\xe3\xabM]"+"\x00"*4+"~{\x01"+"\x00"*5
for i in range(0x10,0x38):
    standard_icmp+=chr(i)


holder = [None]*100
ctr = 0

def xor(message,key):
    m = ''
    for i in range(len(message)):
        m+=chr(ord(message[i])^ord(key[i%len(key)]))

    return m

def decode(packet):
    global ctr
    global holder
    try:
        pkt_data = packet['Raw'].load
        for i in range(len(pkt_data)):
            if pkt_data[i] != standard_icmp[i]:
                break
        try:
            encoded_message = pkt_data[i:(56-(0x38-0x20))]
        except:
            encoded_message = pkt_data[i:]
        decoded_message = xor(encoded_message,KEY)
        if decoded_message not in holder:
            holder[ctr] = decoded_message
            ctr=(ctr+1)%100
            stdout.write(decoded_message)
    except Exception as e:
        print(e)
        pass

def main():
    sniffer = sniff(filter='icmp[icmptype] == 8 and icmp[icmpcode]==0 and src 10.10.13.14',iface='lo',prn=decode)


if __name__ == '__main__':
    main()
