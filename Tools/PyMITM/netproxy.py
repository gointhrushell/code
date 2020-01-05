import socket
from threading import Thread
import parseme as parser
import sys

class Proxy2Server(Thread):

    def __init__(self,host,port):
        super(Proxy2Server,self).__init__()
        self.game = None
        self.port = port
        self.host = host
        self.server = socket.socket(socket.AF_INET,socket.SOCK_STREAM)
        self.server.connect((host,port))
    
    def run(self):
        while True:
            data = self.server.recv(4096)
            if data:
                try:
                    reload(parser)
                    parser.parse(data,self.port,'server')
                except Exception as e:
                    print('server[{}]'.format(self.port),e)
                self.game.sendall(data)


class Client2Proxy(Thread):

    def __init__(self,host,port):
        super(Client2Proxy,self).__init__()
        self.server = None
        self.port = port
        self.host = host
        sock = socket.socket(socket.AF_INET,socket.SOCK_STREAM)
        sock.setsockopt(socket.SOL_SOCKET,socket.SO_REUSEADDR,1)
        sock.bind((host,port))
        sock.listen(1)
        self.client,addr = sock.accept()
    
    def run(self):
        while True:
            data = self.client.recv(4096)
            if data:
                parser.parse(data,self.port,'client')
                self.server.sendall(data)

class Proxy(Thread):
    def __init__(self,from_host,to_host,port):
        super(Proxy,self).__init__()
        self.from_host = from_host
        self.to_host=to_host
        self.port = port

    def run(self):
        while True:
            print("[proxy({})] setting up".format(self.port))
            self.c2p = Client2Proxy(self.from_host,self.port)
            self.p2s = Proxy2Server(self.to_host,self.port)
            print("[proxy({})] connection established".format(self.port))
            self.c2p.server=self.p2s.server
            self.p2s.game=self.c2p.game

            self.c2p.start()
            self.p2s.start()

master_server = Proxy('0.0.0.0','10.3.1.138',80)
master_server.start()

while True:
    cmd = raw_input("> ")
    if cmd=='q':
        sys.exit(0)
