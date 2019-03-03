import proxy

if __name__=='__main__':
    x = proxy.Sanitize('./simpleserv.py',8080)
    x.setInputBlacklist(["PPP","LC/BC"])
    x.setIPWhitelist(['127.0.0.1'])
    x.setOutputBlacklist(['Flag'])
    x.startListen()