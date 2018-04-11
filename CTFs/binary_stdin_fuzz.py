#!/usr/bin/python3
from subprocess import Popen, PIPE, STDOUT,check_output
import time,string,re,glob,argparse,sys,struct

import os,multiprocessing,binascii

LOGFILE = '/tmp/fuzz.log'
SUCCESSFILE = '/tmp/exploit.log'
VERBOSE = 0

ruby_pattern = 'Aa0Aa1Aa2Aa3Aa4Aa5Aa6Aa7Aa8Aa9Ab0Ab1Ab2Ab3Ab4Ab5Ab6Ab7Ab8Ab9Ac0Ac1Ac2Ac3Ac4Ac5Ac6Ac7Ac8A' \
    'c9Ad0Ad1Ad2Ad3Ad4Ad5Ad6Ad7Ad8Ad9Ae0Ae1Ae2Ae3Ae4Ae5Ae6Ae7Ae8Ae9Af0Af1Af2Af3Af4Af5Af6Af7Af8Af9Ag0Ag1Ag' \
    '2Ag3Ag4Ag5Ag6Ag7Ag8Ag9Ah0Ah1Ah2Ah3Ah4Ah5Ah6Ah7Ah8Ah9Ai0Ai1Ai2Ai3Ai4Ai5Ai6Ai7Ai8Ai9Aj0Aj1Aj2Aj3Aj4Aj5A' \ 
    'j6Aj7Aj8Aj9Ak0Ak1Ak2Ak3Ak4Ak5Ak6Ak7Ak8Ak9Al0Al1Al2Al3Al4Al5Al6Al7Al8Al9Am0Am1Am2Am3Am4Am5Am6Am7Am8Am9A' \
    'n0An1An2An3An4An5An6An7An8An9Ao0Ao1Ao2Ao3Ao4Ao5Ao6Ao7Ao8Ao9Ap0Ap1Ap2Ap3Ap4Ap5Ap6Ap7Ap8Ap9Aq0Aq1Aq2Aq3' \
    'Aq4Aq5Aq6Aq7Aq8Aq9Ar0Ar1Ar2Ar3Ar4Ar5Ar6Ar7Ar8Ar9As0As1As2As3As4As5As6As7As8As9At0At1At2At3At4At5At6At7' \
    'At8At9Au0Au1Au2Au3Au4Au5Au6Au7Au8Au9Av0Av1Av2Av3Av4Av5Av6Av7Av8Av9Aw0Aw1Aw2Aw3Aw4Aw5Aw6Aw7Aw8Aw9Ax0Ax1' \
    'Ax2Ax3Ax4Ax5Ax6Ax7Ax8Ax9Ay0Ay1Ay2Ay3Ay4Ay5Ay6Ay7Ay8Ay9Az0Az1Az2Az3Az4Az5Az6Az7Az8Az9Ba0Ba1Ba2Ba3Ba4Ba5Ba'


organized_payloads = {}
organized_payloads['bof']=[ ruby_pattern[:i] for i in [17,33,65,200,400,800]]


organized_payloads['format']=['%018x','%n']
organized_payloads['rce']=['`/bin/ls`','$(/bin/ls)','#$(/bin/ls)']
organized_payloads['sql']=["'-- ",'"-- ',"' or 'adsa'='adsa"]
organized_payloads['logic']=['; return true','; return True','; return false','; return False']
organized_payloads['misc']=[i*2 for i in string.punctuation]
organized_payloads['alpha']=['a','A','z','Z']
organized_payloads['digits']=['-1','0','1','9']

pattern = re.compile(r'(?:Segmentation fault)|(?:sigsev)|(?:stack smashing)|(?:\[.*?\] (.*?)\[.*?\].*?segfault at [0-9a-fA-F]+ ip ([0-9a-fA-F]+))',flags=re.I)
format_pattern=re.compile(r'[0-9a-fA-F]{18}',flags=re.I)
hexin = re.compile(r'(\\x)([0-9a-fA-F]{2})')

class BOF(Exception):
    pass

class NOBASE(Exception):
    pass

def interp_hex_cmdline(text_in):
    text_in = text_in.replace('\\n','\n').replace('\\t','\t')
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

def get_output(proc,stdout_data):
    try:
        while True:
            line = proc.stdout.readline().decode('utf-8')
            if line.strip(' ').strip('\n').strip('\t') != '':
                stdout_data.put(line)
    except KeyboardInterrupt:
        sys.exit(0)
    except Exception as e:
        print("get_output got an exception")
        sys.exit(0)
    

def logger(line,file=0):
    if not file:
        with open(LOGFILE,'a') as log:
            log.writelines(f'{line}\n')
    else:
        with open(SUCCESSFILE,'a') as log:
            log.writelines(f'{line}\n')
        
def build_input(payload):
    proc_input=bytes(payload+'\n','utf-8')
    try:
        proc_input = bytes(pre_input,'utf-8')+proc_input
    except:
        pass
    try:
        proc_input = proc_input+bytes(post_input,'utf-8')
    except:
        pass
    return proc_input
    
def baseline(path,payload):
    stdout_data = multiprocessing.Queue()
    output = ''
    try:
        try:
            p = Popen([path], stdout=PIPE, stdin=PIPE, stderr=PIPE,shell=True)
            t = multiprocessing.Process(target=get_output,args=(p,stdout_data))
            t.start()
            
            pid = t.pid
            proc_input = build_input(payload)
            
            time.sleep(.1)
            p.stdin.write(proc_input)
        
            p.communicate(timeout=2)
        except:
            pass
        time.sleep(.1)
        os.kill(pid,9)
        
        for i in range(stdout_data.qsize()):
            output += stdout_data.get()
        p.kill()   
        if output=='':
            raise NOBASE
        return output
    except NOBASE:
        raise NOBASE
    except Exception as e:
        print("Establishing baseline failed")
        print(e)
    
def stdinInput(path,pay_type,payload,new_baseline):
    
    stdout_data = multiprocessing.Queue()
    output = ''
    try:
        p = Popen([path + " 2>/dev/null"*VERBOSE], stdout=PIPE, stdin=PIPE, stderr=PIPE,shell=True)
        t = multiprocessing.Process(target=get_output,args=(p,stdout_data))
        t.start()
        pid = t.pid
        proc_input = build_input(payload)
        
        time.sleep(.1)
        p.stdin.write(proc_input)
        p.communicate(timeout=2)
        time.sleep(.1)
        

        for i in range(stdout_data.qsize()):
            output += stdout_data.get()
        poll = p.poll()
        
        if pay_type=='bof' or pay_type=='format': # These should pretty much be the only ones causing seg faults so lets check them out with special care

############################## Checking for hex leaked by %018x ############################## 
            format_test = re.search(format_pattern,output)
            if format_test:
                text = f'Format string vulnerability! {payload} leaked {format_test[0]}'
                print("Format string vulnerability")
                logger(text+"\n",1)

############################## Checking for segfaults ##############################
            if poll == 139: #Detected segfault
                dmesg = check_output("dmesg -e | tail -n 1",shell=True).decode('utf-8')
                match = re.search(pattern,dmesg)  # Lets get the EIP to help out!
                if match:
                    EIP = match.group(2)[-8:]
                    pattern_offset = binascii.unhexlify(EIP)[::-1].decode('utf-8')
                    
                    pattern_offset = payload.index(pattern_offset)
                    text = '*'*20+f'\nPotential {pay_type} in {match.group(1)}: EIP = ' + EIP +'\nPattern offset = ' + str(pattern_offset)+'\n'+'*'*20
                    print(text)
                    
                    if pay_type != 'bof':
                        logger(text+"\n"+f'Payload: {}\n',1)
                    else:
                        logger(text+"\n"+f'Offset: {pattern_offset}\n',1)
                        bof_exception = BOF()
                        raise bof_exception

        elif pay_type == 'misc' or pay_type=='alpha' or pay_type=='digits' or pay_type=='rce' or pay_type=='sql': # Who knows whats gonna break or how
            if output != new_baseline:
                text = f"Unexpected output with {proc_input} as input. This is commonly a false report"
                print(text)
                logger(text+"\nOutput:\n"+output)
                
        
        else:
            logger(f'Nothing unexpected with {proc_input}')
        return
    except BOF:
        raise bof_exception
    except Exception as e:
        #print(f"Unable to communicate with the process with payload {proc_input}")
        if str(e) == 'substring not found':
            text = f'Potential bof but pattern not recognized.'
            print(text)
            logger(f'Potential bof with payload length {len(payload)} but pattern not recognized. Try increasing payload size')
        else:
            if 'timed out' not in str(e) or VERBOSE:
                print(e)
        return
    finally:
        os.kill(pid,9)
        p.kill()


def main():
    with open(LOGFILE, 'w') as log: # Clear the log file before writing a new test case
        pass
    
    with open(SUCCESSFILE, 'w') as log: # Clear the log file before writing a new test case
        pass    
    
    for i in files:
        filename =i.split('\\')[-1]
        print(f"\nTesting {filename}\n")
        with open(LOGFILE,'a') as log:
            log.write(f'Testing {i}\n')
            
        try:    
            new_baseline = baseline(i,'aa')
        except NOBASE:
            new_baseline=''
            text = "There was no output to use as a baseline. This may lead to false output"
            print(text)
            logger(text)
            answer = input("Enter S to skip, Q to quit or [Enter] to continue\n> ").lower()
            if  answer == 'q':
                sys.exit(0)
            elif answer == 's':
                continue
            elif answer !='':
                print("Error, exiting")
                sys.exit(0)
        for j in organized_payloads.keys():
            text = f'\t Checking {j}\n'
            logger(text)
            print(text)
            try:
                for k in organized_payloads[j]:
                    stdinInput(i,j,k,new_baseline)
            except BOF:
                continue
    print(f"\nFinished\nSee {SUCCESSFILE} for buffer overflows and format strings\nSee {LOGFILE} for other info")

        
if __name__ == '__main__':
    a = argparse.ArgumentParser()
    a.add_argument('-p','--path',type=str,help='Directory or file to fuzz [NOTE: Do not use /* just give a directory]',action='store',dest='path',required=True)
    a.add_argument('-e','--ext',type=str,help='File extension to use (.txt,.exe,.elf)',action='store',dest='ext')
    a.add_argument('--pre',help='String input before payload. Useful if you have to nagivate a menu (interprets pythonic \\n, \\t and \\xFF)',type=str,action='store',dest='pre')
    a.add_argument('--post',help='String input after payload. Useful if you have to trigger the exploit (interprets pythonic \\n, \\t and \\xFF)',type=str,action='store',dest='post')
    a.add_argument('-r','--recurse',help='Include to recursively look through directory provided',action='store_true',dest='recurse')
    var = (vars(a.parse_args()))
    
    if os.name=='nt':
        print("Please run on unix machines. This is meant to be used to fuzz ELF files")
        sys.exit(0)
        
    path = os.path.normpath(var['path'].replace('./',os.getcwd()+'/',1))
    recurse=(True if var['recurse'] else False)
    ext=('**' if recurse else '*')
    try:
        ext+=var['ext']
    except:
        pass
    
    if not os.path.exists(path):
        print(f"{path} does not exist")
        raise IsADirectoryError 
   
    if os.path.isfile(path):
        files = [path]
    else:
        files = get_files(path+'\\'+ext,recurse)
        
    if var['pre']:
        pre_input = interp_hex_cmdline(var['pre'])    

    if var['post']:
        post_input = interp_hex_cmdline(var['post'])

    try:
        main()
    except KeyboardInterrupt:
        print("\nGoodbye")