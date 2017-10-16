import string
import time
import random
import numpy as np
import queue

class State():
    state = 1
    def __init__(self):
        self.name="State "+str(State.state)
        self.desire = self._is_desireable()
        State.state+=1
    
    def getDesire(self):
        return self.desire
    
    def _is_desireable(self):
        return random.random()<0.5
    
    def __str__(self):
        return self.name
    
class QLearner():

    def __init__(self,epochs=1000,actions=string.printable,max_score=50):
        self.epochs = epochs
        self.gamma_discount =1/self.epochs
        self.sequence = queue.Queue(1000)
        
        self.positive_reward = 1
        self.actions = actions
        self.time_step = 1 
        self.MAX_SCORE = max_score
        self.score=0
    
    def decreaseReward(self):
        self.positive_reward-=self.gamma_discount
        return
    
    def getSequence(self):
        return self.sequence
    
    def getSequenceLen(self):
        return self.sequence.qsize()
    
    def printSequence(self):
        for i in range(self.getSequenceLen()):
            r = self.sequence.get()
            print(r)
            self.sequence.put(r)
            
    def addState(self,state):
        self.sequence.put(state)
    
    def score(self,state,reward):
        if self.final_state:
            return self.score
        if state.is_desireable():
            self.score+=self.positive_reward
        else:
            self.score-=self.positive_reward
            
        self.decreaseReward()
            
r = QLearner()

s1 = State()
r.addState(s1)
r.printSequence()
s1 = State()
r.addState(s1)
r.printSequence()

print(r.getSequence().get().getDesire())