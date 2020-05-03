#!/bin/bash
app="beebulb"
docker build -t ${app} .
docker run -it -p 8080:80 \
  --rm \
  --name=${app} \
  -v $PWD:/app ${app}
