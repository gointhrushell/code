import os
import mechanize, urllib


def send_message(user_name,message):
        ''' Currently this will only send a message if the person is on your recent friends list and online.
        Expanded functionality will include support for generating a list/database of all friends + uids so
        that any friend can be messaged at any time'''
        linkfollowed = 0
        response = browser.open("https://m.facebook.com/buddylist.php")
        for link in browser.links():
                if user_name in link.text:
                        browser.follow_link(link)
                        linkfollowed = 1
        if linkfollowed == 1:
                answer= raw_input("Do you want to endlessly spam? [y/n]\n")
                if answer.lower() == 'y':
                        for i in range(0,10):
                                browser.select_form(nr=1)
                                browser.form['body'] = message
                                browser.submit()
                else:
                        browser.select_form(nr=1)
                        browser.form['body'] = message
                        browser.submit()              
        else:
                print("Username not found\n")

                

def pokes():
        answer = raw_input("Do you want to loop endlessly? [Y/N]\n")
        browser.open("https://m.facebook.com/pokes/?_rdr")
        pokelist= []
        i=0
        if answer.lower() == "y":
                while True:
                        pokelist= []
                        i=0
                        for link in browser.links(text_regex='\[IMG\]Poke Back'):
                                pokelist.append(link)
                                i+=1
                        for x in range(0,i):
                                browser.follow_link(pokelist[x])
                        browser.open("https://m.facebook.com/pokes/?_rdr")

        elif answer.lower() == "n":
                for link in browser.links(text_regex='\[IMG\]Poke Back'):
                                pokelist.append(link)
                                i+=1
                for x in range(0,i):
                        browser.follow_link(pokelist[x])
        else:
                return

browser = mechanize.Browser()
browser.set_handle_robots(False)
cookies = mechanize.CookieJar()

browser.addheaders = [('User-agent', 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:38.0) Gecko/20100101 Firefox/38.0')]
response = browser.open("http://m.facebook.com/login")

browser.select_form(nr=0)

browser.form['email'] = 'austinmcwhirter@yahoo.com'
browser.form['pass'] = 'Z1^%9O0dvFpk'
response = browser.submit()

menu = ' '
while menu != 'e':
        menu = raw_input("Would you like to send a message [m], poke your friends [p], or exit [e]?\n")
        if menu == 'm':
                user = raw_input("Who do you want to send a message to?\n")
                message = raw_input("What message do you want to send?\n")
                send_message(user,message)
        elif menu == 'p':
                pokes()
        elif menu == 'e':
                os._exit(0)




