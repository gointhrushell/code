import string, os

def main():
    freq={}
    file = raw_input('Input a file to display line numbers for (include extension): ')
    try: # Attempts to open the file. Error handling if something goes wrong.
        tempfile = open('%s'%file,'r')
    except:
        print("Either the file was not found or it does not exist. Try again.")
        raw_input("Press any key to continue")
        os._exit(0)

    for line in tempfile: # Iterates through each line of the opened file
        for i in range(0,len(line)): # iterates through each character in the length of line
            if line[i] in string.ascii_letters: # ensures we only look at ascii letters, no punctuation
                if line[i] == ' ' or line[i] == '\n': # just a simple step to make sure spaces and new lines aren't included for some weird reason, probably not needed
                    continue
                else:
                    try:
                        freq[line[i].lower()] +=1 # Attempts to build a dictionary, if the entry exists, adds one to it else it creates the entry
                    except:
                        freq[line[i].lower()] = 1

    sum = 0
    for i in freq.keys(): # Calculates the sum of all of the entries so we can get percentatges
        sum+=freq[i]

    for i in ('e','t','a','o','i','n','s','h','r','d','l','c','u','m','w','f','g','y','p','b','v','k','j','x','q','z'): 
        # Dictionaries are unordered so I had to define the order in which I wanted to iterate through the keys
        a = float(freq[i])/float(sum)*100 # float typecasting so we don't lose any accuracy
        print(i+':\t%'+"%.2f" % a)    #Rounded to two decimals for niceness



if __name__ == '__main__':
    main()