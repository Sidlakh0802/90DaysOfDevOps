import os
from flask import Flask
import redis
import psycopg2

app = Flask(__name__)
cache = redis.Redis(host='redis', port=6379)

@app.route('/')
def hello():
    try:
        cache.ping()
        cache_status = "Connected to Redis! 🟢"
    except Exception as e:
        cache_status = f"Redis Error: {e} 🔴"
        
    return f"<h1>Hello from Flask!</h1><p>{cache_status}</p>"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

