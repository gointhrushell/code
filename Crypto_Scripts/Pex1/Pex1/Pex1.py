import random, math, fractions
from timeit import default_timer as timer
def factorize(x):
    factors = []
    count = []
    i = 2
    while x > 1:
        if x % i == 0:
            x = x / i
            if i not in factors:
                factors.append(i)
                count.append(1)
            else:
                count[factors.index(i)]+=1
        else:
            i += 1
    return factors, count


def CheckPrime(num):
    if (num%2 ==0 and num !=2):
        return 0
    for i in range(2,long(math.floor(math.sqrt(num)))+1):
        if num%i==0:
            return 0
    return 1

def Sieve(number):
    if number%2 == 0:
        return "2 is a factor\n"
    Sieve=[0]*(long(math.floor(math.sqrt(number)))+1)
    for i in range(2,len(Sieve)):
        if (i%2 !=0 and Sieve[i]==0 and CheckPrime(i) == 0 ):
            j = 2
            if (i>=2 and i%2!=0 and number%i==0):
                return (str(i) + " is a factor\n")
            else:
                while ((i)*j <= int(math.floor(math.sqrt(number)))):
                    Sieve[(i)*j]+=1
                    j+=1
        
    return "Prime number\n"

def Pollard(number):
    start=timer()
    if number%2 == 0:
        return "2 is a factor"
    
    x = random.randint(0,number-1)
    y = random.randint(0,number-1)
    
    gcd = 1
    while gcd ==1:
        x = (x**2+1)% number
        y = (y*y+1)%number
        y = (y*y+1)%number
        gcd = fractions.gcd(abs(y-x),number)
        if  (gcd == number):
            break
    end = timer()
    return str(gcd) + " is a factor, ran in: " + str(end-start)+"\n"

def dixon(n):
    
    base = [2,3,5,7,11,13,17,19,23]
    try:
        basenumber = int(raw_input("How many factors would you like in your factor base? (leave blank to use default base): "))
    except:
        basenumber=''


    if basenumber !='':
        base=[]
        i = 2
        while len(base)<basenumber:
            if CheckPrime(i) > 0:
                base.append(i)
            i+=1
    start = timer()
    potential=[]
    potential_factors=[]
    potential_powers=[]
    a=1L
    k=1
    while len(potential)< len(base)-1:
        a = math.floor(math.sqrt(n))+k
        
        factors, count = factorize((a**2)%n)
        for i in factors:
            if i not in base:
                allin=0
                break
            else:
                allin = 1
        k+=1
        if allin ==1:
            potential.append(a)
            potential_factors.append(factors)
            potential_powers.append(count)
        

        

    for i in range(0,len(potential)):
        sum_of_powers={}
        for j in range(0,len(potential_powers[i])):
            sum_of_powers[potential_factors[i][j]]=potential_powers[i][j]
        for j in range(i+1,len(potential_factors)):
            for k in range(0,len(potential_factors[j])):
                try:
                    sum_of_powers[potential_factors[j][k]]+=potential_powers[j][k]
                except:
                    sum_of_powers[potential_factors[j][k]]=potential_powers[j][k]
            for m in sum_of_powers.values():
                if m%2!=0:
                    for k in range(0,len(potential_factors[j])):
                        sum_of_powers[potential_factors[j][k]]-=potential_powers[j][k]

                    working = 0
                    break
                else:
                    working = 1
            if working == 1:
                sum =1
                for l in sum_of_powers.keys():
                    sum*=l**(sum_of_powers.get(l)/2)

                myfactor = fractions.gcd(abs((potential[i]*potential[j])%n-sum%n)%n,n)
                if myfactor!=1 and myfactor !=n:
                    end = timer()
                    return (str(myfactor) + " is a factor, ran in: "+ str(end-start))
                else:
                    for k in range(0,len(potential_factors[j])):
                        sum_of_powers[potential_factors[j][k]]-=potential_powers[j][k]

    return "None found"




def BruteForce(number):
    start = timer()
    if number%2 ==0:
        return "2 is a factor\n"
    for i in range(2,long(math.floor(math.sqrt(number)))+1):
        if number%i==0:
            end = timer()
            return str(i) + " is a factor, ran in: " + str(end-start)+"\n"
    end = timer()
    return "Prime number"


if __name__ == '__main__':
    answer = ''
    while answer != 'e':
        print "Would you like to:\n\tBrute Force [b]\n\tPollard Rho [p]\n\tDixons [d]\n\tExit [e]"
        answer = raw_input().lower()
        if answer != 'e':
            number = int(raw_input("What number do you want to test: " ))
        if answer == 'b':
            print(BruteForce(number))
            print('')
        elif answer == 'p':
            print(Pollard(number))
            print('')
        elif answer == 'd':
            print(dixon(number))
            print('')