########################################################################################################################
# This program factors an integer n using Pollard's Rho Algorithm
#
# The print out includes necessary for (Show Work)
#
# Author: Jacob Cook    Date: 17 Oct 2015
#
########################################################################################################################
import random


def gcd(x, y):
    while y != 0:
        (x, y) = (y, x % y)
    return x


def pollardRho(N):
    if N%2==0:
        return 2
    x = random.randint(1, N-1)
    y = x
    g = 1
    while g == 1:
        print("a = {}, b = {}, d = {}".format(x, y, g))
        x = ((x ** 2) + 1) % N
        y = ((y ** 2) + 1) % N
        y = ((y ** 2) + 1) % N
        g = gcd(abs(x-y),N)

    print("a = {}, b = {}, d = {}".format(x, y, g))
    return g

print("Pollards Rho Algorithm")
while True:
    userInput = int(input("\n\nn = "))
    print(pollardRho(userInput))
