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
    a = 68856037354036668004353678764931799898012680006116785612150138055773065999326730591654301811852208834920255510464347587443739792558954278495627839685543926514421238026570554170178412999523725055662451587578435471780399263014627827511668498690985608016955051398330221589601655017023630688069262976454831441775
    m = 129443004203751354425554327063455814619940341586795269006756644935460949348066323454208269705658506838804662843947081188771748108787492050666025451136964227730929098205471913227922378402659416522412575986854569994203185300217493201892507853634182199719406798599831293450776393950890212301625560786986354956316
    '''function call to begin calculation of modular inverse. 
    Returns None if it does not exist'''
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
    '''Begin entropy calculations. This is highly unreliable for conditional entropy'''
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
    ''' Simple shift cipher'''
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

def factorize(x):
    factors = []
    count = []
    i = 2
    while x > 1:
        if x % i == 0:
            x = x / i
            if i not in factors:
                factors.append(i)
                count.append(1)
            else:
                count[len(count)-1]+=1
                
        else:
            i += 1
    print(factors)
    print(count)
    print('')
    return factors
