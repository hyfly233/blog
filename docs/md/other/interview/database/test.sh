docker run -d \
    -e POSTGRES_PASSWORD=123456 \
    -p 5432:5432 \
    -v /Users/flyhy/docker/postgresql/data:/var/lib/postgresql/data \
    --name local-postgres postgres:15.1 