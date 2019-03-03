#!/usr/bin/python
from ctypes import *
import generator as gen

tester = CDLL('./mylib.so')
tester.init()
gen.init()



import scipy as np
while True:
    testcase = gen.generate()
    try:
        tester.test(testcase)
#        print(testcase+"\n\n")
        exec(testcase,{"np":np})
        gen.register(testcase)
    except:
        continue
