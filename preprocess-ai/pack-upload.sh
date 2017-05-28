cd ~/Desktop/Couch/ai/preprocess-ai/
rm -rf preprocess.tar.gz
cd ..
tar -zcvf ~/Desktop/Couch/ai/preprocess-ai/preprocess.tar.gz preprocess

cd preprocess-ai
scp -i couch-mumbai.pem preprocess.tar.gz ubuntu@ec2-13-126-35-86.ap-south-1.compute.amazonaws.com:~