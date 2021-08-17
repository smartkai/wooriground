# -----------------------------------------------
# 안녕하세요 김대영 입니다.
# 아래와같이 사용할 수 있는 기능들을 정의 합니다.
# -----------------------------------------------
# [1] git 서버 (참고용 git - https://github.com/codeorchord/MULTICAMPUS-hackathon)
https://github.com/smartkai/wooriground.git
# [2] 서버 기동명령어
python3 /workspace/wooria/git/src/web/manage.py migrate && python3 /workspace/wooria/git/src/web/manage.py runserver 0.0.0.0:80
# [3] 접속가능 URL
https://wooria.run.goorm.io

# -----------------------------------------------
# 사전 설치된 pip
# -----------------------------------------------
git clone https://github.com/smartkai/wooriground.git
pip install python-decouple
/usr/local/bin/python3.7 -m pip install --upgrade pip
pip install django_heroku
pip install django_extensions
pip install django-imagekit
pip install django-allauth
pip install simplejson
pip install opencv-python

# -----------------------------------------------
# db조회
# -----------------------------------------------
#https://m.blog.naver.com/rkdudwl/221673882510
#https://ubunlog.com/ko/sqlite-3-y-sqlitebrowser-como-instalarlos-en-ubuntu/

sudo apt-get install sqlite3
.open db.sqlite3
.tables
.headers on
SELECT * FROM sistemas;  

#CREATE TABLE sistemas(Nombre String,version Real);
#insert into sistemas(Nombre, version) VALUES ('Ubuntu',16.04), ('Ubuntu',18.04),('Ubuntu',20.04);
#sudo apt install sqlitebrowser
#sqlitebrowser

# -----------------------------------------------
# git 배포 - 참고용
# -----------------------------------------------
git init
git add README.md
sudo git config --global user.name "smartkai"
sudo git config --global user.email "smartkai@naver.com"

git commit -m "first commit"
git branch -M mains
git remote add origin https://github.com/smartkai/wooriground.git
git push -u origin main

# git checkout -b 'master'
# git push origin master
# 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


