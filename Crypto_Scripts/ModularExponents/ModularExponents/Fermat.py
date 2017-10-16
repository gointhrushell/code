def Fermat(num):
	a = 2
	FerPrime= []
	if num <=2:
		print None
	else:
		for i in range (3,num+1):
			if a**(i-1)%i == 1:
				if PrimeBruteForce(i)!= 0:
					print(str(i)+'\t**** Fermat Prime but not Prime****')
				else:
					print(str(i)+'\t**** Fermat Prime and real Prime****')
			else:
				print(str(i))
				
def PrimeBruteForce(num):
	a = 3
	returned = 0
	if num%2 == 0:
		return 0
	else:
		while num > a:
			if num%a == 0 & a!=num:
				returned+=1
			a+=2
		return returned
		

if __name__ == '__main__':
	number = int(raw_input("What number do you want to test: "))
	Fermat(number)
	
