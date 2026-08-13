# 1. Base Image
FROM ubuntu:latest

# 2. Set working directory inside the container
WORKDIR /app

# 3. Execute commands during the build process
RUN apt-get update && apt-get install -y python3

# 4. Copy files from the host to the container
COPY script.py .

# 5. Document the port the container will use
EXPOSE 8080

# 6. Default command to run when the container starts
CMD ["python3", "script.py"]

