#!/bin/bash

#curl -X GET http://localhost:8080/api/problems/62c1e4de0fc7214cf96b0c20

#curl -X POST http://localhost:8080/api/problems -H "Content-Type: application/json" -d '{ "link" : "jo soy" }'

#curl -X PUT http://localhost:8080/api/problems/62c1e4de0fc7214cf96b0c20 -H "Content-Type: application/json" -d '{ "link" : "https://codeforces.com/contest/1698/problem/G", "dateAdded" : null, "name" : "Long Binary Strdings", "problemStatus" : "NOTHING", "editorialStatus" : "NOTHING", "comments" : "Nem sonhei em fazerrrrr"}' -i

#curl -X PUT http://localhost:8080/api/problems/olarara -H "Content-Type: application/json" -d '{ "name" : "olararer" }'

curl -i -X GET http://localhost:8080/api/problemLists/62f53f6484f04a3f5c233696/problems

# this adds the problem to problemList
curl -i -X POST http://localhost:8080/api/problemLists/62f53f6484f04a3f5c233696/problems -H "Content-Type: text/uri-list" -d 'http://localhost:8080/api/problems/62c5666d4a32ca20b48b8d26'
curl -i -X POST http://localhost:8080/api/problemLists/62f53f6484f04a3f5c233696/problems -H "Content-Type: text/uri-list" -d 'http://localhost:8080/api/problems/630a388e9ae226049278eaac'

curl -i -X DELETE http://localhost:8080/api/problemLists/62f53f6484f04a3f5c233696/problems/630a388e9ae226049278eaac

curl -i -X GET http://localhost:8080/api/problemLists/62f53f6484f04a3f5c233696/problems

