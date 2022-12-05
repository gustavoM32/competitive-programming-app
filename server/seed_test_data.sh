docker cp seed_test_data.js competitive-programming-app_mongo_dev_1:seed_test_data.js
docker exec -it competitive-programming-app_mongo_dev_1 mongosh -f seed_test_data.js
