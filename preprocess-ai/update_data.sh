cd ../preprocess/backend-node
rm -rf categories.json
cd ../../preprocess-ai
node run.js
node sort.js
cd ../preprocess/backend-node
rm -rf couch
mkdir couch
cd ../../preprocess-ai
node copy.js

echo "Categories added to backend"
echo "Dataset preprocess app updated"