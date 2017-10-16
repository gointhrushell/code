import math
import array

'''
    Documentation: I relied heavily on Pseudocode found here: https://en.wikipedia.org/wiki/MD5#Pseudocode
        I also found python examples of converting between big and little endianness.


'''

 
rotate_amounts = [7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
                  5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20,
                  4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
                  6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21]

K=[]
for i in range (0,64):
    K.append(math.floor(2**32*abs(math.sin(i+1))))

def left_rotate(x, n):
    x = x & 0xffffffff
    return ((x<<n) | (x>>(32-n))) & 0xffffffff

def main():

    print("Implementation of the MD5 Hashing algorithm.\n\n")
    a0 = 0x67452301
    b0 = 0xefcdab89
    c0 = 0x98badcfe
    d0 = 0x10325476
    
    message = bytearray(input("Please input the message you want to encode: ").encode())



    length = (8 * len(message))%(2**64)& 0xffffffff
    message.append(0x80)
    while len(message)%64 != 56: 
        message.append(0)
    message += length.to_bytes(8, byteorder='little')


    
    
    for chunkstart in range(0, len(message), 64): # this breaks the message into 512 bit chunks 64*8 = 512 
        a, b, c, d = a0, b0, c0, d0
        chunk= message[chunkstart:chunkstart+64]
        w = []
        for j in range(0,65,4): # breaks the message into 16 smaller chunks
            w.append(chunk[j:j+4])
        for i in range(0,64): # Functions taken from the pseudocode
            if i <=15:
                f = d^(b &(c^d))
                g = i
            elif i<=31:
                f = c^(d&(b^c))
                g = (5*i + 1)%16
            elif i<=47:
                f = b^c^d
                g = (3*i+5)%16
            else:
                f = c^(b|(~d))
                g = (7*i)%16

            
            temp = d
            d=c
            c=b
            b = (b+left_rotate(a+f+K[i]+int.from_bytes(w[g],byteorder='little'),rotate_amounts[i]))& 0xffffffff
            a = temp
        
        a0 = (a0+a)
        b0 = (b0+b)
        c0 = (c0+c)
        d0 = (d0+d)

        count = 0
        sum=0
        for i in [a0,b0,c0,d0]: # each a0,b0 etc is 8 bits long. We need to add these together, maintaining order
            sum+=i<<(32*count)
            count+=1
        hexint = hex(sum)[2:]
        for i in range(len(hexint),-1,-2):
            print(hexint[i:i+2],sep='',end='')
        print('')
    

main()