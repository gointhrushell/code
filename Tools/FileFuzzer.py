import subprocess
import time
import threading
import glob


ROOT_DIR = "/root/Desktop/fuzz/"
result=['']

def testFileInput1(proc_name):
    subprocess.call(proc_name+' longstr.txt 1>/dev/null',shell=True)

def testFileInput2(proc_name):
    subprocess.call(proc_name+' -f longstr.txt 1>/dev/null',shell=True)

def findStrings(proc_name):
    command = 'strings ' + proc_name + ' | grep -i -B 1 -A 1 "shell\|\/bin\|flag" >' +  proc_name.replace(ROOT_DIR,'') +'_strings.txt'
    subprocess.call(command,shell=True)

def testHelp(proc_name):
    try: 
        help = subprocess.check_output(proc_name+' -h',shell=True)
        for i in ['shell','cmd','command','bash','exec']:
            if i in help:
                print("CHECK HELP!!!!!!!")
                result[0] = help      
    except Exception as e:
        pass
        
    
def testBuffer(proc_name,characters):
    try: 
        output = subprocess.check_output(proc_name + ' ' + characters*300+' 1>/dev/null',shell=True)
        result[0] = output      
    except Exception as e:
        pass
    
def testBufferSTDIN(proc_name,characters):
    try: 
        output = subprocess.check_output('echo' + ' '+ characters*300+' | '+proc_name+' 1>/dev/null',shell=True)
        result[0] = output
    except Exception as e:
        return

def attemptKill(proc_name):
    try:
        subprocess.call('killall '+ proc_name+' 2>/dev/null', shell=True)
    except:
        return
    
def main():
    file_list = glob.glob(ROOT_DIR+'*')
    print(file_list)
    for filename in file_list:
        print("*"*20)
        print(filename.replace(ROOT_DIR,''))
        print("*"*20+'\n')
        
        print("Finding strings")
        findStrings(filename)
        print("\n")
        
        print("Testing Help")
        t = threading.Thread(target=testHelp,args=[filename])
        t.start()
        t.join(timeout=1)
        attemptKill(filename)
        del t
        
        for chars in ['a','1','\x90','\x00','\n','a1','abcd\x00']:
            print("\n")
            byte = str(bytes(chars))
            print("Testing Buffer with " + byte)
            k = threading.Thread(target=testBuffer,args=[filename,chars])
            k.start()
            k.join(timeout=1)
            
            try:
                attemptKill(filename)
            except:
                pass
            del k
                       
            
            print("\n")
            print("Testing Buffer STDIN with " + byte)
            k = threading.Thread(target=testBufferSTDIN,args=[filename,chars])
            k.start()
            k.join(timeout=1)
            
            try:
                attemptKill(filename)
            except:
                pass
            del k
            
        print("\nTesting File input")
        k = threading.Thread(target=testFileInput1,args=[filename])
        k.start()
        k.join(timeout=1)
        
        try:
            attemptKill(filename)
        except:
            pass
        del k 
        
        k = threading.Thread(target=testFileInput2,args=[filename])
        k.start()
        k.join(timeout=1)
        
        try:
            attemptKill(filename)
        except:
            pass
        del k         
        
            
    
if __name__ == '__main__':
    main()