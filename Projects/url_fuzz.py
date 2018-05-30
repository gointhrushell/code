import requests
from requests.packages.urllib3.exceptions import InsecureRequestWarning
import json as j4

requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

headers = {'Accept':'*/*','Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8','User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0'}
cook = {"__cfduid":"d46aacff4c7ca378bd2d66d94e2e315d21502588755","_ga":"GA1.2.1788253063.1507518099","lad_sock_remember_me":"anonymoosen%40hotmail.com","lad_sock_user_id":"58133","lad_sock_hash":"efd13a0794a54a05f0152c7f855b5e77","timezone":"America/Chicago","_gid":"GA1.2.2054808851.1525493815","PHPSESSID":"luc4b0av1a1ht8s3u1sbjkmg2v","_gat":"1"}
count = 1
with open("C:\\Users\\wolfpack270\\Desktop\\raft_large_lower.txt") as f:
    while True:
        try:
            i = f.readline().strip('\n')
            if i.strip() != '':
                r = requests.get("https://smashladder.com/developers/"+i,headers=headers,cookies=cook)
                if 'The requested page was not found' not in r.text and r.status_code != 404:
                    print(i)
            count=(count+1)
            if not count%100:
                print(str(count)+'/56k')
        except EOFError:
            break
        except Exception as e:
            print(e)
            
print("Done!")