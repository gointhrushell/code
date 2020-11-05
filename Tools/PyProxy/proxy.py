#!/usr/bin/env python2
import logging
import sys
import socket
import threading
from pwn import *

class Sanitize:

    
    '''Starts a janky app proxy. Allows you to setInputBlacklist, setOutputBlacklist, setIPWhitelist
    Anything in the ip whitelist bypasses all I/O checks'''

    def __init__(self,bin_path,listening_port,log_name='sanitize.log'):
        self.bin_path = bin_path
        self.port = listening_port
        self.log_name=log_name
        
        self.input_blacklist=['/bin/sh','/bin/bash','../','%2e%2e',\
                              'a'*200,'or 1=1',"or '1'='1"]
        self.output_blacklist=['flag']
        self.ip_whitelist=[]
        
        
        logging.basicConfig(level=logging.DEBUG,
                            format="[%(asctime)s] %(levelname)s: %(message)s",
                            filename=self.log_name,
                            datefmt="%Y-%m-%d %H:%M:%S")
        self.logger = logging.getLogger(__name__)


    def setInputBlacklist(self,blacklist):
        '''A list of known-bad inputs to filter out'''
        if type(blacklist)==type(self.input_blacklist):
            self.input_blacklist=map(lambda x:x.lower(),blacklist)
        else:
            print("Blacklist must be a list")
            raise TypeError
    
    def setOutputBlacklist(self,blacklist):
        '''This will likely be a list of flag constants (i.e. ICTF{ )
        I need to add regex capabilities for non-standardized flag formats'''
        if type(blacklist)==type(self.output_blacklist):
            self.output_blacklist=map(lambda x:x.lower(),blacklist)
        else:
            print("Blacklist must be a list")
            raise TypeError
        
    def setIPWhitelist(self,whitelist):
        '''Hopefully the service status checker and the exploit throwers are separate IPs.
        If so, you can put the scoring server here and it will be allowed to send/recieve any data'''
        
        if type(whitelist) == type(self.ip_whitelist):
            self.ip_whitelist=whitelist
        else:
            print("Whitelist must be a list")
            raise TypeError
        
    def sanitizeInput(self,client,addr):
        self.new_process = process(self.bin_path,alarm=60,timeout=.5)
        try:
            data = self.new_process.read()
            client.send(data)
        except:
            pass
        
        data = ''
        while True:
            try:
                temp = client.recv(1024)
                if not temp:
                    self.restrictedCall(client,addr, data)
                    client.close()
                    return
                
                data += str(temp)
                
                if any( good in addr for good in self.ip_whitelist):
                    self.unrestrictedCall(client,addr,data)
                    data=''                
                
                if any( bad in data.lower() for bad in self.input_blacklist):
                    self.logger.warning("Potential exploit from %s:%s ! %s", addr[0],addr[1],data.encode('utf-8'))
                    client.close()
                    return

                # The data may come in parts (like when navigating a menu). This proceeds every time a new line is sent
                try:
                    if data[-1]=='\n':
                        self.restrictedCall(client,addr, data)
                        data = ''
                except IndexError:
                    pass
                    
            except socket.error:
                return
            except Exception as e:
                self.logger.info("Uncaught error " + str(e))
                client.close()
                return
        
        
    def restrictedCall(self,client, addr, data):        
        self.new_process.local(5)
        self.new_process.send(data)
        output=self.new_process.read()
        
        if any(bad in output.lower() for bad in self.output_blacklist):
            self.logger.critical("Exploit bypassed input blacklist from %s:%s!\nInput: %s\nResult: %s ", addr[0],addr[1],data.encode('utf-8'),output)
            client.close()
            return
        else:
            #self.logger.info("Valid request: %s", data.encode('utf-8'))
            client.send(str(output))
            return

    def unrestrictedCall(self,client,addr,data):
        #self.logger.info("Whitelisted ip %s called in",addr)
        self.new_process.local(5)
        self.new_process.send(data)
        output=self.new_process.read()
        client.send(str(output))

    def startListen(self):
        s=socket.socket(socket.AF_INET,socket.SOCK_STREAM)
        s.setsockopt(socket.SOL_SOCKET,socket.SO_REUSEADDR,1)
        try:
            s.bind(('0.0.0.0',self.port))
        except socket.error as msg:
            print("Failed to bind")
            sys.exit()
        s.listen(20)
        while True:
            conn, addr = s.accept()
            threading.Thread(target=self.sanitizeInput,args=(conn,addr)).start()
    
    

def main():

    try:
        proxy = Sanitize('/root/Desktop/simpleserv.py',8080)
        proxy.startListen()
    except Exception as e:
        print(e)
        

if __name__ == "__main__":
    main()
