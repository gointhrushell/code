import requests,time

cookies = {"__cfduid":"d46aacff4c7ca378bd2d66d94e2e315d21502588755","timezone":"America/Chicago","_ga":"GA1.2.202360974.1502588755","_gid":"GA1.2.1271686551.1505857569","lad_sock_user_id":"58133","lad_sock_hash":"4ab9f8ecb205300f0978221a208d1c63","lad_sock_remember_me":"anonymoosen%40hotmail.com","_gat":"1"}
headers = {'Accept':'*/*','Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8','User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0'}
url = 'https://www.smashladder.com/sw.js'
sleeptime = 1.5
sleepdelta=0.5
limited=0
for i in range(0,1):
    message = { 'action': 'show_notification' } #,'message':str(i) + ' hello there{:c}'.format(i),'match_id':'','send_id':'2'}
    
    while True:
        r = requests.post(url,cookies=cookies,headers=headers,data=message)
        if 'rate_limit' in r.text:
            sleeptime+=sleepdelta
            print("sleep time increased to {}".format(sleeptime))
            time.sleep(sleeptime)
        else:
            break
    time.sleep(sleeptime)
    print('sent',i)
    print(r.text)    
    