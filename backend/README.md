# Backend Instructions

Follow this instructions step by step for make backend works correct.

Make sure your Python version is 3.7.x 

For check your Python version write this in your terminal 

```bash
 python3 --version
```

### With Virtual Enviroment

We use virtual environmets for install our packages inside it rather than in computer. For more information [virtual environment docs](https://docs.python.org/3/library/venv.html)

1- Open a terminal inside your backend folder

2- Write this code for install .venv

```bash
python3 -m venv venv
```

2- Activate your venv by writing this code in terminal(Check your Windows execution policy for dont interrup activation process)

```bash
venv\Scripts\activate
```

3- Open a terminal inside your backend folder (make sure you are activated venv and installing packages into venv)

4- Write this code into your terminal

```bash
pip install requirements.txt
```
5- Make sure installed the packages into virtual environment open a terminal inside your venv

6- Write this code into terminal

```bash
pip list
```

### Withouth Virtual Environment

1- Open a terminal inside backend folder

2- Write this code for install the packages

```bash
pip install requirements.txt
```

1- Inside your backend folder create a file named as .env 

2- Open your .env file and write this (for local usage write localhost except port)

```bash
DATABASE_URL= mysql://username:password@host:port/database_name 

SECRET_KEY = yoursecretkeyforhashingpasswords
REFRESH_KEY = yourrefreshkeyforhashingpasswords
```

3- Open a terminal inside your backend folder 

4- Write this code for start backend

```bash
 python3 app.py
```