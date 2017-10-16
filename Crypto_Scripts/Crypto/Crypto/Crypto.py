import math

def egcd(a, b):
    "extended greatest common denominator. Used when calculating modular inverse"
    x,y, u,v = 0,1, 1,0
    while a != 0:
        q, r = b//a, b%a
        m, n = x-u*q, y-v*q
        b,a, x,y, u,v = a,r, u,v, m,n
        gcd = b
    return gcd, x, y

def modinv(a, m):
    "function call to begin calculation of modular inverse"
    gcd, x, y = egcd(a, m)
    if gcd != 1:
        
        return None  # modular inverse does not exist
    else:
        return x % m

def pow_mod(x, y, z):
    number = 1
    while y:
        if y & 1:
            number = number * x % z
        y >>= 1
        x = x * x % z
    return number

def entropy():
    answer = raw_input("Is this entropy H(X) [e], joint entropy H(X,Y) [j], or conditional entropy H(X|Y) [c]?: ")
    sum = 0
    if answer == 'e':
        count = int(raw_input("How many \"events\" are there?: "))
        for i in range(0, count):
            prob = float(raw_input("What is the probability of event " + str(i+1)+" (fraction): "))
            sum += prob*math.log(prob,2)
        print("Entropy is: " + str(-sum)+"\n\n")
    

    elif answer == 'j':
        count = int(raw_input("How many \"choices\" are there?: "))
        for i in range(0, count):
            prob = float(raw_input("What is the probability of event given choice " + str(i+1) + " (fraction): "))
            sum += prob*math.log(prob,2)
        print("Entropy is: " + str(-sum)+"\n\n")

    elif answer == 'c':
        print("********************************************************************")
        print("\t    WARNING: THIS ONE PROBABLY DOESN\'T WORK")
        print("********************************************************************\n\n")
        keys = int(raw_input("How many \"keys\" are there?: "))
        letters = int(raw_input("How many \"letters\" are there?: "))
        letterProb=[]
        cipherProb=[]
        keyProb=[]
        for i in range(0,letters):
            letterProb.append(float(raw_input("What is the probability of plaintext " + str(i)+"?: ")))
            cipherProb.append(0)

        for i in range(0, keys):
          keyProb.append(float(raw_input("What is the probability of key " + str(i+1) + " (fraction): ")))

          for k in range(0,letters):
            cipherProb[k] += keyProb[i]*float(raw_input("What is the probability of cipherletter " + str(k+1) + " given key " + str(i+1)+" (fraction): "))


        for i in range(0,keys):
            for j in range(0,letters):
                sum+=keyProb[j]*letterProb[j]*math.log(letterProb[j],2)
            

        print("Entropy is: " + str(-sum)+"\n\n")

def shift():
    string = raw_input('Input your string: ')
    shift = int(raw_input('What is your shift: '))
    character = ''
    for i in range (0,len(string)):
        if string[i] != ' ' and string[i].islower():
                character= character+chr((ord(string[i])-ord('a')+shift)%26+ord('a'))
        elif string[i] != ' ' and string[i].isupper():
                character= character+chr((ord(string[i])-ord('A')+shift)%26+ord('A'))
        else:
            character = character+ ' '
    print(character+"\n\n")

if __name__ == "__main__":
    answer = ''
    while answer != 'x':
        answer = raw_input("Do you want to:\n\t Calculate gcd [d]\n\t Calculate multiplicative inverse [i]\n\t Calculate entropy [e]\n\t Perform a shift [s]\n\t Exit [x]\n>>> ")
        if answer == 'd':
            x = int(raw_input("Enter your first number: "))
            y = int(raw_input("Enter your second number: "))
            print("The gcd is: " + str(egcd(x,y)[0]))
        elif answer == 'i':
            x = int(raw_input("Enter your number: "))
            y = int(raw_input("Enter your mod: "))
            print("The inverse is: " + str(modinv(x,y)))
        elif answer == 'e':
            entropy()
        elif answer == 's':
            shift()
