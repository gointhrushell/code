import datetime
import sys
from twilio.rest import Client
import subprocess
import os,time

to_message=[]

WAIT_TIME = 5 # Time in minutes between checks
AUTH_WORDS = ['cdimmig','wolfpack270']
MINUTES_STAY_ALIVE=60

SID='AC0f584a3195547a6db67411165dc39e54'
TOKEN='6ed00f6ea0be63825141e36f84c64f0b'
client = Client(SID,TOKEN)

def startVM():
    subprocess.Popen(['C:\\Users\\wolfpack270\\Documents\\Virtual Machines\\Ubuntu-Guac\\Ubuntu-Guac.vmx'],shell=True)

def killVM():
    os.system('taskkill /f /im vmplayer.exe')

def checkMessages(client):
    count = 0
    while count < 5:
        try:
            now = datetime.datetime.now(datetime.timezone.utc)
            checktime = now - datetime.timedelta(minutes=WAIT_TIME)
            messages = client.messages.list(date_sent_after=checktime)
            for i in messages:
                if 'inbound' in i.direction:
                    if AUTH_WORDS[0] in i.body.lower() or AUTH_WORDS[1] in i.body.lower():
                        to_message.append(i.from_)
                        return 1
            return 0
        except:
            count+=1
    return 0


def sendAlert(client):
    for i in to_message:
        client.messages.create(to=i,from_='+12037936216',body='If you are still working with Guacamole, please re-authorize')

def sendConfirm(client):
    for i in to_message:
        client.messages.create(to=i,from_='+12037936216',body='Starting Guacamole')

def sendKill(client):
    for i in to_message:
        client.messages.create(to=i,from_='+12037936216',body='The server has shut down')

def sendRenew(client):
    for i in to_message:
        client.messages.create(to=i,from_='+12037936216',body='The time limit on the server has been renewed')
        
while True:
    
    if checkMessages(client):
        sendConfirm(client)
        startVM()
        count=0
        while count<MINUTES_STAY_ALIVE/WAIT_TIME:
            
            time.sleep(WAIT_TIME*60)

            if checkMessages(client):
                sendRenew(client)
                count=0
            else:
                count+=1
                
            if count>=MINUTES_STAY_ALIVE/WAIT_TIME-2 and count!=MINUTES_STAY_ALIVE/WAIT_TIME:
                sendAlert(client)
                        
        sendKill(client)
        killVM()
        to_message=[]
    time.sleep(WAIT_TIME*60)
         