#FROM tiangolo/uwsgi-nginx-flask:python3.7-alpine3.7
#RUN apk --update add bash nano

#COPY ./requirements.txt /tmp/requirements.txt
#RUN pip3 install -r /tmp/requirements.txt
#RUN python3 main.py

FROM ubuntu:latest

RUN apt-get update -y && \
    apt-get install -y python3-pip python3-dev

# We copy just the requirements.txt first to leverage Docker cache
COPY ./requirements.txt /app/requirements.txt

WORKDIR /app

RUN pip3 install -r requirements.txt

COPY . /app

ENTRYPOINT [ "python3" ]

CMD [ "main.py" ]