import Crypto


def decryptRSA():
    p = int(raw_input("What is your first prime: "))
    q = int(raw_input("What is your second prime: "))

    n = p*q
    totient = (p-1)*(q-1)

    e = int(raw_input("what is your e value: "))
    d = Crypto.modinv(e,totient)

    message = []
    count = int(raw_input("How many numbers in your message: "))
    for i in range(0,count):
        message.append(int(raw_input("What is the next number: ")))
    print('')
    decrypt=''
    for i in message:
        decrypt += chr(i**d%n)
    print(decrypt)

def decryptRSAPrimes():
    n = int(raw_input("What is your n: "))
    factors = Crypto.factorize(n)
    p=factors[0]
    q=factors[1]

    totient = (p-1)*(q-1)

    e = int(raw_input("what is your e value: "))
    d = Crypto.modinv(e,totient)

    message = []
    count = int(raw_input("How many numbers in your message: "))
    for i in range(0,count):
        message.append(int(raw_input("What is the next number: ")))
    print('')
    decrypt=''
    for i in message:
        decrypt += chr((i**d%n))
    print(decrypt)