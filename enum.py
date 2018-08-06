#!/usr/bin/python

import subprocess as s
import re
from os import getuid,geteuid

WORLD_WRITE = r'^.{8}w.{1}'
WORLD_EXEC = r'^.{9}x'

def locate(prog):
	try:
		command = "find /  -name {} 2>/dev/null".format(prog)
		result = s.check_output(command,shell=True).strip()
		return result
	except s.CalledProcessError as e:
		return e.output.strip()

def get_shadow(users):
	shadow=users
	try:
		with open("/etc/shadow","r") as f:
			results = f.readlines()
		print("#"*5 + "USER LIST" + "#"*5)
		for i in results:
			t = i.split(':')
			if '$' in i:
				shadow[t[0]]=t[1]
		for i in shadow.keys():
			print(i+":"+shadow[i])
		print("")
		return shadow
	except:
		print("/etc/shadow unavailable")
		print("")
		return None

def get_listen():
	netstat = s.check_output("netstat -untap 2>/dev/null",shell=True).strip().split('\n')[3:]
	listeners = []
	for i in netstat:
		t=i.split()
		if t[-2] == 'LISTEN':
			if t[-1] != '-':
				pid,name = t[-1].split('/')
				listeners.append([locate(name),name,pid,t[3]])
			else:
				pid,name='-','-'
				listeners.append(['-',name,pid,t[3]])
	if len(listeners):
		print("#"*5+"Listening Progs"+"#"*5+"\nLocation\tName\tPid\tAddr")
		for i in listeners:
			print(i[0]+'\t'+i[1]+'\t'+i[2]+'\t'+i[3])
		print("")
		return listeners
	else:
		print("No listening ports found")
		return ['None','None','None']

def get_suid():
	suid = s.check_output("find / -perm -4000 2>/dev/null|xargs ls -la",shell=True).strip()
	escalate = []
	dangerous =[]
	info = []
	for i in suid.split('\n')[1:]:
	    t=i.split()
	    try:
		if re.match(WORLD_WRITE,i):
			escalate.append("{0} {1}:{2}\t{3}".format(t[0],t[2],t[3],t[8]))
		elif re.match(WORLD_EXEC,i):
			dangerous.append("{0} {1}:{2}\t{3}".format(t[0],t[2],t[3],t[8]))
		else:
			info.append("{0} {1}:{2}\t{3}".format(t[0],t[2],t[3],t[8]))
	    except:
		print("error in",i)

	if len(info):
		print("\n"+"#"*5 +"INFO" +"#"*5)
                for i in info:
                        print(i)
	if len(dangerous):
		print("\n"+"#"*5 +"WARNING" +"#"*5)
		for i in dangerous:
			print(i)

	if len(escalate):
		print("\n"+"#"*5 +"PRIV ESC" +"#"*5)
		for i in escalate:
			print(i)
	print("\n")

	return info,dangerous,escalate

def get_users():
	users = {}
	with open("/etc/passwd","r") as f:
		result = f.readlines()
	if len(result):
		for i in result:
			if "/false" not in i and "/nologin" not in i:
				users[i[:i.index(':')]] = ""
		return users
	return None

def main():
	if not getuid() or not geteuid():
		get_shadow(get_users())
	else:
		print("#"*5+"USER LIST"+"#"*5)
		users = get_users()
		for i in users.keys():
			print(i)
		print("")
	get_listen()
	get_suid()
	pass

if __name__ == '__main__':
	main()
