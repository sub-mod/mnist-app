
#!/bin/bash 
set -e 
cd /app
echo "============"
echo $PWD
echo "============"
/usr/bin/gunicorn main:app -b 0.0.0.0:8000 --log-file=-