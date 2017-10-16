import random


def Miller(number1):
    print("Testing number: " + str(number1))
    reducedNumber1=number1-1
    i = 0

    while reducedNumber1%2 == 0:
        i+=1
        reducedNumber1=reducedNumber1/2

    print("2^"+str(i)+" * " +str(reducedNumber1))

    #a = random.randint(2,number1-2)
    a=7

    y = (a**reducedNumber1)%number1
    if (y!= 1 and y!=number1-1):
        print("A: " + str(a))
        j = 1
        while (j <= i-1 and y!=number1-1):
            print('Y: ' + str(y))
            y = y**2%number1
            print("Y: " + str(y) + "\nJ: " + str(j))
            j+=1
            if (y==1):
                return "Composite"
        if (y!=number1-1):
            return "Composite"
    return "Probably Prime"


print(Miller(97))


