#https://docs.docker.com/guides/python/
#start with the python version
FROM python:3.12-slim

#dont write .pyc files and don't buffer stdout
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

#setting the working enviroment dir
WORKDIR /app

#install system packages needed by psycopg2
RUN apt-get update && apt-get install -y gcc libpq-dev && rm -rf /var/lib/apt/lists/*

#copies the requirements.txt into the docker image
COPY requirements.txt .

#installs all requirements
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

#copy the rest of the project into docker image
COPY . .

#the app listens on port 8000
EXPOSE 8000

#runs the app through the entrypoint.sh script so that the migrations automatically run before the 
#app
ENTRYPOINT["./entrypoint.sh"]
