import ctypes
import time

USER = ctypes.windll.user32
WIDTH = USER.GetSystemMetrics(0)
HEIGHT = USER.GetSystemMetrics(1)

def MoveMouse(x,y):
    USER.SetCursorPos(x, y)

def RightClick(x,y):
    MoveMouse(x,y)
    USER.mouse_event(8, 0, 0, 0,0)
    USER.mouse_event(10, 0, 0, 0,0)

def LeftClick(x,y):
    MoveMouse(x,y)
    USER.mouse_event(2, 0, 0, 0,0) # left down
    USER.mouse_event(4, 0, 0, 0,0) # left up

def DragLeftClick(x1,y1,x2,y2):
    MoveMouse(x1,y1)
    USER.mouse_event(2, 0, 0, 0,0) # left down
    time.sleep(.1)
    MoveMouse(x2,y2)
    USER.mouse_event(4, 0, 0, 0,0) # left up
    
def GoToDesktop():
    LeftClick(WIDTH-5,HEIGHT-5)
    
GoToDesktop()
time.sleep(.1)
DragLeftClick(1,1,WIDTH-10,HEIGHT-50)