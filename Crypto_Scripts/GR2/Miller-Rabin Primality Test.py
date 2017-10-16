########################################################################################################################
# This program factors an integer n using Pollard's Rho Algorithm and possibly return a nontrivial factor of n
#
# The print out includes necessary for (Show Work)
#
# Author: Jacob Cook    Date: 17 Oct 2015
#
########################################################################################################################
import random
import fractions


# this function calculates the prime factorization of n
def factors(n):
    nInitial = n - 1
    n -= 1
    m = 1
    k = 0

    primeFactors = []
    d = 2
    while d*d <= n:
        while (n % d) == 0:
            primeFactors.append(d)  # supposing you want multiple factors repeated
            n //= d
        d += 1

    if n > 1:
       primeFactors.append(n)

    print("\nThe prime factors of {}, (n - 1), are:       {}".format(nInitial, primeFactors))

    for i in range(len(primeFactors)):
        if primeFactors[i] == 2:
            k += 1
        else:
            m *= primeFactors[i]
    print("Reduced to match the form n - 1 = 2^k * m:    k = {} & m = {}\n".format(k, m))
    return m, k


def millerRabin(n, a, t = 1):

    if n < 1 or n % 2 == 0:
        print("Invalid n value")
    else:
        print("\nn = {} & a = {}".format(n, a))

        m, k = factors(n)
        # a = random.randint(2, n - 1) normally random but for the test it is not.
        b = 0

        for i in range(k):
            if i == 0:
                b = (a ** m) % n
                print("b{} = {}^{} = {} (mod {})".format(i, a, m, b, n))
                if abs(b) == 1 or i == (k - 1):
                    print("\n{} is probably prime.".format(n))
                    break
            else:
                b_temp = b
                b = (b ** 2) % n
                print("b{} = {}^2 = {} (mod {})".format(i, b_temp, b, n))
                if b == 1:
                    nonTrivial = fractions.gcd((b_temp - 1), n)
                    print("\nsince b{} is = 1 (mod {}), we conclude that {} is composite.".format(i, n, n))
                    print("Furthermore, {} is a nontrivial factor of {}.".format(nonTrivial, n))
                    break
                elif b == -1 % n:
                    print("\nsince b{} is = 1 (mod {}), we conclude that {} is probably prime.".format(i, n, n))
                    break
            if i == (k - 1) and b != -1 % n:
                print("\nsince b{} ( b(k-1) ) is != -1 (mod {}), we conclude that {} is composite.".format(i, n, n))
                break

print("Miller-Rabin Primality Test")
while True:
    n = int(input("\n\nn = "))
    a = int(input("a = "))

    millerRabin(n, a)



