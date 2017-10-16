import queue

r = queue.Queue(10)
for i in range(10):
    r.put(0)
    
subset = set(r).