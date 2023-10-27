FROM python:3.11
# Or any preferred Python version.
ADD main.py .
RUN pip install -r requirements.txt