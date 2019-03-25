# img-srvc

Image service is a simple web service in which a client can upload images and
then apply manipulations to them on retrieval.

At the moment, it only supports resizing but since it uses
[GraphicsMagick](http://www.graphicsmagick.org/) it can easily be extended to
do other operations.

## Commands

### Build
This is based on docker (see [Dockerfile](./Dockerfile)).  To build locally, simply run:

`docker build -t img-srvc .`

### DB Setup
The image metadata is stored in a postgres database.  To setup the database, run the migrations using a built container:

`docker run -p 8080:8080 -e ENVIRONMENT=development img-srvc '/usr/src/app/migrate_db.sh'`

This app uses [knex.js](https://knexjs.org/).  Knex configuration and migrations are in the [/db](./db) folder.

### Run the service (locally)
Running the container will start the service.  The service stores images in S3 so you will need to include credentials:

`docker run -e AWS_ACCESS_KEY_ID=<key> -e AWS_SECRET_ACCESS_KEY=<secret> -p 8080:8080 img-srvc`

### Run the service (AWS)

Publish the container to ECR:

`docker push 940541145267.dkr.ecr.us-east-2.amazonaws.com/img-srvc:v1`

Then create/update a stack using [stack.yaml](./stack.yaml).