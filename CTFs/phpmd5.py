import hashlib
import sys
import itertools
import string


def is_desireable(test):
    
    try:
        ind = test.index('e')
    except:
        return False
    try:
        if int(test[0:ind]) == 0:
            try:
                if test[ind+1:].isdigit():
                        return True
            except IndexError:
                return True
        return False
    except:
        return False


#i = 500000000
i = 531827485
# Last stop = 517371970
'''
while True:
    m = hashlib.md5()
    message = str(i)
    
    m.update(message.encode())
    test1 = m.hexdigest()
    if is_desireable(test1):
        print("FIRST LEVEL: " + message + " = " + test1)
        del m
        m = hashlib.md5()
        m.update(test1.encode())
        test2 = m.hexdigest()
        if is_desireable(test2):
            print("FOUND: " + message)
            sys.exit(0)
            
    del m
    
    i+=1

''' #Z-FILLING
while True:
    
    for j in range(len(str(i)),len('462097431906509019562988736854')):
        m = hashlib.md5()
        message = "0e" + str(i).zfill(j)
        
        m.update(message.encode())
        test1 = m.hexdigest()
        if is_desireable(test1):
            print("FIRST LEVEL: " + message + " = " + test1)
            del m
            m = hashlib.md5()
            m.update(test1.encode())
            test2 = m.hexdigest()
            if is_desireable(test2):
                print("FOUND: " + message)
                sys.exit(0)
                
        del m
        
    i+=1
#'''