# Use an official base image (you should change this to your appropriate language/runtime)
FROM ubuntu:22.04

# Install dependencies (example: Python, Node, C++ compilers, etc.)
RUN apt-get update && apt-get install -y python3 python3-pip gcc nodejs npm

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Expose the port the app runs on (If required)
# EXPOSE 3000

# Example: Install Node.js deps
# RUN npm install

# Example: Install Python deps
# RUN pip install -r requirements.txt

# Default command (you should change this)
CMD ["echo", "Hello from Docker! Customize me in Dockerfile."]
