FROM ollama/ollama

# Copy the necessary files
COPY ./Modelfile /Modelfile
COPY ./entrypoint.sh /entrypoint.sh

# Make the startup script executable
RUN chmod +x /entrypoint.sh

# Set the entrypoint to our custom script
ENTRYPOINT [ "/entrypoint.sh" ]
