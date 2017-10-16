from sys import argv as ags,exit

WHITESPACE = ['\t',' ','#','\n']

def getFuncts(data):
    functarray = []
    for i in data:
        if 'def' in i[:4]:
            functname = i.split()[1]
            functarray.append(functname[:functname.index('(')].strip())
    
    return functarray


def rewriteFile():
    file = ags[1]
    rewrite_name = ags[2]
    with open(file,'r') as filename:
        data = filename.readlines()
        
    functNames = getFuncts(data)
    
    for i in range(0,len(functNames)):
        print(str(i+1)+': ' + functNames[i])
    
    functNums = input('\nWhich functions do you want to copy?\n(list of numbers separated by spaces):\n')
    try:
        functList = []
        for i in functNums.split():
            functList.append(functNames[int(i)-1])
    except:
        print("Something was wrong with your input")
        exit(0)
            
    with open(rewrite_name,"w") as filename:
        cont=0
    
        for i in data:
            if 'def' in i[:4]:
                cont=1
                if i[i.index('def ')+4:i.index('(')] in functList:
                    filename.write(i)
                else:
                    cont=0
            else:
                if cont:
                    filename.write(i)
                elif i[0] not in WHITESPACE:
                    filename.write(i)
                    cont=1
                    
if __name__ == '__main__':
    if len(ags) != 3:
        print('usage: ' + ags[0] + ' [file_to_copy] [file_to_write]')
    rewriteFile()