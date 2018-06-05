from hacksport.problem import FlaskApp, files_from_directory, File,ProtectedFile
from string import digits

class Problem(FlaskApp):
    python_version = "3"
    files = files_from_directory("static") + [File('server.py'), File('index.html'),File('helpers.py'),ProtectedFile("users.db"),ProtectedFile("cards.db")] +files_from_directory("templates")
    flag = ""
    
    def generate_flag(self, random):
        flag = "client_side_is_the_dark_side"
        flag += ''.join(self.random.choice(digits + 'abcdef') for _ in range(32))
        self.flag = flag
        return self.flag
    
    def users(self):
        conn = sqlite3.connect('users.db')
        c = conn.cursor()
        c.execute(
                'CREATE TABLE users (name text, password text, admin integer);')
    
        c.execute(
                '''INSERT INTO users VALUES ('admin', 'pbkdf2:sha1:1000$bTY1abU0$5503ae46ff1a45b14ff19d5a2ae08acf1d2aacde', 1)'''
            )
    
        conn.commit()
        conn.close()
        
    def cards(self):
        conn = sqlite3.connect('cards.db')
        c = conn.cursor()
        c.execute(
                'CREATE TABLE users (title text, question text, answer text,user_id int);')
    
        c.execute(
                '''INSERT INTO users VALUES ('Example', 'This is an example question', 'Here\'s an answer', 1)'''
            )
    
        conn.commit()
        conn.close() 
        
    def setup(self):
        self.users()
        self.cards()