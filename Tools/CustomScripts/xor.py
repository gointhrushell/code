#!/usr/bin/python

import binascii

def xor(text,secret):
	enc = ''
	for i in range(len(text)):
		enc+=chr(ord(text[i])^ord(secret[i%len(secret)]))
	return enc
