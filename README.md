# img-srvc

Build container: `docker build -t trahan/img-srvc .`

Migrate Database: `docker run -p 8080:8080 trahan/img-srvc '/usr/src/app/migrate_db.sh'`

Run Service: `docker run -e AWS_ACCESS_KEY_ID=<key> -e AWS_SECRET_ACCESS_KEY=<secret> -p 8080:8080 trahan/img-srvc`
