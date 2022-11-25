# Competitive Programming App

An app to help studying for programming competitions.

## Deploying

### Dependencies

[Docker compose](https://docs.docker.com/compose/install/) is needed to run the containers. It can be installed on Ubuntu with

```
sudo apt install docker-compose
```

### Running the server

Clone this repository and go to its folder

```
git clone https://github.com/gustavoM32/competitive-programming-app.git

cd competitive-programming-app
```

Run the containers

```
docker-compose -f docker-compose-deploy.yml up
```

The app can be accessed at `localhost:3000`.