########################################################################################################################
#
# Baby Step Giant Step - Conducts the algorithm to analyse log(a) b (mod p)
#
# Author/Editor: Jacob Cook        Date: 11 Nov 2015
#
# Primary Code provided By Nick Harron
#
########################################################################################################################

import math


def egcd(a, b):
    if a == 0:
        return b, 0, 1
    else:
        g, y, x = egcd(b % a, a)
        return g, x - (b // a) * y, y


# returns the inverse mod of a given mod n
def modinv(a, m):
    gcd, x, y = egcd(a, m)
    if gcd != 1:
        return None, gcd  # modular inverse does not exist
    else:
        return x % m


# Implements the Baby Step Giant Step approach
def babyGiant(a, b, p, N):
    alist = []
    blist = []
    print N
    inverse = modinv(a,p)
    for i in range(0, p):
        alist.append((a ** i) % p)
        blist.append((b * (inverse) ** (N * i)) % p)

    print("\nj\t|\tk\t|\ta^j\t|\tb*a^(-Nk)\n------------------------------------------------")   # table titles

    for j in range(len(alist)):
        for k in range(len(blist)):

            print("{}\t|\t{}\t|\t{}\t|\t{}".format(j, k, alist[j], blist[k]))

            if(alist[j] == blist[k] and j + N * k < p):
                print("*** Match Found ***\n")

                return j, k


print("In the form of x = log_a ( b ) (mod p)")

while True:
    a = int(input("\n\na = "))
    b = int(input("b = "))
    p = int(input("p = "))

    N = math.floor(math.sqrt(p - 1)) + 1
    print("N = {}".format(N))

    print("a^-1 (mod p) =  {}".format(modinv(a, p)))

    j, k = babyGiant(a, b, p, N)

    x = j + N * k

    print("j = {} and k = {}".format(j, k))
    print("x = log_{} ( {} ) (mod {}) = {}".format(a, b, p, x))





