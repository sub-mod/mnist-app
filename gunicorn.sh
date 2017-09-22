
#!/bin/bash 
set -e 
cd /workspace
echo "============"
echo $PWD
echo "============"
/usr/bin/gunicorn main:app -b 0.0.0.0:8000 --log-file=-