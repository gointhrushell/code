import win32api,win32gui,win32com,win32con
import time

WIDTH = win32api.GetSystemMetrics(0)
HEIGHT = win32api.GetSystemMetrics(1)

def MoveMouse(x,y):
    win32api.SetCursorPos((int(x),int(y)))
    
def LeftClick(x,y):
    ''' Left click with an intuitive x,y coordinate system'''
    x=int(x)
    y=int(y)    
    y = HEIGHT - y
    MoveMouse(x,y) # can be commented out if you do not want the mouse to move
    win32api.mouse_event(win32con.MOUSEEVENTF_LEFTDOWN,x,y,0,0)
    win32api.mouse_event(win32con.MOUSEEVENTF_LEFTUP,x,y,0,0)

def RightClick(x,y):
    ''' Right click with an intuitive x,y coordinate system'''
    x=int(x)
    y=int(y)
    y = HEIGHT - y
    MoveMouse(x,y) # can be commented out if you do not want the mouse to move
    win32api.mouse_event(win32con.MOUSEEVENTF_RIGHTDOWN,x,y,0,0)
    win32api.mouse_event(win32con.MOUSEEVENTF_RIGHTUP,x,y,0,0)

def LeftClickDrag(x1,y1,x2,y2):
    x1=int(x1)
    y1=int(y1)
    x2=int(x2)
    y2=int(y2)
    
    y1 = HEIGHT - y1
    y2 = HEIGHT - y2
    
    MoveMouse(x1,y1)
    win32api.mouse_event(win32con.MOUSEEVENTF_LEFTDOWN,x1,y1,0,0)

    MoveMouse(x2,y2)
    win32api.mouse_event(win32con.MOUSEEVENTF_LEFTUP,x2,y2,0,0)

def GoToDesktop():
    LeftClick(WIDTH-10,10)
    
def ScrollDown():
    win32api.mouse_event(win32con.MOUSE
    
GoToDesktop()
LeftClickDrag(5,HEIGHT,WIDTH-10,50)
