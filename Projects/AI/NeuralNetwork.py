import math,random
import matplotlib.pyplot as plot
import numpy as np
import threading

MIN=0
MAX=200
NUMINPUTS=500
EPOCHS= NUMINPUTS*10 #2000

class Perceptron:
    def __init__(self):
        self.weights=[]
        for i in range(0,3):
            self.weights.append(random.uniform(-1,1))
        
  
    def guess(self,inputs):
        sum = 0
        if len(inputs)==2:
            inputs.append(1)
            
        for i in range(0,len(self.weights)):
            sum+=inputs[i]*self.weights[i]
        return self.activate(sum)
    
   
    def activate(self,n):
        return (1 if n>=0 else -1)
    
    def train(self,inputs,target,learning_rate=1):
        guess = self.guess(inputs)
        error = target-guess
        for i in range(0,len(self.weights)):
            self.weights[i]+=error*inputs[i]*learning_rate
        return (1 if error==0 else 0)
    
    def guessY(self,x):
        w0 = self.weights[0]
        w1 = self.weights[1]
        w2 = self.weights[2]

        return -(w2/w1)-(w0/w1)*x
    
class Point:
    def __init__(self,func):
        self.values = [random.randint(MIN,MAX),random.randint(MIN,MAX),1]
        self.x = self.values[0]
        self.y = self.values[1]
        self.bias = self.values[2]
        self.label = (-1 if self.y >= func(self.x) else 1)
        
    

    
def plotter(x_array,y_array,func):
    figure = plot.figure()
    x=np.array(x_array)
    y=np.array(y_array)
    color = np.where(y>=func(x),'b',np.where(y<0,'k','r'))
    plot.axis([MIN,MAX+5,MIN,MAX+5])
    plot.scatter(x,y,c=color)
    return plot


def classify(P1):
    while 1:
        
        try:
            x,y=input("Give me a point of form: x,y\n> ").split(',')
            print(P1.guess([int(x),int(y)]))
        except:
            print("Wrong input format")
            return
    
if __name__ == '__main__':
    
    func = lambda x: 3*x+25
    P1 = Perceptron()
    
    inputs,x,y,b=[],[],[],[]
    for i in range(0,NUMINPUTS):
        inputs.append(Point(func))
        x.append(inputs[i].x)
        y.append(inputs[i].y)
        b.append(inputs[i].bias)
    count = 0
    run=1
    while run in range(1,EPOCHS+1):    
        count=0
        for i in range(0,len(inputs)):
            count+=P1.train(inputs[i].values,inputs[i].label,learning_rate=0.1)
        print("The net was %{:.02f} correct after epoch {}".format(count/float(NUMINPUTS)*100,run) )   
        run+=1
        
    myplot = plotter(x,y,func)  
    myplot.plot([MIN,MAX],[func(0),func(MAX)],c='k')
    myplot.plot([MIN,MAX],[P1.guessY(MIN),P1.guessY(MAX)],linewidth=2,c='c')
    
    t1=threading.Thread(target=classify,args=(P1,))
    t1.start()
    myplot.show()
    t1.join()