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

answer = ''
while answer != 'x':
    answer = raw_input("Do you want to:\n\t Calculate gcd [d]\n\t Calculate multiplicative inverse [i]\n\t Exit [x]\n>>> ")
    if answer == 'd':
        x = int(raw_input("Enter your first number: "))
        y = int(raw_input("Enter your second number: "))
        print("The gcd is: " + str(egcd(x,y)[0]))
    elif answer == 'i':
        x = int(raw_input("Enter your number: "))
        y = int(raw_input("Enter your mod: "))
        print("The inverse is: " + str(modinv(x,y)))
