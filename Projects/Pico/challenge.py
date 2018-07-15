from hacksport.problem import FlaskApp, files_from_directory, File,ProtectedFile
from string import digits

class Problem(FlaskApp):
    python_version = "3"
    files = files_from_directory("static") + [File('run.py'),File('flag'),File('problem.json')] +files_from_directory("app")
    flag = ""
    
    def generate_flag(self, random):
        flag = "THIS_IS_FLAG_4"
        flag += ''.join(self.random.choice(digits + 'abcdef') for _ in range(32))
        self.flag = flag
        return self.flag
    
        