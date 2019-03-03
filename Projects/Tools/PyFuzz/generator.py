import random
import scipy as np

inputs = [('', repr(t)) for t in ['-1','0',10,2,"B","CC",2**32-1,2**32,2**32+1,\
        2**64-1,2**64,2**64+1,"A"*0x10,"A"*0x100,"A"*0x1000,"",\
        "\x01","\x0a",[],(),{},[[]],'()','[]',"{}",\
        {"test":{"hello":{"1":True}}},"3.14"]]

skip = ['bench','test','testing','power','info','show_config','help','lookfor']
types = []
callers=[]

def register(func):
    global inputs,types,callers
    
    lines = func.split("\n")
    caller = lines[-1]
    definer = "\n".join(lines[:-1])+"\n"

    out =[]
    filterer = "[obj for obj in dir(caller) if callable(getattr(caller,obj))]"
    try:
        exec(definer+"\ncaller="+caller+"\nout.append(caller)\nout.append("+filterer+")\n",{"out":out,"np":np})
    except:
        return
    ret = out[0]
    new_callers=out[1]

    if not ret.__class__ in types:
        types.append(ret.__class__)
        inputs.append((definer,caller))
        callers.append((definer,caller))
        for func in new_callers:
           callers.append((definer,caller+"."+func)) 

    elif not random.randint(0,100):
        inputs.append((definer,caller))
        callers.append((definer,caller))

def init():
    global callers
    global types
    global inputs
    global skip

    callers = [('' ,'np.'+obj) for obj in dir(np) if callable(getattr(np,obj)) and obj not in skip]

    for defer, arg in inputs:
        types.append(eval(arg).__class__)

def generate():
    func_id = random.randint(0,2**32)
    case = "def func_%x():\n " % (func_id)

    defer,caller = random.choice(callers)
    
    case = defer + case
    case += "return " + caller
    
    case += "("
    arglist=[]
    for i in xrange(random.randint(0,5)):
        defer,caller=random.choice(inputs)
        case = defer+case
        arglist.append(caller)
    case += ",".join(arglist)
    case += ")"
    case += "\nfunc_%x()" % func_id
    
    return case
