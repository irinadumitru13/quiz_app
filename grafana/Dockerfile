FROM grafana/grafana:latest

COPY datasources/*.yml  /etc/grafana/provisioning/datasources/
COPY dashboards/* /etc/grafana/provisioning/dashboards/
COPY grafana.ini /etc/grafana/grafana.ini
