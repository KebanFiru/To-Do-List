# Backend Instructions

Follow this instructions step by step for make backend works correct.

## MySQL Part

1- Open a terminal

2- Write this command to terminal(Make sure [MySQL](https://www.mysql.com/) is installed )

```bash
mysql -u mysqlusername -p
```
3- Enter your password 

4- You are in MySQL shell now write this commnands to add a new database

```bash
CREATE DATABASE nameofdatabase;
```
5- Write this command to show databases 

```bash
SHOW DATABASES;
```

6- Write this command to use the database just created

```bash
USE nameofdatabase;
```

7- Write this command to quit from CLI

```bash
EXIT;
```

## Python Part

Make sure your [Python](https://www.python.org/) version is 3.7.x 

For check your Python version write this in your terminal 

```bash
python3 --version
```

### With Virtual Enviroment

Use virtual environments for install packages inside it rather than system wide. For more information [virtual environment docs](https://docs.python.org/3/library/venv.html)

1- Open a terminal inside your backend folder

2- Write this command for install venv

```bash
python3 -m venv venv
```

2- Activate your virtual environment named venv by writing this command in terminal(Check your Windows execution policy for dont interrup activation process)

```bash
venv\Scripts\activate
```

3- Open a terminal inside your backend folder (make sure you are activated venv)

4- Write this command into your terminal(Make sure pip is installed on system)

```bash
pip install requirements.txt
```
5- To make sure the packages are installed into the virtual environment, open a terminal inside your venv

6- Write this command into terminal

```bash
pip list
```
If there is a list of the packages we installed earlier in the virtual environment, we can continue the process.

### Without Virtual Environment
This will install packages system wide.

1- Open a terminal inside backend folder

2- Write this command for install the packages

```bash
pip install requirements.txt
```

3- Use this command to check if the packages are installed.

```bash
pip list
```
If there is a list of the packages we installed earlier, we can continue the process.

1- Inside your backend folder create a file named as .env 

2- Open your .env file and write this (for local usage write localhost except port)

```bash
DATABASE_URL= mysql://username:password@host:port/database_name 

SECRET_KEY = yoursecretkeyforverificationtoken
REFRESH_KEY = yourrefreshkeyforverificationtoken
```

3- Open a terminal inside your backend folder 

4- Write this command for start backend

```bash
python3 app.py
```