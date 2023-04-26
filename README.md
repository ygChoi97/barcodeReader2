
# ZXING 라이브러리 설치
npm i @zxing/library --save

# 초콜릿 설치
https://evandde.github.io/chocolatey/

# 인증서 만들기
choco install mkcert (CMD 관리자 권한)

# 인증서 생성
프로젝트폴더/mkcert localhost

# https 적용
package.json 편집

"start": "set HTTPS=true&&set SSL_CRT_FILE=localhost.pem&&set SSL_KEY_FILE=localhost-key.pem&&react-scripts start"


