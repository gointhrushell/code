import socket
import random
import hashlib
import struct
import threading
import datetime
import time
from sys import argv,exit
from twilio.rest import Client
#import RPi.GPIO as GPIO

SID='AC0f584a3195547a6db67411165dc39e54' #MY_SID
TOKEN='6ed00f6ea0be63825141e36f84c64f0b' # My Token
HOST = ''
SERVER = '192.168.0.103'
PORT = 10030
SECRET = 'HoldBackTheRiver'
#SEND='+12676648171'    # Cora's Number
SEND='+18655481074'     # My number
FROM= '+12679301556'
MONTHS=['Jan','Feb','Mar','Apr','May','June','July','Aug','Sep','Oct','Nov','Dec']

def sendText():
    time = datetime.datetime.now()
    client = Client(SID,TOKEN)
    message = client.messages.create(to=SEND,from_=FROM,body='Someone rang your doorbell at ' + str(time.hour%12)+':'+str(time.minute)+
                                     ' '+('pm ' if time.hour//12 else 'am ')+ 'on ' + str(time.day)+' ' + str(MONTHS[time.month-1]))
    

def roundTime(time,delta):
    return time+(datetime.datetime.min-time)%delta

def genPass():
    seed = datetime.datetime.now()
    seed = roundTime(seed,datetime.timedelta(seconds=30))
    return genHash(str(seed)+SECRET)

def genHash(seed):
    try:
        m = hashlib.sha256()
        m.update(bytes(seed,'utf8'))
        return m.hexdigest()
    except:
        return '-1'
    
def checkPass(hashed):
    seed = datetime.datetime.now()
    seed = roundTime(seed,datetime.timedelta(seconds=30))
    hashPass = genHash(str(seed)+SECRET)
    
    if hashPass == hashed:
        return True
    else:
        futureSeed = seed + datetime.timedelta(seconds=30)
        hashPass = genHash(str(futureSeed)+SECRET)
    
    if hashPass == hashed:
        return True
    else:
        pastSeed = seed - datetime.timedelta(seconds=30)
        hashPass = genHash(str(pastSeed)+SECRET) 
    return hashPass == hashed

def startServer():
    #GPIO.setmode(GPIO.BCM)
    #GPIO.setup(4,GPIO.OUT,pull_up_down=GPIO.PUD_DOWN)    
    print("Starting Server")
    s = socket.socket(socket.AF_INET,socket.SOCK_STREAM)
    try:
        s.bind((HOST,PORT))
    except socket.error as msg:
        print("Bind Failed: " + str(msg[0]) + ' '+str(msg[1]))
    s.listen(10)
    resp =b'<html><p>Hello World</p></html>'
    lasttime = datetime.datetime.now()
    while 1:
        conn, addr = s.accept()
        action = conn.recv(1024)
        
        try:
            if b'ring_Doorbell' in action and (datetime.datetime.now() - lasttime> datetime.timedelta(seconds=30)):
                
                if checkPass(action.decode('utf8').split(':')[1]):
                    ring = threading.Thread(target=ringDoorbell)
                    ring.start()
                    
                    text = threading.Thread(target=sendText)
                    text.start()
                    
                    ring.join()
                    text.join()
                    
                    conn.send(b"success")
                    lasttime=datetime.datetime.now()
                else:
                    conn.send(b'invalid message')
            else:
                conn.send(b'HTTP/1.1 200 OK')
                conn.send(b'Content-Type: text/html; encoding=utf8')
                conn.send(b'Content-Length: '+bytes(str(len(resp)),'utf8'))
                conn.send(b'\r\n\r\n'+resp)
        except:
            conn.close()
        
def sendRing():
    counter=0
    success=0
    while counter < 5:
        key = genPass()
        data = ''
        try:
            s=socket.socket()
            s=socket.timeout(10)
            s=socket.connect((SERVER,PORT))
        except:
            message = 'Unable to establish connection to Doorbell server.'
            break
        counter+=1
        s.send(b'ring_Doorbell:'+bytes(key,'utf8'))
        s.settimeout(3.1)
        
        try:
            data = s.recv(1024)
        except:
            message = 'Did not recieve data from Doorbell server.'
            break
    
        data = data.decode('utf8')
        if 'success' in data.lower():
            success = 1
            s.close()
            break
    if not success:
        client = Client(SID,TOKEN)
        message = client.messages.create(to=SEND,from_=FROM,body=message + ' Make sure the server is running correctly.')
        
    
    
def startClient():
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(4,GPIO.IN,pull_up_down=GPIO.PUD_DOWN)
    GPIO.add_event_detect(4,GPIO.RISING)
    GPIO.add_event_callback(4,sendRing)
    try:
        while True:
            time.sleep(1e6)
    except:
        print("goodbye")
        GPIO.cleanup()
      
    
def ringDoorbell():
    print("DING DONG")

if __name__ == '__main__':
    
    if len(argv) !=2:
        print("usage: python doorbell.py [server|client]")
        exit(0)
    elif argv[1].lower() == 'server':
        startServer()
    elif argv[1].lower() == 'client':
        startClient()
    else:
        print("usage: python doorbell.py [server|client]")
        exit(0)