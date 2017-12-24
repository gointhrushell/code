import socket
import random
import hashlib
import struct
import threading
import datetime
import time
from sys import argv,exit
from twilio.rest import Client
import RPi.GPIO as GPIO

# Twilio API credentials.
SID='AC0f584a3195547a6db67411165dc39e54' #MY_SID
TOKEN='6ed00f6ea0be63825141e36f84c64f0b' # My Token
#SEND='+12676648171'    # Cora's Number
SEND='+18655481074'     # My number
FROM= '+12679301556'    # Twilio free number

# Hosting configuration - make sure the server is statically assigned to 192.168.0.103 or similar
HOST = ''
SERVER = '192.168.0.103'
PORT = 10030
SECRET = 'HoldBackTheRiver'

MONTHS=['Jan','Feb','Mar','Apr','May','June','July','Aug','Sep','Oct','Nov','Dec']

def sendText(serverDown=0):
    '''Sends a text to the number defined in SEND global through the Twilio api
    '''
    time = datetime.datetime.now()
    client = Client(SID,TOKEN)
    message = client.messages.create(to=SEND,from_=FROM,body=('Your doorbell server might be down, but someone' if serverDown else 'Someone')
                                         + 'rang your doorbell at '+ str(time.hour%12)+':'+str(time.minute)+' '
                                         +('pm ' if time.hour//12 else 'am ')+ 'on ' + str(time.day)+' ' 
                                         + str(MONTHS[time.month-1]))

def roundTime(time,delta):
    return time+(datetime.datetime.min-time)%delta

def genPass():
    '''Generates a password based on current time'''
    seed = datetime.datetime.now()
    seed = roundTime(seed,datetime.timedelta(seconds=30))
    return genHash(str(seed)+SECRET)

def genHash(seed):
    '''Given current time and SECRET as a seed, generates a sha256 hash to use as 
    message verification'''
    try:
        m = hashlib.sha256()
        m.update(bytes(seed,'utf8'))
        return m.hexdigest()
    except:
        return '-1' # Should never get here but just in case
    
def checkPass(hashed):
    '''Verifies a valid message has been sent.
    
    It is important to note that the server and the client might be
    de-synchronized by a few seconds so instead of the 30 second window
    we check current time and current time +/- 30 seconds for a valid
    password
    '''
    seed = datetime.datetime.now()
    seed = roundTime(seed,datetime.timedelta(seconds=30))    
    hashPass = genHash(str(seed)+SECRET)
    
    if hashPass == hashed:
        return True
    else:
        futureSeed = seed + datetime.timedelta(seconds=30) # Check the next time step
        hashPass = genHash(str(futureSeed)+SECRET)
    
    if hashPass == hashed:
        return True
    else:
        pastSeed = seed - datetime.timedelta(seconds=30) # Check previous time step
        hashPass = genHash(str(pastSeed)+SECRET) 
    return hashPass == hashed

def startServer():
    '''Starts a server set up to send output on pin 4 for a chime. After chiming it will
    disable output for 30 seconds'''
    # Disabling is theoretical...in testing I was still able to spam ring by shaking or 
    # touching the pi but that might be due to my poor soldering and/or lack of wire insulation
    # and registering signals that weren't actually there    
    
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(4,GPIO.OUT,pull_up_down=GPIO.PUD_DOWN)  # Our server should be outputting on pin 4 
    try:
        s = socket.socket(socket.AF_INET,socket.SOCK_STREAM)
        try:
            s.bind((HOST,PORT)) # Binding server to HOST on PORT
        except socket.error as msg:
            print("Bind Failed: " + str(msg[0]) + ' '+str(msg[1]))
        s.listen(10)
        resp =b'<html><p>Hello World</p></html>' # Message to send in an html response
        lasttime = datetime.datetime.now()
        while 1:
            conn, addr = s.accept()
            action = conn.recv(1024) # The client should send a request in the format action:hash
            
            try:
                if b'ring_Doorbell' in action:
                    if ((datetime.datetime.now() - lasttime) > datetime.timedelta(seconds=30)):
                        if checkPass(action.decode('utf8').split(':')[1]): # get just the hash to verify
                            ring = threading.Thread(target=ringDoorbell) 
                            ring.start()
                            
                            text = threading.Thread(target=sendText)
                            text.start()
                            
                            ring.join() # Wait for ring to finish (blocking)
                            text.join() # Wait for text to finish (blocking)
                            
                            conn.send(b"success") # Send a success message back to the client
                            lasttime=datetime.datetime.now() # Update the last time (We prevent actions for 30 seconds after ringing)
                        else:
                            conn.send(b'invalid message')
                    else:
                        conn.send(b"Please wait")
                else: # We don't want to give away that we are running a doorbell here so respond like a webserver
                    conn.send(b'HTTP/1.1 200 OK')
                    conn.send(b'Content-Type: text/html; encoding=utf8')
                    conn.send(b'Content-Length: '+bytes(str(len(resp)),'utf8'))
                    conn.send(b'\r\n\r\n'+resp)
            except:
                conn.close()
    except:
        GPIO.cleanup()

def sendRing():
    '''Client sends a ring request to the server. In the case of a failure
    it resends up to 5 times until it gets a success. 
    
    If no success then it will attempt to send a text in lieu of the server with an error message
    '''
    # TODO: Determine if this function knows about the GPIO set up. If it does we can disable
    # the event callback for 30 seconds here as well as on the server
    
    counter=0
    success=0
    
    # Since the internet connection might be slow we try to send the ring multiple times.
    # if it doesn't work the first time
    while counter < 5:
        key = genPass()
        data = ''
        
        try:
            s=socket.socket()
            s=socket.timeout(2)
            s=socket.connect((SERVER,PORT))
            s.settimeout(2)
            s.send(b'ring_Doorbell:'+bytes(key,'utf8'))
            s.settimeout(2)
            try:
                data = s.recv(1024)
                data = data.decode('utf8')
                if 'success' in data.lower():
                    success = 1
                    s.close()
                    counter=6
                    break
                if "please wait" in data.lower():
                    print("Server is waiting to avoid spamming")
                    success=1 # Server isn't down, just waiting
            except:            
                pass
            
        except:
            pass
        counter+=1
            
    if not success and counter>=5:
        sendText(serverDown=1)
                   
    
def startClient():
    '''Starts a doorbell client set up to detect a button input on pin 4'''
    GPIO.setmode(GPIO.BCM) 
    GPIO.setup(4,GPIO.IN,pull_up_down=GPIO.PUD_DOWN) # Reading button input from pin 4
    GPIO.add_event_detect(4,GPIO.RISING) # Detecting only rising edge
    GPIO.add_event_callback(4,sendRing,bouncetime=200) # On rising edge we call sendRing
    try:
        while True:
            time.sleep(1e6)
    except: # should catch keyboard interrupt so you can do GPIO.cleanup if needed but...who knows
        print("goodbye")
        GPIO.cleanup()
      
    
def ringDoorbell():
    # This is going to have to be configured to send a signal to the chime
    # Can I do this? Is this function going to have knowledge of the GPIO setup
    # configured in a different function? Hope so
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