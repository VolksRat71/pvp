# Use an official Ubuntu as a parent image
FROM ubuntu:latest

# Set the maintainer label
LABEL maintainer="your-email@example.com"

# Set the working directory inside the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install Python and pip
RUN apt-get update && \
    apt-get install -y python3-pip && \
    pip3 install --upgrade pip

# Install any needed packages specified in requirements.txt (if you have one)
# Uncomment the following line if you have a requirements.txt
# COPY requirements.txt /app/
# RUN pip3 install --no-cache-dir -r requirements.txt

# Install PyBluez
RUN pip3 install pybluez

# Make port 80 available to the world outside this container (if needed)
# EXPOSE 80

# Define environment variable (if needed)
# ENV NAME World

# Run main.py when the container launches
CMD ["python3", "main.py"]
