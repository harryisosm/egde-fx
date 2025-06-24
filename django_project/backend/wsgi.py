import os
import sys

# Add your project directory to the sys.path
path = '/home/yourusername/your-project-directory'
if path not in sys.path:
    sys.path.append(path)

# Set the Django settings module
os.environ['DJANGO_SETTINGS_MODULE'] = 'backend.settings_prod'

# Activate your virtual environment
activate_this = '/home/yourusername/.virtualenvs/your-virtualenv-name/bin/activate_this.py'
with open(activate_this) as file_:
    exec(file_.read(), dict(__file__=activate_this))

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application() 