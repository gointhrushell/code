__author__ = 'C17Jacob.Cook'


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
        return x % m, gcd


def solve(a, b, n):

    modinverse, gcd = modinv(a, n)

    if egcd(n, a)[0] == 1:
        print("                 x = {}".format(b * modinverse % n))

    elif b % egcd(n, a)[0] == 0:
        a1 = a / egcd(n, a)[0]
        b1 = b / egcd(n, a)[0]
        n1 = n / egcd(n, a)[0]

        modinverse1, gcd1 = modinv(a1, n1)
        solution_list = []
        for i in range(0, gcd):
            solution_list.append(b1 * modinverse1 % n1 + i * n1)
        print("                 x = {}".format(solution_list))

    else:
        print("                 A solution for x does not exist")

print("THIS PROGRAM SOLVES FOR:\n\n CONGRUENCY x\n")
for i in range(10):

    print("ax = b (mod n) ")
    a = int(input("     a = "))                            # Enter the x
    b = int(input("     b = "))                            # Enter the y
    n = int(input("     n = "))                            # Enter the y
    print("             {}x = {} (mod {})".format(a, b, n))

    solve(a, b, n)