########################################################################################################################
# This program checks whether a number is a primitive root of another number
#
# The print out includes necessary for (Show Work)
#
# Author: Jacob Cook    Date: 17 Oct 2015
#
########################################################################################################################

# Determine if x is prime, returns Bool
def isPrime(x):
    if x < 2:
        return False
    elif x == 2:
        return True

    for i in range(2, x):
        if x % i == 0:
            return False

    return True


def primitive(a, n):
    if isPrime(n):
        print("\nn is prime\t\t\t\tCheck!")
        check1 = int(a ** (n - 1) % n)
        check2 = int((a ** ((n - 1) / 2) % n))

        if check1 == 1:
            print("a^(n-1):\t{}^{} mod {} = 1 \tCheck!".format(a, n - 1, n))

            if check2 == n - 1:
                print("a^((n-1)/2):\t{}^{} mod {} = {} \tCheck!\n".format(a, int((n - 1) / 2), n, n - 1))

                solutions = []

                failure = 0
                
                for exponent in range(1, (n - 1) // 2 + 1):
                    solCheck = a ** exponent % n
                    print("{}^{} mod {} = {}".format(a, exponent, n, solCheck))
                    if solCheck in solutions:
                        print("\n***There was a repeat solution of {}***\n".format(solCheck))
                        failure = 1
                        break
                    else:
                        solutions.append(solCheck)

                if failure == 0:
                    print("There are no repeat solutions so {} is a primitive root of {}".format(a, n))

                else:
                    print("There was a repeat in the solution. Thus {} is not a primitve root of {}".format(a, n))

            else:
                print("{}^{} mod {} != {}. Thus {} is not a primitive root of {}".format(a, int((n - 1) / 2), n, n - 1, a, n))

        else:
            print("{}^{} mod {} != 1. Thus {} is not a primitive root of {}".format(a, n - 1, n, a, n))

    else:
        print("{} is not prime. Thus {} is not a primitive root of {}".format(n, a, n))

print("Primitive Root Check: a is a primitve root of n")
while True:
    a = int(input("\n\na = "))
    n = int(input("n = "))
    primitive(a, n)


