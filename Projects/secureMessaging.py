#!/usr/bin/python3
import datetime
import hashlib
import socket

class Hasher:
    
    def __init__(self,secret):
        self.secret = secret;
        self.hasher = hashlib.sha256()
        
    def renew(self):
        del self.hasher
        self.hasher=hashlib.sha256()        
        
    def genSeed(self,delta):
        seed = self.roundTime(datetime.datetime.now())+delta
        seed = str(seed) + str(self.secret)
        return seed

    def roundTime(self,time):
        return time+(datetime.datetime.min-time)%datetime.timedelta(seconds=30)
    
    def genHash(self,delta=datetime.timedelta(seconds=0)):
        seed = self.genSeed(delta)
        self.hasher.update(bytes(seed,'utf8'))
        myhash = self.hasher.hexdigest()
        self.renew()
        return myhash
        
    def verify(self,message):
        if self.genHash() == message:
            return True
        if self.genHash(-datetime.timedelta(seconds=30))==message:
            return True
        if self.genHash(datetime.timedelta(seconds=30))==message:
            return True
        return False

class Messenger:
    def __init__(self,conn,secret):
        self.conn = conn
        self.hasher = Hasher(secret)
        
    def close(self):
        self.conn.close()
    
    def setConn(self,conn):
        self.conn=conn 
        
    def setTimeout(self,time):
        self.conn.settimeout(time)
    
    def send(self,message):
        self.setTimeout(3)
        try:
            self.conn.sendall(bytes(message+':'+self.hasher.genHash(),'utf-8'))
        except:
            print("Message failed to send")
            raise
        
    def recieve(self):
        self.setTimeout(3)
        try:
            data = self.conn.recv(1024)
            data = data.decode('utf8')
            return data
        except Exception as e:
            print("No data returned")
            print(e)
            raise
        
    def verify(self,message_hash):
        return self.hasher.verify(message_hash)
    
    
class Client(Messenger):
    def __init__(self,server_IP,server_PORT,secret):
        
        self.conn = socket.socket()
        try:
            self.conn.connect((server_IP,server_PORT))
        except:
            print("Unable to make a connection to the server")
            raise   
        Messenger.__init__(self,self.conn,secret)
    
    def reconnect(self):
        try:
            self.conn.connect((server_IP,server_PORT))
            super().setConn(conn)
        except:
            raise
        
if __name__=="__main__":
    print("This is only a library file")
    