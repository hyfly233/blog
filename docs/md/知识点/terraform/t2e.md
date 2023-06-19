# Configure Provider Client

- 15min
- |
- TerraformTerraform



Reference this often? [Create an account](https://developer.hashicorp.com/sign-up) to bookmark tutorials.



In this tutorial, you will configure the HashiCups API client via Terraform provider configuration or environment variables. A configured client will then be available for any data source or resource to use. To do this, you will:

1. **Define the provider schema.**
   This prepares the provider to accept Terraform configuration for client authentication and host information.
2. **Define the provider data model.**
   This models the provider schema as a Go type so the data is accessible for other Go code.
3. **Define the provider configure method.**
   This reads the Terraform configuration using the data model or checks environment variables if data is missing from the configuration. It raises errors if any necessary client configuration is missing. The configured client is then created and made available for data sources and resources.
4. **Verify configuration behaviors.**
   This ensures the expected provider configuration behaviors.

## Prerequisites

To follow this tutorial, you need:

- [Go 1.19+](https://golang.org/doc/install) installed and configured.
- [Terraform v1.0.3+](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli) installed locally.
- [Docker](https://www.docker.com/products/docker-desktop) and [Docker Compose](https://docs.docker.com/compose/install/) to run an instance of HashiCups locally.

Continuing from previous tutorialNew set up

Navigate to your directory.`terraform-provider-hashicups-pf`

Your code should match the [`provider` branch](https://github.com/hashicorp/terraform-provider-hashicups-pf/tree/provider) from the example repository.

## Implement provider schema

The Plugin Framework uses a provider's method to define the acceptable configuration attribute names and types. The HashiCups client needs a host, username, and password to be properly configured. The Terraform Plugin Framework package contains schema and data model types that can work with Terraform's null, unknown, or known values.`Schema``types`

Open the file.`internal/provider/provider.go`

Replace your method with the following.`Schema`



internal/provider/provider.go

Copy

```go
// Schema defines the provider-level schema for configuration data.
func (p *hashicupsProvider) Schema(_ context.Context, _ provider.SchemaRequest, resp *provider.SchemaResponse) {
    resp.Schema = schema.Schema{
        Attributes: map[string]schema.Attribute{
            "host": schema.StringAttribute{
                Optional: true,
            },
            "username": schema.StringAttribute{
                Optional: true,
            },
            "password": schema.StringAttribute{
                Optional:  true,
                Sensitive: true,
            },
        },
    }
}
```

## Implement provider data model

The Terraform Plugin Framework uses Go struct types with struct field tags to map schema definitions into Go types with the actual data. The types within the struct must align with the types in the schema.`tfsdk`

Add your provider data model type definition to with the following.`internal/provider/provider.go`



internal/provider/provider.go

Copy

```go
// hashicupsProviderModel maps provider schema data to a Go type.
type hashicupsProviderModel struct {
    Host     types.String `tfsdk:"host"`
    Username types.String `tfsdk:"username"`
    Password types.String `tfsdk:"password"`
}
```

## Implement client configuration functionality

The provider uses the method to read API client configuration values from the Terraform configuration or environment variables. After verifying the values should be acceptable, the API client is created and made available for data source and resource usage.`Configure`

The configure method follows these steps:

1. **Retrieves values from the configuration.** The method will attempt to retrieve values from the provider configuration and convert it to an struct.`providerModel`
2. **Checks for unknown configuration values.** The method prevents an unexpectedly misconfigured client, if Terraform configuration values are only known after another resource is applied.
3. **Retrieves values from environment variables.** The method retrieves values from environment variables, then overrides them with any set Terraform configuration values.
4. **Creates API client.** The method invokes the HashiCups API client's function.`NewClient`
5. **Stores configured client for data source and resource usage.** The method sets the and fields of the response, so the client is available for usage by data source and resource implementations.`DataSourceData``ResourceData`

Replace your method in with the following.`Configure``internal/provider/provider.go`



internal/provider/provider.go

Copy

```go
func (p *hashicupsProvider) Configure(ctx context.Context, req provider.ConfigureRequest, resp *provider.ConfigureResponse) {
    // Retrieve provider data from configuration
    var config hashicupsProviderModel
    diags := req.Config.Get(ctx, &config)
    resp.Diagnostics.Append(diags...)
    if resp.Diagnostics.HasError() {
        return
    }

    // If practitioner provided a configuration value for any of the
    // attributes, it must be a known value.

    if config.Host.IsUnknown() {
        resp.Diagnostics.AddAttributeError(
            path.Root("host"),
            "Unknown HashiCups API Host",
            "The provider cannot create the HashiCups API client as there is an unknown configuration value for the HashiCups API host. "+
                "Either target apply the source of the value first, set the value statically in the configuration, or use the HASHICUPS_HOST environment variable.",
        )
    }

    if config.Username.IsUnknown() {
        resp.Diagnostics.AddAttributeError(
            path.Root("username"),
            "Unknown HashiCups API Username",
            "The provider cannot create the HashiCups API client as there is an unknown configuration value for the HashiCups API username. "+
                "Either target apply the source of the value first, set the value statically in the configuration, or use the HASHICUPS_USERNAME environment variable.",
        )
    }

    if config.Password.IsUnknown() {
        resp.Diagnostics.AddAttributeError(
            path.Root("password"),
            "Unknown HashiCups API Password",
            "The provider cannot create the HashiCups API client as there is an unknown configuration value for the HashiCups API password. "+
                "Either target apply the source of the value first, set the value statically in the configuration, or use the HASHICUPS_PASSWORD environment variable.",
        )
    }

    if resp.Diagnostics.HasError() {
        return
    }

    // Default values to environment variables, but override
    // with Terraform configuration value if set.

    host := os.Getenv("HASHICUPS_HOST")
    username := os.Getenv("HASHICUPS_USERNAME")
    password := os.Getenv("HASHICUPS_PASSWORD")

    if !config.Host.IsNull() {
        host = config.Host.ValueString()
    }

    if !config.Username.IsNull() {
        username = config.Username.ValueString()
    }

    if !config.Password.IsNull() {
        password = config.Password.ValueString()
    }

    // If any of the expected configurations are missing, return
    // errors with provider-specific guidance.

    if host == "" {
        resp.Diagnostics.AddAttributeError(
            path.Root("host"),
            "Missing HashiCups API Host",
            "The provider cannot create the HashiCups API client as there is a missing or empty value for the HashiCups API host. "+
                "Set the host value in the configuration or use the HASHICUPS_HOST environment variable. "+
                "If either is already set, ensure the value is not empty.",
        )
    }

    if username == "" {
        resp.Diagnostics.AddAttributeError(
            path.Root("username"),
            "Missing HashiCups API Username",
            "The provider cannot create the HashiCups API client as there is a missing or empty value for the HashiCups API username. "+
                "Set the username value in the configuration or use the HASHICUPS_USERNAME environment variable. "+
                "If either is already set, ensure the value is not empty.",
        )
    }

    if password == "" {
        resp.Diagnostics.AddAttributeError(
            path.Root("password"),
            "Missing HashiCups API Password",
            "The provider cannot create the HashiCups API client as there is a missing or empty value for the HashiCups API password. "+
                "Set the password value in the configuration or use the HASHICUPS_PASSWORD environment variable. "+
                "If either is already set, ensure the value is not empty.",
        )
    }

    if resp.Diagnostics.HasError() {
        return
    }

    // Create a new HashiCups client using the configuration values
    client, err := hashicups.NewClient(&host, &username, &password)
    if err != nil {
        resp.Diagnostics.AddError(
            "Unable to Create HashiCups API Client",
            "An unexpected error occurred when creating the HashiCups API client. "+
                "If the error is not clear, please contact the provider developers.\n\n"+
                "HashiCups Client Error: "+err.Error(),
        )
        return
    }

    // Make the HashiCups client available during DataSource and Resource
    // type Configure methods.
    resp.DataSourceData = client
    resp.ResourceData = client
}
```

Replace the statement at the top of the file with the following.`import``provider/provider.go`



provider/provider.go

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
)
```

Download the new HashiCups client dependency.

```shell-session
$ go get github.com/hashicorp-demoapp/hashicups-client-go@v0.1.0
go: downloading github.com/hashicorp-demoapp/hashicups-client-go v0.1.0
go: added github.com/hashicorp-demoapp/hashicups-client-go v0.1.0
```

Copy

Ensure all dependencies are correctly updated.

```shell-session
$ go mod tidy
```

Copy

Build and install the updated provider.

```shell-session
$ go install .
```

Copy

## Start HashiCups locally

Your HashiCups provider requires a running instance of HashiCups.

In another terminal window, navigate to the directory.`docker_compose`

```shell-session
$ cd docker_compose
```

Copy

Run to spin up a local instance of HashiCups on port .`docker-compose up``19090`

```shell-session
$ docker-compose up
```

Copy

Leave this process running in your terminal window. The HashiCups service will print out log messages in this terminal.

In the original terminal window, verify that HashiCups is running by sending a request to its health check endpoint. The HashiCups service will respond with .`ok`

```shell-session
$ curl localhost:19090/health/readyz
ok
```

Copy

## Create a HashiCups user

HashiCups requires a username and password to generate a JSON web token (JWT) which is used to authenticate against protected endpoints. You will use this user to authenticate to the HashiCups provider to manage your orders.

Create a user on HashiCups named with the password .`education``test123`

```shell-session
$ curl -X POST localhost:19090/signup -d '{"username":"education", "password":"test123"}'
{"UserID":1,"Username":"education","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1OTEwNzgwODUsInVzZXJfaWQiOjIsInVzZXJuYW1lIjoiZWR1Y2F0aW9uIn0.CguceCNILKdjOQ7Gx0u4UAMlOTaH3Dw-fsll2iXDrYU"}
```

Copy

Set the environment variable to the token you retrieved from invoking the endpoint. You will use this in later tutorials.`HASHICUPS_TOKEN``/signup`

```shell-session
$ export HASHICUPS_TOKEN=ey...
```

Copy

The terminal containing your HashiCups logs will record the sign up operation.

```shell-session
api_1  | 2020-12-10T09:19:50.601Z [INFO]  Handle User | signup
```

Now that the HashiCups app is running, you are ready to start verifying the Terraform provider configuration behaviors.

## Implement temporary data source

Provider configuration only occurs if there is a valid data source or resource supported by the provider and used in a Terraform configuration. For now, create a temporary data source implementation so you can verify the provider configuration behaviors. Later tutorials will guide you through the concepts and implementation details of real data sources and resources.

Add the temporary data source by creating a file named with the following.`internal/provider/coffees_data_source.go`



hashicups/coffees_data_source.go

Copy

```go
package provider

import (
    "context"

    "github.com/hashicorp/terraform-plugin-framework/datasource"
    "github.com/hashicorp/terraform-plugin-framework/datasource/schema"
)

func NewCoffeesDataSource() datasource.DataSource {
    return &coffeesDataSource{}
}

type coffeesDataSource struct{}

func (d *coffeesDataSource) Metadata(_ context.Context, req datasource.MetadataRequest, resp *datasource.MetadataResponse) {
    resp.TypeName = req.ProviderTypeName + "_coffees"
}

func (d *coffeesDataSource) Schema(_ context.Context, _ datasource.SchemaRequest, resp *datasource.SchemaResponse) {
    resp.Schema = schema.Schema{}
}

func (d *coffeesDataSource) Read(ctx context.Context, req datasource.ReadRequest, resp *datasource.ReadResponse) {
}
```

Open the file.`internal/provider/provider.go`

Add the temporary data source to your provider by replacing the method with the following.`DataSources`



internal/provider/provider.go

Copy

```go
// DataSources defines the data sources implemented in the provider.
func (p *hashicupsProvider) DataSources(_ context.Context) []func() datasource.DataSource {
    return []func() datasource.DataSource {
        NewCoffeesDataSource,
    }
}
```

Build and install the updated provider.

```shell-session
$ go install .
```

Copy

## Verify provider configuration

Navigate to the directory.`examples/provider-install-verification`

```shell-session
$ cd examples/provider-install-verification
```

Copy

The Terraform configuration file in this directory has no provider configuration values in the Terraform configuration.`main.tf`



examples/provider-install-verification/main.tf

```terraform
terraform {
  required_providers {
    hashicups = {
      source = "hashicorp.com/edu/hashicups-pf"
    }
  }
}

provider "hashicups" {}

data "hashicups_coffees" "example" {}
```

Run a Terraform plan with missing provider configuration. Terraform will report errors for the missing provider configuration values.

```shell-session
$ terraform plan
##...
╷
│ Error: Missing HashiCups API Host
│ 
│   with provider["hashicorp.com/edu/hashicups-pf"],
│   on main.tf line 9, in provider "hashicups":
│    9: provider "hashicups" {}
│ 
│ The provider cannot create the HashiCups API client as there is a missing or
│ empty value for the HashiCups API host. Set the host value in the
│ configuration or use the HASHICUPS_HOST environment variable. If either is
│ already set, ensure the value is not empty.
╵
╷
│ Error: Missing HashiCups API Username
│ 
│   with provider["hashicorp.com/edu/hashicups-pf"],
│   on main.tf line 9, in provider "hashicups":
│    9: provider "hashicups" {}
│ 
│ The provider cannot create the HashiCups API client as there is a missing or
│ empty value for the HashiCups API username. Set the username value in the
│ configuration or use the HASHICUPS_USERNAME environment variable. If either
│ is already set, ensure the value is not empty.
╵
╷
│ Error: Missing HashiCups API Password
│ 
│   with provider["hashicorp.com/edu/hashicups-pf"],
│   on main.tf line 9, in provider "hashicups":
│    9: provider "hashicups" {}
│ 
│ The provider cannot create the HashiCups API client as there is a missing or
│ empty value for the HashiCups API password. Set the password value in the
│ configuration or use the HASHICUPS_PASSWORD environment variable. If either
│ is already set, ensure the value is not empty.
╵
```

Copy

The provider configuration method you added earlier in this tutorial loads configuration data either from environment variables, or from the provider block in Terraform configuration. Verify the environment variable behavior by setting the provider-defined , , and environment variables when executing a Terraform plan. Terraform will configure the HashiCups client via these environment variables.`HASHICUPS_HOST``HASHICUPS_USERNAME``HASHICUPS_PASSWORD`

Run a Terraform plan with environment variables.

```shell-session
$ HASHICUPS_HOST=http://localhost:19090 \
  HASHICUPS_USERNAME=education \
  HASHICUPS_PASSWORD=test123 \
  terraform plan
```

Copy

Terraform will report that it is able to read from the data source and that the configuration does not include any changes to your infrastructure.`hashicups_coffees.example`

```text
## ...
data.hashicups_coffees.example: Reading...
data.hashicups_coffees.example: Read complete after 0s

No changes. Your infrastructure matches the configuration.

Terraform has compared your real infrastructure against your configuration and
found no differences, so no changes are needed.
```

Copy

The terminal containing your HashiCups logs will record the sign in operation.

```shell-session
api_1  | 2020-12-10T09:19:50.601Z [INFO]  Handle User | signin
```

Verify the Terraform configuration behavior by setting the provider schema-defined , , and values in a Terraform configuration.`host``username``password`

Create an directory and navigate to it.`examples/coffees`

```shell-session
$ mkdir ../coffees && cd "$_"
```

Copy

Create a Terraform configuration file in this directory that sets provider configuration values in the Terraform configuration.`main.tf`



examples/coffees/main.tf

```terraform
terraform {
  required_providers {
    hashicups = {
      source = "hashicorp.com/edu/hashicups-pf"
    }
  }
}

provider "hashicups" {
  host     = "http://localhost:19090"
  username = "education"
  password = "test123"
}

data "hashicups_coffees" "edu" {}
```

Run a Terraform plan. Terraform will authenticate with your HashiCups instance using the values from the provider block and once again report that it is able to read from the data source.`hashicups_coffees.example`

```shell-session
$ terraform plan
##...
data.hashicups_coffees.edu: Reading...
data.hashicups_coffees.edu: Read complete after 0s
##...
```

Copy

Navigate to the directory.`terraform-provider-hashicups-pf`

```shell-session
$ cd ../..
```

Copy

## Remove temporary data source

Before you move on to the next tutorial, remove the code for the temporary data source.

Remove the file.`internal/provider/coffees_data_source.go`

```shell-session
$ rm internal/provider/coffees_data_source.go
```

Copy

Open the file.`internal/provider/provider.go`

Remove the data source from your provider's schema by replacing the method with the following.`DataSources`



internal/provider/provider.go

Copy

```go
// DataSources defines the data sources implemented in the provider.
func (p *hashicupsProvider) DataSources(_ context.Context) []func() datasource.DataSource {
    return nil
}
```

Build and install the updated provider.

```shell-session
$ go install .
```

Copy

## Next steps

Congratulations! You have prepared the provider to communicate with an API client. Later tutorials will show you how to implement data source and resource functionality.

If you were stuck during this tutorial, checkout the [`provider-configure`](https://github.com/hashicorp/terraform-provider-hashicups-pf/tree/provider) branch to see the changes implemented in this tutorial.

- To learn more about the Terraform Plugin Framework, refer to the [Terraform Plugin Framework documentation](https://developer.hashicorp.com/terraform/plugin/framework).
- For a full capability comparison between the SDKv2 and the Plugin Framework, refer to the [Which SDK Should I Use? documentation](https://developer.hashicorp.com/terraform/plugin/which-sdk).
- The Terraform HashiCups (plugin-framework) provider's [`main` branch](https://github.com/hashicorp/terraform-provider-hashicups-pf) contains the complete HashiCups provider. It includes a data source written with the plugin framework and implements create, read, update and delete functionality for the order resource.
- Submit any Terraform Plugin Framework bug reports or feature requests to the development team in the [Terraform Plugin Framework Github repository](https://github.com/hashicorp/terraform-plugin-framework).
- Submit any Terraform Plugin Framework questions in the [Terraform Plugin Framework Discuss forum](https://discuss.hashicorp.com/c/terraform-providers/tf-plugin-sdk/43).