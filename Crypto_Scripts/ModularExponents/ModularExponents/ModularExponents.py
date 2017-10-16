import math
import sys
import fractions
import Crypto
import RSA
import time



def Modular_Exponent():
    
    count=2
    sum=0
    result=1
    remainder=[]
    exponent=[]
    x = 2
    number = int(raw_input("\nWhat is the base: "))
    power = int(raw_input("What is the power: "))
    mod = int(raw_input("What is the mod: "))
    startTime = time.clock()

    exponent.append(1)
    remainder.append(number**1%mod)
    exponent.append(x)
    remainder.append(number**x%mod)
    x=x*x

    while x <= power:
        exponent.append(x)
        remainder.append((remainder[count-1]*remainder[count-1])%mod)
        x=x*2
        count+=1

    for i in range(count-1,-1,-1):
        if (sum+exponent[i] <= power):
            sum+=exponent[i]
            result = (result * remainder[i])%mod
    endTime = time.clock()

    print("\n"+str(result)+"\n"+str(endTime-startTime)+"\n")

def totient():
    number = int(raw_input("What number do you want the totient of: "))
    factors = Crypto.factorize(number)
    sum=1.0
    for i in factors:
        sum*= 1-fractions.Fraction(1,i)
    print(int(sum*number))
    print('')
    print('')

def dynamic(a,b,inverse,p,N):
    

    count=2
    sum=0
    result=1
    remainder=[]
    exponent=[]
    x = 2
    number = inverse
    power = N
    mod = p
    startTime = time.clock()

    exponent.append(1)
    remainder.append(number**1%mod)
    exponent.append(x)
    remainder.append(number**x%mod)
    x=x*x

    while x <= power:
        exponent.append(x)
        remainder.append((remainder[count-1]*remainder[count-1])%mod)
        x=x*2
        count+=1

    for i in range(count-1,-1,-1):
        if (sum+exponent[i] <= power):
            sum+=exponent[i]
            result = (result * remainder[i])%mod
    endTime = time.clock()

    print(str((result*b)%p))
    
if __name__ == "__main__":

    answer = ''
    while answer!='x':
        print("Would you like to:\n")
        print("[a] Find x=n^a mod p")
        print("[b] Find prime factors")
        print("[c] Calculate totient")
        print("[d] Calculate gcd")
        print("[e] Calculate multiplicative inverse")
        print("[f] Calculate entropy") 
        print("[g] Perform a shift")
        print("[h] Decrypt RSA with primes")
        print("[i] Decrypt RSA without primes")
        print("[x] Exit\n>>> ")
        answer = raw_input()
    
        if answer == 'a':
            Modular_Exponent()
        elif answer == 'b':
            n = int(raw_input("What number do you want to factor: "))
            print(Crypto.factorize(n))
        elif answer == 'c':
            totient()
        elif answer == 'd':
            x = int(raw_input("Enter your first number: "))
            y = int(raw_input("Enter your second number: "))
            print("The gcd is: " + str(Crypto.egcd(x,y)[0]))
        elif answer == 'e':
            x = int(raw_input("Enter your number: "))
            y = int(raw_input("Enter your mod: "))
            print("The inverse is: " + str(Crypto.modinv(x,y)))
        elif answer == 'f':
            Crypto.entropy()
        elif answer == 'g':
            Crypto.shift()
        elif answer == 'h':
            RSA.decryptRSA()
        elif answer == 'i':
            RSA.decryptRSAPrimes()
        elif answer == 'n':
            for i in range(0,10):
                dynamic(28,191,201,331,19*i)
