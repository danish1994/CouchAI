cd ~/Desktop/Couch/ai/preprocess-ai/
rm -rf preprocess.tar.gz
cd ..
tar -zcvf ~/Desktop/Couch/ai/preprocess-ai/preprocess.tar.gz preprocess

cd preprocess-ai
scp -i couch-mumbai.pem preprocess.tar.gz ubuntu@ec2-35-154-54-115.ap-south-1.compute.amazonaws.com:~