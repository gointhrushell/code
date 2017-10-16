import socket
import random
import hashlib
import struct
import threading
import datetime
import time
from sys import argv,exit
#import argparse

HOST = ''
SERVER = '192.168.0.103'
PORT = 10030
SECRET = 'HoldBackTheRiver'


def roundTime(time,delta):
    return time+(datetime.datetime.min-time)%delta

def genPass():
    seed = datetime.datetime.now()
    seed = roundTime(seed,datetime.timedelta(minutes=30))
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
    seed = roundTime(seed,datetime.timedelta(minutes=30))
    hashPass = genHash(str(seed)+SECRET)
    
    if hashPass == hashed:
        return True
    else:
        futureSeed = seed + datetime.timedelta(minutes=30)
        hashPass = genHash(str(futureSeed)+SECRET)
    
    if hashPass == hashed:
        return True
    else:
        pastSeed = seed - datetime.timedelta(minutes=30)
        hashPass = genHash(str(pastSeed)+SECRET) 
    return hashPass == hashed

def startServer():
    s = socket.socket(socket.AF_INET,socket.SOCK_STREAM)
    try:
        s.bind((HOST,PORT))
    except socket.error as msg:
        print("Bind Failed: " + str(msg[0]) + ' '+str(msg[1]))
    s.listen(10)
    resp =b'<html><p>Hello World</p></html>'
    while 1:
        conn, addr = s.accept()
        action = conn.recv(1024)
        try:
            if b'ring_Doorbell' in action:
                ring = threading.Thread(target=ringDoorbell)
                ring.start()
                conn.send(b"success")
            else:
                conn.send(b'HTTP/1.1 200 OK')
                conn.send(b'Content-Type: text/html; encoding=utf8')
                conn.send(b'Content-Length: '+bytes(str(len(resp)),'utf8'))
                conn.send(b'\r\n\r\n'+resp)
        except:
            conn.close()
        
def sendRing(server,port):
    key = genPass()
    s = socket.socket()
    s.connect((server,port))
    s.send(b'ring_Doorbell:'+bytes(key,'utf8'))
    s.settimeout(5)
    data = s.recv(1024)
    time.sleep(.5)
    s.close()
    if b'success' in data:
        return 1
    else:
        return 0
    
def startClient():
    success = 0        
    while not success:
        success += sendRing('localhost',10030)
        print(success)    
    
def ringDoorbell():
    print("DING DONG")

if __name__ == '__main__':
    '''
    parser = argparse.ArgumentParser(description='Control Raspberry Pi doorbell')
    parser.add_argument('-c',dest='startClient', help='Starts a controller for Raspberry Pi GPIO events')
    parser.add_argument('-s',dest='threadServer', help='Starts a server to listen for doorbell ring commands')
    
    if not(len(argv) >= 3):
        print("CLIENT MODE:\npython doorbell.py -c -a=[127.0.0.1] -p=[10030]")
        print("")
        print("SERVER MODE:\npython doorbell.py -s -p=[10030]")
        exit(0)
    '''
    if len(argv) !=2:
        print("usage: python doorbell.py [server|client]")
        exit(0)
    elif argv[1].lower() == 'server':
        t = threading.Thread(target=startServer)
        t.start()
    elif argv[1].lower() == 'client':
        t = threading.Thread(target=startClient)
        t.start()
    else:
        print("usage: python doorbell.py [server|client]")
        exit(0)
