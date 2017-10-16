__author__ = 'C17Jacob.Cook'

from itertools import groupby


def gcd(x, y):
    while y != 0:
        (x, y) = (y, x % y)
    return x

def is_prime(x):
    if x<2 :
        return False
    elif x == 2:
        return True

    for numbers in range(2,x):
        if x % numbers ==0:
            return False
    return True


def primes(n):
    primfac = []
    d = 2
    while d*d <= n:
        while (n % d) == 0:
            primfac.append(d)  # supposing you want multiple factors repeated
            n //= d
        d += 1
    if n > 1:
       primfac.append(n)
    return primfac


def chinese_remainder_theorem(a, n):

    if is_prime(n):
        if a == 1:
            # x = {1,n-1}
            for i in range(1, n):
                print("x = {}".format(i))

        elif n % 4 == 3 % 4:
            possible_x1 = int(a**((n + 1)/4) % n)
            possible_x2 = int(-a**((n + 1)/4) % n)

            if possible_x1**2 % n == a and possible_x1**2 % n == a:
                print("                 x is congruent to: {} and {}".format(possible_x1, possible_x2))
            else:
                print("                 A solution for x does not exist")

        else:
            solution_found = False
            for i in range(1, n):
                if i**2 % n == a:
                    solution_found = True
                    print("                 x is congruent to: {}".format(i))
            if solution_found is False:
                print("                 A solution for x does not exist")
    else:
        coprime_list = []

        prime_list = primes(n)
        prime_list.sort()

        frequency_list = [len(list(group)) for key, group in groupby(prime_list)]
        prime_list = sorted(set(prime_list))

        for i in range(0, len(prime_list)):
            coprime_list.append(prime_list[i] ** frequency_list[i])

        sorted(coprime_list, reverse=True)
#       print("The co-primes of {} are: {}".format(n, coprime_list))

        coprime_solution_list_long = [[[]for i in range(10)] for i in range(10)]
        coprime_solution_list = []

        a_values = []
        n_values = []
        for i in range(0, len(coprime_list)):
            a_values.append(a % coprime_list[i])
            n_values.append(coprime_list[i])
            k = 0

            for j in range(0, n_values[i]):
                if j**2 % n_values[i] == a_values[i]:
                    coprime_solution_list_long[i][k] = j
                    k += 1

        for i in range(10):
            coprime_solutions = [x for x in coprime_solution_list_long[i] if x != []]
            coprime_solution_list.append(coprime_solutions)

        coprime_solution_list = [x for x in coprime_solution_list if x != []]

#        for i in range(len(coprime_list)):
#            print("\nSolving x^2 = {} mod {}".format(a_values[i], coprime_list[i]))
#            print("x is congruent to: {}".format(coprime_solution_list[i]))

        possible_a_values_final =[]
        for i in range(len(coprime_solution_list)):
            # 1 and 2
            for j in coprime_solution_list[i]:
                possible_a_values = []
                # 1 3 5 7 then 0
                for k in range(n):
                    # 0 1 2 3 4 5 6 7 then 0 1 2
                    if k % n_values[i] == j % n_values[i]:
                        possible_a_values.append(k)

                possible_a_values_final.append(possible_a_values)

#                print(possible_a_values_final)

        final_a_values = []
        for i in range(len(possible_a_values_final)):
            for j in range(len(possible_a_values_final[i])):
                final_a_values.append(possible_a_values_final[i][j])

        final_a_values = [x for x in final_a_values if final_a_values.count(x) >= 2]
        final_a_values = set(final_a_values)
        if final_a_values == set():
            print("                 A solution for x does not exist")
        else:
            print("                 \nSolving x^2 = {} mod {}".format(a, n))
            print("                 x is congruent to: {}".format(final_a_values))

#  x^2 = a (mod n)
print("THIS PROGRAM SOLVES FOR:\n\n CONGRUENCY x^2\n")
for i in range(10):

    print("x^2 = a (mod n)")
    a = int(input("     a = "))                            # Enter the a
    n = int(input("     n = "))                            # Enter the n

    print("              x^2 = {} (mod {})".format(a, n))


    chinese_remainder_theorem(a, n)

