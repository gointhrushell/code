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
    datas = {'email':user,'password':passwd,'undelete':'false','captcha_key':None}#'03AJpayVHbxhFoQpjH0uD4u729i7FmqDBfQTkU-JTIfJETC7QMeIZQlPA6G2HCt-EY1QovZBLSyC9Z_aVHDUxPXfSOuelBRRH5KmZoRy4-7NOlKiR2_H1kMb9ye0q73IDecJgvXRghA6vGnGUqFcnt-XY979Fk1Df9YRGcOqBQrdFQ5LVqETQZWYutY9CkZoXVYzeyS1cy1fiHokZV5m-aqS_1tBsK3SSXvlpnMAiQb8lvjddKwVoKNWnB50lQJSgf5k6r35SGGwct5owGLt_Y_AWuBEhWjbxLrX_33wuPWnRByKA1VWeGK7V9SXIjOX9Qlh1S50jZ_6MJr0E7Fh-CqPH-a0pLjDHDOg'}
    r=browser.post(BASE_URL+'auth/login',json=datas,proxies=PROXIES,verify=False)
    token = r.json()['token']
    print("Token",token)
    browser.headers.update({'authorization':token})
    #browser.get(