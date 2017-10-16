########################################################################################################################
#
# RSA Encrpt - Conducts the algorithm to analyse log(a) b (mod p)
#
# Author: Jacob Cook        Date: 11 Nov 2015
#
########################################################################################################################

from fractions import gcd


def egcd(a, b):
    if a == 0:
        return b, 0, 1
    else:
        g, y, x = egcd(b % a, a)
        return g, x - (b // a) * y, y


def modinv(a, m):
    gcd, x, y = egcd(a, m)
    if gcd != 1:
        return None, gcd  # modular inverse does not exist
    else:
        return x % m


print("RSA Solver")

while True:

    n = int(input("\n\nn = "))
    p = int(input("p = "))
    q = int(input("q = "))

    totient = (p - 1) * (q - 1)
    print("totient = {}".format(totient))

    M = int(input("\nM = "))

    # calculate e
    for e in range(3, totient):
        if(gcd(e, totient) == 1):
            break

    # calculate d
    d = modinv(e, totient)

    print("\nThe public key is the combination of e ({}) and n ({}).\n".format(e, n))
    print("The private key is d ({})\n".format(d))

    # calculate c
    c = (M ** e) % n
    print("To encrypt M ({}), use the formula: c = M^e (mod n)\nc = {} = {}^{} (mod {})\n".format(M, c, M, e, n))

    # calculate M
    checkM = (c ** d) % n

    print("To decrypt c ({}), use the formula: M = c^d (mod n)\nM = {}^{} mod {} = {}".format(c, M, c, d, checkM))
