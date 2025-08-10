#!/bin/sh
set -e

# Start Ollama in the background
/bin/ollama serve &
pid=$!

# Wait for the server to be ready
while ! /bin/ollama ps > /dev/null 2>&1; do
    sleep 1
done

# Check if the model exists and create it if it doesn't
if ! /bin/ollama list | grep -q "gemma:2b"; then
    echo "Model 'gemma:2b' not found. Creating it from Modelfile..."
    /bin/ollama create gemma:2b -f /Modelfile
    echo "Model 'gemma:2b' created."
else
    echo "Model 'gemma:2b' already exists."
fi

# Wait for the background process to exit, keeping the container alive
wait $pid