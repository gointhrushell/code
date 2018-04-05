#!/usr/bin/python3
from subprocess import Popen, PIPE, STDOUT,check_output
import time,string,re,base64,glob,argparse

import os,multiprocessing,binascii

shellcode = ('\x31\xc0\x99\x52\x68\x2f\x63\x61\x74\x68\x2f\x62\x69\x6e\x89\xe3\x52\x68\x73\x73\x77\x64\x68\x2f\x2f\x70\x61' \
                '\x68\x2f\x65\x74\x63\x89\xe1\xb0\x0b\x52\x51\x53\x89\xe1\xcd\x80')

LOGFILE = '/tmp/fuzz.log'

organized_payloads = {}
organized_payloads['bof']=['abcdef'*25,'abcdef'*50,'abcdef'*100,'abcdef'*200]
bof_index = {}
bof_index['abcdef'*25] = "\'abcdef\'*25"
bof_index['abcdef'*50] = '\"abcdef"*50'
bof_index['abcdef'*100] = '\"abcdef"*100'
bof_index['abcdef'*200] = '\"abcdef"*150'


organized_payloads['format']=['%018x','%n']
organized_payloads['rce']=['`ls`','$(ls)','#$(ls)']
organized_payloads['sql']=["'-- ",'"-- ',"' or 'adsa'='adsa"]
organized_payloads['logic']=['; return true','; return True','; return false','; return False']
organized_payloads['misc']=[i*2 for i in string.punctuation]
organized_payloads['whitespace']=[' '*10,'\n','\t']
organized_payloads['stupid']=['-s','--shell','--exec ls','--exec','-e','-h','--help','--execute ls','-c ls', '--cmd ls']

pattern = re.compile(r'Segmentation fault|sigsev|stack smashing|\[.*?\] (.*?)\[.*?\].*?segfault at [0-9a-fA-F]+ ip ([0-9a-fA-F]+)',flags=re.I)
shell_pattern=re.compile(r'shell|bash|execute',flags=re.I)
format_pattern=re.compile(r'[0-9a-fA-F]{18}',flags=re.I)
hexin = re.compile(r'(\\x)([0-9a-fA-F]{2})')

def interp_hex_cmdline(text_in):
    text_in.replace('\\n','\n').replace('\\t','\t')
    finder = re.findall(hexin,text_in)
    for i in finder:
        text_in = text_in.replace(i[0]+i[1],chr(int(i[1],16)))
    return text_in

def get_files(path,recurse):
    files = []
    for i in glob.glob(path,recursive=recurse):
        if os.path.isfile(i):
            files.append(i)
    return files

def b64(payload):
    return base64.b64encode(bytes(payload,'utf-8')).decode('utf-8')

def get_output(proc,stdout_data):
    while True:
        line = proc.stdout.readline().decode('utf-8')
        if line.strip(' ').strip('\n').strip('\t') != '':
            stdout_data.put(line)

def logger(line):
    with open(LOGFILE,'a') as log:
        log.writelines(f'{line}\n')

def stdinInput(path,pay_type,payload,pre='',post=''):
    
    stdout_data = multiprocessing.Queue()
    output = ''
    try:
        p = Popen([path], stdout=PIPE, stdin=PIPE, stderr=PIPE,shell=True)
        t = multiprocessing.Process(target=get_output,args=(p,stdout_data))
        t.start()
        time.sleep(.1)
        p.communicate(bytes(pre+payload+'\n'+post,'utf-8'),timeout=1)
        time.sleep(.1)
        t.terminate()
        

        for i in range(stdout_data.qsize()):
            output += stdout_data.get()

        if pay_type=='bof' or pay_type=='format': # These should pretty much be the only ones causing seg faults so lets check them out with special care

############################## Checking for hex leaked by %018x ############################## 
            format_test = re.search(format_pattern,output)
            if format_test:
                text = f'Format string vulnerability! {payload} leaked {format_test[0]}'
                print("Format string vulnerability")
                logger(text+"\n")

############################## Checking for segfaults ##############################
            if p.poll() == 139: #Detected segfault
                dmesg = check_output("dmesg -e | tail -n 1",shell=True).decode('utf-8')
                match = re.search(pattern,dmesg)  # Lets get the EIP to help out!
                if match:
                    text = f'Potential {pay_type} in {match.group(1)}: EIP = ' + match.group(2)
                    print(text)
                    
                    if pay_type != 'bof':
                        logger(text+"\n"+f'Payload: {binascii.unhexlify(binascii.hexlify(bytes(payload,"utf-8")))}\n')
                    else: # if its from a bof, print the minified payload
                        logger(text+"\n"+f'Payload: {bof_index[payload]}\n')


        else:
############################## Checking for shell indicators ##############################
            if re.search(shell_pattern,output):
                if payload == '-h' or '--help':
                    text = f'Potential shell in {path}. See -h or --help'
                    print(text)
                    logger(f'{text}\n')
                else:
                    text = f'Shell indicators in {path}\n'+"-"*20+"\n"+output+"-"*20+"\n"
                    print(text)
                    logger(text+"\n"+f'Payload: {binascii.unhexlify(binascii.hexlify(bytes(payload,"utf-8")))}\n')
        return
    except Exception as e:
        print("Unable to communicate with the process")
        print(e)
    


def main():
    with open(LOGFILE, 'w') as log:
        pass
    for i in files:
        filename =i.split('\\')[-1]
        print(f"Testing {filename}\n")
        with open(LOGFILE,'a') as log:
            log.write(f'Testing {i}\n')
        for j in organized_payloads.keys():
            for k in organized_payloads[j]:
                #print(f'Sending {j} to {i}')
                stdinInput(i,j,k)
    print("\nFinished\nSee /tmp/fuzz.log for more info")

        
if __name__ == '__main__':
    a = argparse.ArgumentParser()
    a.add_argument('-p','--path',type=str,help='Directory or file to fuzz',action='store',dest='path',required=True)
    a.add_argument('-e','--ext',type=str,help='File extension to use (.txt,.exe,.elf)',action='store',dest='ext')
    
    a.add_argument('--pre',help='String input before payload. Useful if you have to nagivate a menu (interprets pythonic \\n, \\t and \\xFF)',type=str,action='store',dest='pre')
    a.add_argument('--post',help='String input after payload. Useful if you have to trigger the exploit (interprets pythonic \\n, \\t and \\xFF)',type=str,action='store',dest='post')
    a.add_argument('-r','--recurse',help='Include to recursively look through directory provided',action='store_true',dest='recurse')
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
        files = [path]
    else:
        files = get_files(path+('\\' if os.name=='nt' else '/')+ext,recurse)
        
    if var['pre']:
        pre_input = interp_hex_cmdline(var['pre'])      

    if var['post']:
        post_input = interp_hex_cmdline(var['post'])


    try:
        main()
    except KeyboardInterrupt:
        print("\nGoodbye")