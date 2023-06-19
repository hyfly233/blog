# Implement Logging

- 10min
- |
- TerraformTerraform



Reference this often? [Create an account](https://developer.hashicorp.com/sign-up) to bookmark tutorials.



In this tutorial, you will implement log messages in your provider and filter special values from the log output. Then you will manage log output to view those log statements when executing Terraform. To do this, you will:

1. **Add log messages.**
   This creates provider-defined log messages in Terraform's logs.
2. **Add structured log fields.**
   This enhances logging data with provider-defined key-value pairs for greater consistency across multiple logs and easier log viewing.
3. **Add log filtering.**
   This redacts certain log messages or structured log field data from being included in the log output.
4. **View all Terraform log output during commands.**
   This shows all Terraform logs in the terminal running a Terraform command.
5. **Save Terraform log output to a file during commands.**
   This saves all Terraform logs to a file when running a Terraform command.
6. **View specific Terraform log output.**
   This manages Terraform log output to show only certain logs.

## Prerequisites

To follow this tutorial, you need:

- [Go 1.19+](https://golang.org/doc/install) installed and configured.
- [Terraform v1.0.3+](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli) installed locally.
- [Docker](https://www.docker.com/products/docker-desktop) and [Docker Compose](https://docs.docker.com/compose/install/) to run an instance of HashiCups locally.

Continuing from previous tutorialNew set up

Navigate to your directory.`terraform-provider-hashicups-pf`

Your code should match the [`read-coffees` branch](https://github.com/hashicorp/terraform-provider-hashicups-pf/tree/read-coffees) from the example repository.

## Implement log messages

Providers support logging through the package of the Go module. This package implements structured logging and filtering capabilities.`tflog``github.com/hashicorp/terraform-plugin-log`

Open the file.`internal/provider/provider.go`

Update the top of the method logic with the following.`Configure`



internal/provider/provider.go

Copy

```go
func (p *hashicupsProvider) Configure(ctx context.Context, req provider.ConfigureRequest, resp *provider.ConfigureResponse) {
    tflog.Info(ctx, "Configuring HashiCups client")

    // Retrieve provider data from configuration
    var config hashicupsProviderModel
    /* ... */
```

Replace the statement at the beginning of the file with the following.`import`



internal/provider/provider.go

Copy

```go
import (
    "context"
    "os"

    "github.com/hashicorp-demoapp/hashicups-client-go"
    "github.com/hashicorp/terraform-plugin-framework/datasource"
    "github.com/hashicorp/terraform-plugin-framework/path"
    "github.com/hashicorp/terraform-plugin-framework/provider"
    "github.com/hashicorp/terraform-plugin-framework/provider/schema"
    "github.com/hashicorp/terraform-plugin-framework/resource"
    "github.com/hashicorp/terraform-plugin-framework/types"
    "github.com/hashicorp/terraform-plugin-log/tflog"
)
```

## Implement structured log fields

The package supports adding additional key-value pairs to logging for consistency and tracing flow. These pairs can be added for the rest of the provider request with the call or inline as a final parameter with any logging calls.`tflog``tflog.SetField()`

Open the file.`internal/provider/provider.go`

Inside your provider's method, set three logging fields and a log message immediately before the call with the following.`Configure``hashicups.NewClient()`



internal/provider/provider.go

Copy

```go
    /* ... */
    if resp.Diagnostics.HasError() {
        return
    }

    ctx = tflog.SetField(ctx, "hashicups_host", host)
    ctx = tflog.SetField(ctx, "hashicups_username", username)
    ctx = tflog.SetField(ctx, "hashicups_password", password)

    tflog.Debug(ctx, "Creating HashiCups client")

    // Create a new HashiCups client using the configuration values
    client, err := hashicups.NewClient(&host, &username, &password)
    /* ... */
```

Add a log message at the end of the method with the following.`Configure`



hashicups/provider.go

Copy

```go
    /* ... */
    // Make the HashiCups client available during DataSource and Resource
    // type Configure methods.
    resp.DataSourceData = client
    resp.ResourceData = client

    tflog.Info(ctx, "Configured HashiCups client", map[string]any{"success": true})
}
```

## Implement log filtering

Add a filter to mask the user's password before the call in the method with the following.`tflog.Debug(ctx, "Creating HashiCups client")``Configure`



hashicups/provider.go

Copy

```go
    /* ... */
    ctx = tflog.SetField(ctx, "hashicups_host", host)
    ctx = tflog.SetField(ctx, "hashicups_username", username)
    ctx = tflog.SetField(ctx, "hashicups_password", password)
    ctx = tflog.MaskFieldValuesWithFieldKeys(ctx, "hashicups_password")

    tflog.Debug(ctx, "Creating HashiCups client")
    /* ... */
```

Build and install the updated provider.

```shell-session
$ go install .
```

Copy

## View all Terraform log output

Log output from Terraform is controlled by various environment variables, such as or otherwise prefixed with .`TF_LOG``TF_LOG_`

Navigate to the directory.`examples/coffees`

```shell-session
$ cd examples/coffees
```

Copy

Run a Terraform plan with the environment variable set to .`TF_LOG``TRACE`

Terraform will output a large amount of log entries for all components within Terraform itself, the Terraform Plugin Framework, and any provider logging.

```shell-session
$ TF_LOG=TRACE terraform plan
##...
2022-09-19T09:33:34.487-0500 [INFO]  provider.terraform-provider-hashicups-pf: Configuring HashiCups client: tf_provider_addr=hashicorp.com/edu/hashicups-pf tf_req_id=UUID tf_rpc=ConfigureProvider @caller=PATH @module=hashicups_pf timestamp=2022-09-19T09:33:34.487-0500
2022-09-19T09:33:34.487-0500 [DEBUG] provider.terraform-provider-hashicups-pf: Creating HashiCups client: @module=hashicups_pf hashicups_password=*** tf_req_id=UUID @caller=PATH hashicups_host=http://localhost:19090 hashicups_username=education tf_provider_addr=hashicorp.com/edu/hashicups-pf tf_rpc=ConfigureProvider timestamp=2022-09-19T09:33:34.487-0500
2022-09-19T09:33:34.517-0500 [INFO]  provider.terraform-provider-hashicups-pf: Configured HashiCups client: tf_rpc=ConfigureProvider hashicups_password=*** hashicups_username=education success=true tf_provider_addr=hashicorp.com/edu/hashicups-pf tf_req_id=UUID @caller=PATH @module=hashicups_pf hashicups_host=http://localhost:19090 timestamp=2022-09-19T09:33:34.517-0500
##...
```

Copy

## Save all Terraform log output

Viewing log output inline with the running command is helpful if you plan on looking through the logs in the same terminal session or want to pipe the output to other shell commands, such as . Terraform can instead write this output to a log file on the local filesystem for opening in text editors or for archiving purposes.`grep`

Run a Terraform plan with both the and environment variables set.`TF_LOG``TF_LOG_PATH`

```shell-session
$ TF_LOG=TRACE TF_LOG_PATH=trace.txt terraform plan
```

Copy

Open the file and verify it contains the log messages you added to your provider's method.`examples/coffees/trace.txt``Configure`

```text
##...
2022-09-30T16:23:38.515-0500 [DEBUG] provider.terraform-provider-hashicups-pf: Calling provider defined Provider Configure: tf_provider_addr=hashicorp.com/edu/hashicups-pf tf_req_id=12541d93-279d-1ec0-eac1-d2d2fcfd4030 tf_rpc=ConfigureProvider @caller=/Users/YOU/go/pkg/mod/github.com/hashicorp/terraform-plugin-framework@v0.13.0/internal/fwserver/server_configureprovider.go:12 @module=sdk.framework timestamp=2022-09-30T16:23:38.515-0500
2022-09-30T16:23:38.515-0500 [INFO]  provider.terraform-provider-hashicups-pf: Configuring HashiCups client: tf_req_id=12541d93-279d-1ec0-eac1-d2d2fcfd4030 tf_rpc=ConfigureProvider @caller=/Users/YOU/code/terraform-provider-hashicups-pf/hashicups/provider.go:66 @module=hashicups_pf tf_provider_addr=hashicorp.com/edu/hashicups-pf timestamp=2022-09-30T16:23:38.515-0500
2022-09-30T16:23:38.515-0500 [DEBUG] provider.terraform-provider-hashicups-pf: Creating HashiCups client: hashicups_password=*** tf_req_id=12541d93-279d-1ec0-eac1-d2d2fcfd4030 tf_provider_addr=hashicorp.com/edu/hashicups-pf tf_rpc=ConfigureProvider @caller=/Users/YOU/code/terraform-provider-hashicups-pf/hashicups/provider.go:171 @module=hashicups_pf hashicups_host=http://localhost:19090 hashicups_username=education timestamp=2022-09-30T16:23:38.515-0500
2022-09-30T16:23:38.524-0500 [INFO]  provider.terraform-provider-hashicups-pf: Configured HashiCups client: @module=hashicups_pf hashicups_password=*** hashicups_username=education tf_req_id=12541d93-279d-1ec0-eac1-d2d2fcfd4030 tf_rpc=ConfigureProvider @caller=/Users/YOU/code/terraform-provider-hashicups-pf/hashicups/provider.go:190 hashicups_host=http://localhost:19090 success=true tf_provider_addr=hashicorp.com/edu/hashicups-pf timestamp=2022-09-30T16:23:38.524-0500
2022-09-30T16:23:38.524-0500 [DEBUG] provider.terraform-provider-hashicups-pf: Called provider defined Provider Configure: @module=sdk.framework tf_provider_addr=hashicorp.com/edu/hashicups-pf tf_req_id=12541d93-279d-1ec0-eac1-d2d2fcfd4030 tf_rpc=ConfigureProvider @caller=/Users/YOU/go/pkg/mod/github.com/hashicorp/terraform-plugin-framework@v0.13.0/internal/fwserver/server_configureprovider.go:20 timestamp=2022-09-30T16:23:38.524-0500
##...
```

Copy

Remove the file.`examples/coffees/trace.txt`

```shell-session
$ rm trace.txt
```

Copy

## View specific Terraform log output

The previous examples used the logging level. Trace logs are the most verbose level of logging available and may contain an overwhelming amount of information that is only relevant if you deeply understand certain internal components of Terraform or the Terraform Plugin Framework. You can instead lower the logging level to , , , or .`TRACE``DEBUG``INFO``WARN``ERROR`

Run a Terraform plan with the environment variable set to .`TF_LOG``INFO`

```shell-session
$ TF_LOG=INFO terraform plan
2022-09-30T16:27:38.446-0500 [INFO]  Terraform version: 1.3.0
2022-09-30T16:27:38.447-0500 [INFO]  Go runtime version: go1.19.1
2022-09-30T16:27:38.447-0500 [INFO]  CLI args: []string{"terraform", "plan"}
##...
```

Copy

You can enable log output for certain components, such as only provider logs and not Terraform CLI logs.

Run a Terraform plan with the environment variable set to .`TF_LOG_PROVIDER``INFO`

```shell-session
$ TF_LOG_PROVIDER=INFO terraform plan
##...
2022-12-14T10:39:33.247-0600 [INFO]  provider.terraform-provider-hashicups-pf: Configuring HashiCups client: @caller=/Users/YOU/code/terraform-provider-hashicups-pf/hashicups/provider.go:61 @module=hashicups_pf tf_provider_addr=hashicorp.com/edu/hashicups-pf tf_req_id=45969718-ed46-42b3-2cb9-847635d5aebb tf_rpc=ConfigureProvider timestamp=2022-12-14T10:39:33.247-0600
2022-12-14T10:39:33.255-0600 [INFO]  provider.terraform-provider-hashicups-pf: Configured HashiCups client: success=true hashicups_host=http://localhost:19090 hashicups_username=education tf_provider_addr=hashicorp.com/edu/hashicups-pf tf_req_id=45969718-ed46-42b3-2cb9-847635d5aebb tf_rpc=ConfigureProvider @caller=/Users/YOU/code/terraform-provider-hashicups-pf/hashicups/provider.go:184 @module=hashicups_pf timestamp=2022-12-14T10:39:33.255-0600
data.hashicups_coffees.edu: Reading...
data.hashicups_coffees.edu: Read complete after 0s
##...
```

Copy

Navigate to the directory.`terraform-provider-hashicups-pf`

```shell-session
cd ../..
```

Copy

## Next steps

Congratulations! You have implemented logging in the provider, viewed it, and refined the output.

If you were stuck during this tutorial, checkout the [`logging`](https://github.com/hashicorp/terraform-provider-hashicups-pf/tree/logging) branch to see the changes implemented in this tutorial.

- To learn more about the Terraform Plugin Framework, refer to the [Terraform Plugin Framework documentation](https://developer.hashicorp.com/terraform/plugin/framework).
- For a full capability comparison between the SDKv2 and the Plugin Framework, refer to the [Which SDK Should I Use? documentation](https://developer.hashicorp.com/terraform/plugin/which-sdk).
- The Terraform HashiCups (plugin-framework) provider's [`main` branch](https://github.com/hashicorp/terraform-provider-hashicups-pf) contains the complete HashiCups provider. It includes a data source written with the plugin framework and implements create, read, update and delete functionality for the order resource.
- Submit any Terraform Plugin Framework bug reports or feature requests to the development team in the [Terraform Plugin Framework Github repository](https://github.com/hashicorp/terraform-plugin-framework).
- Submit any Terraform Plugin Framework questions in the [Terraform Plugin Framework Discuss forum](https://discuss.hashicorp.com/c/terraform-providers/tf-plugin-sdk/43).