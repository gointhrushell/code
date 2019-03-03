from hacksport.problem import FlaskApp, files_from_directory, File,ProtectedFile
from hacksport.operations import execute
from string import digits

class Problem(FlaskApp):
        python_version='3'
        files = [File("flag"),File("app/config.py"),File("app/__init__.py"),File("app/helpers.py"),File("app/models.py"),File("app/routes.py"),File("app/templates/base.html"),File("app/templates/base.html"),File("app/templates/admin.html"),File("app/templates/create.html"),File("app/templates/denied.html"),File("app/templates/index.html"),File("app/templates/list.html"),File("app/templates/login.html"),File("app/templates/register.html"),File("app/templates/404.html")]
        flag = ""
        
        def generate_flag(self, random):
                flag = "R_C_E_wont_let_me_be_"
                flag += ''.join(self.random.choice(digits + 'abcdef') for _ in range(32))
                self.flag = flag
                return self.flag

