import glob
import sys
import hashlib
import pickle


def usage():
    print("usage: " + sys.argv[0] + "folder_path [-r]")

def md5sum(filename,blocksize=65536):
    hashs = hashlib.md5()
    with open(filename,'rb') as f:
        for block in iter(lambda: f.read(blocksize),b""):
            hashs.update(block)
    return hashs.hexdigest()

def save(dictionary):
    with open("C:\\Users\\Austin\\Desktop\\FileMonDict",'wb') as f:
        pickle.dump(dictionary,f)
    
def load():
    with open("C:\\Users\\Austin\\Desktop\\FileMonDict",'rb') as f:
        dictionary = pickle.load(f)
    return dictionary
    
def main():
    
    if len(sys.argv) < 2:
        usage()
        sys.exit(0)
        
    if len(sys.argv) > 3:
        filelist = glob.glob(sys.argv[1]+'\\*',recursive=True)
    else:
        filelist = glob.glob(sys.argv[1]+'\\*',recursive=False)
    fileMon = {}
    
    for i in filelist:
        try:
            fileMon[i] = md5sum(i)
        except:
            continue
        
    try:
        prevDict = load()
        diffs = set(fileMon)-set(prevDict)
        diffs2 = set(prevDict) - set(fileMon)
        differences = 0
        
        for i in diffs:
            differences=1
            print(i.replace(sys.argv[1]+'\\','')  + " is new")
        for i in diffs2:
            differences=1
            print(i.replace(sys.argv[1]+'\\','')  + " was deleted")
        for i in filelist:
            if prevDict[i] != fileMon[i]:
                differences = 1
                print("File " + i.replace(sys.argv[1]+'\\','') + " is different")
        if not differences:
            print("No differences noticed")
        
    except Exception as e:
        print(e)
        
    save(fileMon)

    
if __name__=="__main__":
    main()