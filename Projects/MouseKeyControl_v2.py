import ctypes
import time

USER = ctypes.windll.user32
WIDTH = USER.GetSystemMetrics(0)
HEIGHT = USER.GetSystemMetrics(1)

def MoveMouse(x,y):
    '''Move mouse to position x,y NOTE: origin is in the top left corner'''
    USER.SetCursorPos(x, y)

def RightClick(x,y):
    '''Right click mouse at position x,y NOTE: origin is in the top left corner'''
    MoveMouse(x,y)
    USER.mouse_event(8, 0, 0, 0,0)
    USER.mouse_event(10, 0, 0, 0,0)

def LeftClick(x,y):
    '''Left click mouse at position x,y NOTE: origin is in the top left corner'''
    MoveMouse(x,y)
    USER.mouse_event(2, 0, 0, 0,0) # left down
    USER.mouse_event(4, 0, 0, 0,0) # left up

def DragLeftClick(x1,y1,x2,y2):
    '''Drag click mouse from position x1,y1 to x2,y2 NOTE: origin is in the top left corner'''
    MoveMouse(x1,y1)
    USER.mouse_event(2, 0, 0, 0,0) # left down
    time.sleep(.1)
    MoveMouse(x2,y2)
    USER.mouse_event(4, 0, 0, 0,0) # left up
    
def GoToDesktop():
    '''Clicks the bottom right corner as a shortcut to go do the desktop'''
    LeftClick(WIDTH-5,HEIGHT-5)
    

GoToDesktop()
time.sleep(.1)
DragLeftClick(1,1,WIDTH-10,HEIGHT-50)
