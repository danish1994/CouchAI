goto preprocess-ai
run update_data.sh using 
./update_data.sh

login using 
./login.sh

clean 
./clean.sh

logout

./pack-upload.sh

two terminals

    login using
    ./login.sh

    unpack using
    ./unpack.sh

    ./run-be.sh
    ./run-fe.sh