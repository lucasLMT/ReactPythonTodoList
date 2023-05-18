FROM tiangolo/uvicorn-gunicorn:python3.11-slim

RUN python -m venv /virtualenv && . /virtualenv/bin/activate

COPY pythonRequirements.txt /tmp/pythonRequirements.txt
RUN pip install -r /tmp/pythonRequirements.txt

COPY . /backend

WORKDIR /backend

EXPOSE 8000

CMD ["python3", "main.py"]