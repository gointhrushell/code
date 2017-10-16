########################################################################################################################
#   PEX 1:  output the statistics for factoring n (ie: the time elapsed in finding a factor as well as the identified
#           factor itself) using the 3 algorithms specified below:
#                   Brute Force
#                   Pollard's rho algorithm
#                   Dixon's algorithm
#
#   Author: Jacob Cook        Date: 27 Oct 2015
#
# Documentation: None
########################################################################################################################

import math
import random
import fractions
import operator
import functools
import itertools

import time


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


# calculates the exponents for each factor un the factor base that result in a complete factorization of x
def exponentiation(x, factorBase):

    primeFactorCounts = [0] * len(factorBase)       # list of how many times each factor in the factor base is used

    # generate counts of each factor in factor base
    for i in range(len(factorBase)):
        while (x % factorBase[i]) == 0:
            primeFactorCounts[i] += 1               # increment the count of the factor by 1
            x //= factorBase[i]                     # reduce x by dividing it by the factor in the factor base

    if x > 1:                                       # x was unable to be fully factored by the factor base thus invalid
        return None                                 # return None
    else:
        return primeFactorCounts                    # return the count of each factor in the factor base


# factoring algorithm that utilized the Dixon's Algorithm
def dixonsAlgorithm(n, factorBaseLimit):

    factorBase = []             # list of factors [ 2, 3, ... ]
    xValues = []                # randomly selected x values
    xValuesValid = []           # randomly selected x values which satisfy requirements
    xExponentMatrix = []        # matrix which contains exponents of each factor in the factor base for valid x values
    currentNumber = 2           # current number to check for primality

    # reference values to access each valid x value and each exponent list

    listReferences = []
    for i in range(factorBaseLimit):
        listReferences.append(i)

    # generate the factor base

    while len(factorBase) < factorBaseLimit:
        if isPrime(currentNumber):              # check for primality
            factorBase.append(currentNumber)    # add the prime value to the factor base

        currentNumber += 1                      # increment the current number

    print("\nThe factor Base is: {}".format(factorBase))  # print factor base

    # calculate random x values and their respective factor base exponentiation
    i = 0
    while len(xValuesValid) < len(factorBase) * 2:
        possibleX = 50+i                          # random x value that may satisfy requirements
        exponents = exponentiation(possibleX ** 2 % n, factorBase)      # exponentiation of factor base or None
        i+=1

        # validate x value is not a repeat

        if possibleX not in xValues:
            xValues.append(possibleX)                                   # document use of specific x value

            # validate x value can be fully factored by the factor base

            if exponents is not None:
                xValuesValid.append(possibleX)                          # include current x value in list of valid x's
                xExponentMatrix.append(exponents)                       # include exponentiation of x in matrix
                print("({}) x Value:\t\t{}\t-->\t\t{}^2 (mod {})   \t=  \t{}   \t=  \tExponent list:\t{}".format(len(xValuesValid)-1, possibleX, possibleX, n, possibleX ** 2 % n, exponents))

    # check each possible combination length of valid x values

    print("\nCheck possible combinations until a solution is found.\n")

    for i in range(2, factorBaseLimit + 1):

        # process each combination

        for subset in itertools.combinations(listReferences, i):

            possibleExponentCombination = [0] * len(factorBase)
            x = 1

            for j in range(len(subset)):
                possibleExponentCombination = list(map(operator.add,
                                                       possibleExponentCombination, xExponentMatrix[subset[j]]))
                x = x * xValuesValid[subset[j]]

            mod2Check = sum([x % 2 for x in possibleExponentCombination])

            if mod2Check == 0:
                y = math.sqrt(functools.reduce(lambda x, y: x * y, list(map(operator.ipow,
                                                                            factorBase, possibleExponentCombination))))
                factorSolution = fractions.gcd(x - y, n)

                if factorSolution != 1 and factorSolution != n:

                    print("The first valid combination was between choices {}.".format(subset))
                    print("This combination results in a final x value of {} and a final y value {}.\n".format(x, y))

                    return int(factorSolution)  # return the first found factor


print("Dixon's Algorithm Factoring.\n")

while True:

    n = int(input("Enter a number to factor: "))
    numFactors = int(input("Enter the number of facotrs in the factor base: "))

    factor = dixonsAlgorithm(n, numFactors)

    if factor is not None:
        print("Found a factor = {}".format(factor))
    else:
        print("No factor was found.")
