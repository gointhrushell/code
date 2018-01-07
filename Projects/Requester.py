import requests
from requests.packages.urllib3.exceptions import InsecureRequestWarning
import json as j4
import argparse
import sys

requests.packages.urllib3.disable_warnings(InsecureRequestWarning)


def makeHTMLPage(url,message,use_json=1):
    ''' Makes a page for CSURF testing, message needs to be in dictionary format
    '''
    if use_json:
        with open('C:\\Users\\Austin\\Desktop\\csrf.html','w') as filename:
            filename.write('<html><body>')
            filename.write('<form action='+url+' method=POST>')
            filename.write('<input type=text value='+str(j4.dumps(message)).replace(' ','')+'>')
            filename.write('<input type=submit value=Test!>')
            filename.write('</form>')
    else:
        with open('C:\\Users\\Austin\\Desktop\\csrf.html','w') as filename:
            filename.write('<html><body>')
            filename.write('<form action='+url+' method=POST>')
            for i in message.keys():
                filename.write('<input type=text value='+str(message[i]) + ' name='+str(i)+'>\n<br>\n')
            filename.write('<input type=submit value=Test!>')
            filename.write('</form>')
        
def makePushPost(url,message,cookies,use_json=1):
    '''Message and cookies need to be in dictionary format when submitted to this function.
    If you want the data sent as a plain message include json=0'''
    
    global PROXY
    p = {} # Parameters
    # Cookies
    c = cookies
    
    if PROXY:
        proxies = {"http": "http://127.0.0.1:8080", "https": "http://127.0.0.1:8080"}
    else:
        proxies = {}
    headers = {'Accept':'*/*','Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8','User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0'}
    
    if use_json:
        message = j4.dumps(message) # Reformat to json dump
    
    r = requests.post(url,headers=headers, params = p,proxies=proxies, cookies = c,data=message,  verify=False)
    response = r.text
    print(response.replace('\\\\','\\').replace('\\n','\n').replace('\\\\',''))
    print(len(response.replace('\\\\','\\').replace('\\n','\n').replace('\\\\','')))

def main():
    global PROXY
    
    url = ""
    message = {}    
    
    parse = argparse.ArgumentParser()
    parse.add_argument('-c','--cookies',type=str,help='cookies to use with the request',required=False)
    parse.add_argument('-d','--data',action='store',type=str,help='data to send in the post',dest='data')
    parse.add_argument('-u','--url',type=str,help='url to send post', required=True,action='store')
    
    parse.add_argument('-j','--json',action='store_true',help='use json in the post request',dest='JSON')
    parse.add_argument('-m','--make-page',action='store_true',help='make a csurf page')
    parse.add_argument('-p','--proxy',action='store_true',help='use the pre-defined proxy',dest='PROXY')
    var = (vars(parse.parse_args()))
    
    cookies = {}
    
    if var['PROXY'] == True:
        PROXY = True
    else:
        PROXY = False
        
    
    if var['data']:
        try:
            data = var['data'].split(',')
            for i in data:
                i = i.split(':')
                for x in range(0,len(i)-1,2):
                    message[i[x]] = i[x+1]
        except:
            print("invalid value for data")
            sys.exit(0)
            
    if var['cookies']:
        try:
            data = var['cookies'].split(',')
            for i in data:
                i = i.split(':')
                for x in range(0,len(i)-1,2):
                    cookies[i[x]] = i[x+1]
        except:
            print("invalid value for data")
            sys.exit(0)
    else:
        cookies = {}
                
                    
    if var['make_page']:
        makeHTMLPage(var['url'],message,var['JSON'])
    else:
        makePushPost(var['url'],message,cookies,var['JSON'])

if __name__=='__main__':  
    main()
