__author__ = 'C17Nicholas.Harron'

import random

print("This program generates two 8-bit primes, p and q along with n and totient n")

# a is prime if all numbers between 2 and a (not inclusive) give non-zero remainder when divided into a.
def is_prime(a):
    return all(a % i for i in range(2, a))

i = 0

while True:
    if i == 0:
        p = 4
        q = 4

        while is_prime(p) == False:
            p = random.randint(129,255)

        while is_prime(q) == False:
            q = random.randint(129,255)

        print("p = " + str(p))
        print("q = " + str(q))

        print("n = " + str(p * q))
        print("Totient of (n) = " + str((p - 1) * (q - 1)))

        i = 1
