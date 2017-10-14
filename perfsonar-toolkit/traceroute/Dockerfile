FROM python:2-slim

RUN pip install networkx requests

ADD index.html /web/

ADD traceroute traceroute.py /opt/

CMD ["/opt/traceroute"]
EXPOSE 80
