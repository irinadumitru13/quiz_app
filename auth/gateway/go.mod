module odin-gateway

go 1.14

replace github.com/devopsfaith/krakend => ./krakend

require (
	github.com/devopsfaith/krakend v1.3.0
	github.com/devopsfaith/krakend-metrics v1.1.0
	github.com/devopsfaith/krakend-opencensus v1.1.0
	github.com/gin-gonic/gin v1.1.5-0.20170702092826-d459835d2b07
	github.com/letgoapp/krakend-influx v0.0.0-20190214142340-d2fc9466bb3a
)
