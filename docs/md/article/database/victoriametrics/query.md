Query data #
VictoriaMetrics provides an HTTP API for serving read queries. The API is used in various integrations such as Grafana. The same API is also used by VMUI - graphical User Interface for querying and visualizing metrics.

MetricsQL - is the query language for executing read queries in VictoriaMetrics. MetricsQL is a PromQL -like query language with a powerful set of functions and features for working specifically with time series data.

See more details on querying data here


Query data #
VictoriaMetrics provides an HTTP API for serving read queries. The API is used in various integrations such as Grafana. The same API is also used by VMUI - a graphical User Interface for querying and visualizing metrics.

The API consists of two main handlers for serving instant queries and range queries.

Instant query #
Instant query executes the query expression at the given time:

GET | POST /api/v1/query?query=...&time=...&step=...&timeout=...
Params:

query - MetricsQL expression.
time - optional, timestamp in second precision to evaluate the query at. If omitted, time is set to now() (current timestamp). The time param can be specified in multiple allowed formats.
step - optional interval for searching for raw samples in the past when executing the query (used when a sample is missing at the specified time). For example, the request /api/v1/query?query=up&step=1m looks for the last written raw sample for the metric up in the interval between now() and now()-1m. If omitted, step is set to 5m (5 minutes) by default.
timeout - optional query timeout. For example, timeout=5s. Query is canceled when the timeout is reached. By default the timeout is set to the value of -search.maxQueryDuration command-line flag passed to single-node VictoriaMetrics or to vmselect component of VictoriaMetrics cluster.
The result of Instant query is a list of time series matching the filter in query expression. Each returned series contains exactly one (timestamp, value) entry, where timestamp equals to the time query arg, while the value contains query result at the requested time.

To understand how instant queries work, let’s begin with a data sample:



Prometheus querying API usage #
VictoriaMetrics supports the following handlers from Prometheus querying API:

/api/v1/query
/api/v1/query_range
/api/v1/series
/api/v1/labels
/api/v1/label/…/values
/api/v1/status/tsdb. See these docs for details.
/api/v1/targets - see these docs for more details.
/federate - see these docs for more details.