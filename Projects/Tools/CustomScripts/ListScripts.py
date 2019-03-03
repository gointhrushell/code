import glob
import os 
dir_path = os.path.dirname(os.path.realpath(__file__))

fileList = glob.glob(dir_path+'\*.py')
for i in range(0,len(fileList)):
    fileList[i] = fileList[i].replace(dir_path+'\\','')
myDescripts={}

with open(dir_path+'\descriptions.txt','r') as f:
    descriptions = f.readlines()
    for line in descriptions:
        myDescripts[line.split(':')[0]] = line.split(':')[1].strip()

for name in fileList:
    if name[:-3] != 'ListScripts':
        print(name[:-3] + ' - ' + myDescripts[name[:-3]])
        