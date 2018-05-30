import requests,os
import getpass
import json as js
from requests.packages.urllib3.exceptions import InsecureRequestWarning
requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

BASE_URL = 'https://discordapp.com/api/v6/'
HEADERS = {'Accept-encoding':'gzip, deflate, br','Accept':'*/*','Content-Type': 'application/json','User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36','x-super-properties':'eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiQ2hyb21lIiwiZGV2aWNlIjoiIiwicmVmZXJyZXIiOiIiLCJyZWZlcnJpbmdfZG9tYWluIjoiIiwicmVmZXJyZXJfY3VycmVudCI6IiIsInJlZmVycmluZ19kb21haW5fY3VycmVudCI6IiIsInJlbGVhc2VfY2hhbm5lbCI6InN0YWJsZSIsImNsaWVudF9idWlsZF9udW1iZXIiOjE0MDI3fQ'}
USERFILE = os.path.expandvars('%TEMP%\discord.gg')
#PROXIES=proxies = {
  #'http': '127.0.0.1:8080',
  #'https': '127.0.0.1:8080',
#}
PROXIES=None

def getUser():
    
    if os.path.exists(USERFILE):
        with open(USERFILE,'r') as f:
            user = f.readline().strip()
            
    else:
        user = input("What is your email?\n> ")
        with open(USERFILE,'w') as f:
            f.writelines(user)
    return user

def getUsername():
    if os.path.exists(USERFILE+'.name'):
        with open(USERFILE+'.name','r') as f:
            user = f.readline().strip()
            
    else:
        user = input("What is your username?\n> ")
        with open(USERFILE+'.name','w') as f:
            f.writelines(user)
    return user    

def deleteMess(browser,ids):
    req = requests.Request('DELETE', 'https://discordapp.com/api/v6/channels/229076842953441281/messages/'+ids)
    print("REQ: ",req.prepare())
    
    
if __name__ == '__main__':
    print("If you would ever like to change your email open this file in a text editor")
    print(os.path.expandvars(USERFILE))
    print('')
    
    
    user = getUser()
    passwd = getpass.getpass('Password: ')
    
    browser = requests.Session()
    browser.headers.update(HEADERS)
    browser.headers.update({'origin':'https://discordapp.com','x-fingerprint':'438421368078467081.H37psIKrKz4Fm8DSGK3w73DadGw'})
    
    r = browser.get('https://discordapp.com',proxies=PROXIES,verify=False)
    datas = {'email':user,'password':passwd,'undelete':'false','captcha_key':None}
    r=browser.post(BASE_URL+'auth/login',json=datas,proxies=PROXIES,verify=False)
    token = r.json()['token']
    #print("Token",token)
    browser.headers.update({'authorization':token})
    
    
    r = browser.get('https://discordapp.com/api/v6/channels/229076842953441281/messages?limit=50')
    messages = r.json()
    for i in messages:
        if i['author']['username'] == getUsername():
            try:
                req = requests.Request('DELETE', 'https://discordapp.com/api/v6/channels/229076842953441281/messages/'+i['id'])
                prepped = browser.prepare_request(req)
                r=browser.send(prepped)
                check = r.json()
                if check['retry_after']:
                    time.sleep(check['retry_after'])
                    print("Sleeping for", check['retry_after'])
            except Exception as e:
                print(e)
                pass