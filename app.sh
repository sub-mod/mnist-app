
#!/bin/bash 
set -e 
#source scl_source enable rh-nodejs10 rh-python36; Don't use this line here
echo "============"
echo $PWD
echo "============"
gunicorn main:app -b 0.0.0.0:8000 --log-file=-