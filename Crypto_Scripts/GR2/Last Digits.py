########################################################################################################################
#
# Last Digits calulates the last few digits of a very large number
#
# Author: Jacob Cook        Date: 08 Nov 2015
#
########################################################################################################################

print("Last Digits of a large number")
while True:
    base = int(input("\n\nbase = "))
    exponent = int(input("exponent = "))
    digits = 10 ** int(input("digits = "))

    print(pow(base, exponent, digits))
