.PHONY: setup start clean

# Create a virtual environment, activate it, and install dependencies
setup:
	python3 -m venv venv && \
	source venv/bin/activate && \
	pip install --upgrade pip && \
	pip install -r requirements.txt

# Start the Flask development server
start:
	source venv/bin/activate && \
	flask run

# Remove the virtual environment
clean:
	rm -rf venv