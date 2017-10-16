#Example 70 = 2**x mod 131

from random import randrange
from math import sqrt
def primitive_root(num=int, root=int):
    isPrime = True
    if num%2 != 0:
        for i in range(3, num):
            if num%i == 0:
                isPrime = False
    else:
        isPrime = False
    resultsArray = []
    if isPrime:
        if pow(root, int(num-1), num) == 1:
            if pow(root, int((num-1)/2), num) == num - 1 or pow(root, int((num-1)/2), num) == -1:
                for m in range(1, int((num-1)/2)):
                    if m == 1:
                        resultsArray.append(root**m % num)
                    else:
                        for this in resultsArray:
                            if this == root**m % num:
                                return "is not"
                        resultsArray.append(root**m % num)
                return "is"
            else:
                return"is not"
        else:
            return "is not"

def last_digits(base, exponent, numDigits):
    digits = "1"
    for i in range(0, numDigits):
        digits += "0"
    digits = int(digits)

    return (pow(base, exponent, digits))

def probably_prime(n, k):
    """Return True if n passes k rounds of the Miller-Rabin primality
    test (and is probably prime). Return False if n is proved to be
    composite.

    """
    small_primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31]
    if n < 2: return "is Composite"
    for p in small_primes:
        if n < p * p: return "is Prime"
        if n % p == 0: return "is Composite"
    r, s = 0, n - 1
    while s % 2 == 0:
        r += 1
        s //= 2
    for _ in range(k):
        a = randrange(2, n - 1)
        x = pow(a, s, n)
        if x == 1 or x == n - 1:
            continue
        for _ in range(r - 1):
            x = pow(x, 2, n)
            if x == n - 1:
                break
        else:
            return "is Composite"
    return "is Prime"

def baby_step_giant_step(y, a, n):

    s = int((sqrt(n))//1)

    A = []
    B = []

    for r in range(0,s):
        value = y*(a**r) % n
        A.append(value)

    for t in range(1,s+1):
        value = a**(t*s) % n
        B.append(value)

    print (A)
    print (B)

    x1,x2 =0,0

    for r in A:
        for t in B:
            if r == t:
                x1 = A.index(r)
                x2 = B.index(t)
                print (x1,x2)
                break


    print ('the value of x is ', ((x2+1)*s - x1) % n) # Answer



baby_step_giant_step(191, 28, 331)
