# Implement a Provider with the Terraform Plugin Framework

## Prerequisites

To follow this tutorial, you need:

- [Go 1.19+](https://golang.org/doc/install) installed and configured.
- [Terraform v1.0.3+](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli) installed locally.
- [Docker](https://www.docker.com/products/docker-desktop) and [Docker Compose](https://docs.docker.com/compose/install/) to run an instance of HashiCups locally.

## Set up your development environment

Clone the [Terraform Provider Scaffolding Framework repository](https://github.com/hashicorp/terraform-provider-scaffolding-framework).

```shell-session
$ git clone https://github.com/hashicorp/terraform-provider-scaffolding-framework
```

Copy

Rename the directory to `terraform-provider-hashicups-pf`.

```shell-session
$ mv terraform-provider-scaffolding-framework terraform-provider-hashicups-pf
```

Copy

Change into the cloned repository.

```shell-session
$ cd terraform-provider-hashicups-pf
```

Copy

Rename the `go.mod` module.

```shell-session
$ go mod edit -module terraform-provider-hashicups-pf
```

Copy

Then, install all the provider's dependencies.

```shell-session
$ go mod tidy
```

Copy

Open the `main.go` file in the `terraform-provider-hashicups-pf` repository's root directory and replace the `import` declaration with the following.



main.go

Copy

```go
import (
    "context"
    "flag"
    "log"

    "github.com/hashicorp/terraform-plugin-framework/providerserver"

    "terraform-provider-hashicups-pf/internal/provider"
)
```

Create a `docker_compose` directory in the repository you cloned, which will contain the Docker configuration required to launch a local instance of HashiCups.

```shell-session
$ mkdir docker_compose
```

Copy

Create a `docker_compose/conf.json` file with the following.



docker_compose/conf.json

Copy

```json
{
  "db_connection": "host=db port=5432 user=postgres password=password dbname=products sslmode=disable",
  "bind_address": "0.0.0.0:9090",
  "metrics_address": "localhost:9102"
}
```

Create a `docker_compose/docker-compose.yml` file with the following.



docker_compose/docker-compose.yml

Copy

```yaml
version: '3.7'
services:
  api:
    image: "hashicorpdemoapp/product-api:v0.0.22"
    ports:
      - "19090:9090"
    volumes:
      - ./conf.json:/config/config.json
    environment:
      CONFIG_FILE: '/config/config.json'
    depends_on:
      - db
  db:
    image: "hashicorpdemoapp/product-api-db:v0.0.22"
    ports:
      - "15432:5432"
    environment:
      POSTGRES_DB: 'products'
      POSTGRES_USER: 'postgres'
      POSTGRES_PASSWORD: 'password'
```

If you are stuck at any point during this tutorial, refer to the [`provider` branch](https://github.com/hashicorp/terraform-provider-hashicups-pf/tree/provider) in the Terraform Hashicups Provider repository to see the changes implemented in this tutorial.

## Implement initial provider type

Providers use an implementation of the `provider.Provider` interface type as the starting point for all implementation details.

This interface requires the following:

1. A **Metadata method** to define the provider type name for inclusion in each data source and resource type name. For example, a resource type named "hashicups_order" would have a provider type name of "hashicups".
2. A **Schema method** to define the schema for provider-level configuration. Later in these tutorials, you will update this method to accept a HashiCups API token and endpoint.
3. A **Configure method** to configure shared clients for data source and resource implementations.
4. A **DataSources method** to define the provider's data sources.
5. A **Resources method** to define the provider's resources.

Go to the `internal/provider` directory in the repository you cloned, which will contain all the Go code for the provider except the provider server.

Open the `internal/provider/provider.go` file and replace the existing code with the following.



internal/provider/provider.go

Copy

```go
package provider

import (
    "context"

    "github.com/hashicorp/terraform-plugin-framework/datasource"
    "github.com/hashicorp/terraform-plugin-framework/provider"
    "github.com/hashicorp/terraform-plugin-framework/provider/schema"
    "github.com/hashicorp/terraform-plugin-framework/resource"
)

// Ensure the implementation satisfies the expected interfaces.
var (
    _ provider.Provider = &hashicupsProvider{}
)

// New is a helper function to simplify provider server and testing implementation.
func New(version string) func() provider.Provider {
    return func() provider.Provider {
        return &hashicupsProvider{
            version: version,
        }
    }
}

// hashicupsProvider is the provider implementation.
type hashicupsProvider struct {
    // version is set to the provider version on release, "dev" when the
    // provider is built and ran locally, and "test" when running acceptance
    // testing.
    version string
}

// Metadata returns the provider type name.
func (p *hashicupsProvider) Metadata(_ context.Context, _ provider.MetadataRequest, resp *provider.MetadataResponse) {
    resp.TypeName = "hashicups"
    resp.Version = p.version
}

// Schema defines the provider-level schema for configuration data.
func (p *hashicupsProvider) Schema(_ context.Context, _ provider.SchemaRequest, resp *provider.SchemaResponse) {
    resp.Schema = schema.Schema{}
}

// Configure prepares a HashiCups API client for data sources and resources.
func (p *hashicupsProvider) Configure(ctx context.Context, req provider.ConfigureRequest, resp *provider.ConfigureResponse) {
}

// DataSources defines the data sources implemented in the provider.
func (p *hashicupsProvider) DataSources(_ context.Context) []func() datasource.DataSource {
    return nil
}

// Resources defines the resources implemented in the provider.
func (p *hashicupsProvider) Resources(_ context.Context) []func() resource.Resource {
    return nil
}
```

## Implement the provider server

Terraform providers are server processes that Terraform interacts with to handle each data source and resource operation, such as creating a resource on a remote system. Later in these tutorials, you will connect those Terraform operations to a locally running HashiCups API.

Serving a provider follows these steps:

1. **Starts a provider server process.** By implementing the `main` function, which is the code execution starting point for Go language programs, a long-running server will listen for Terraform requests.

Framework provider servers also support optional functionality such as enabling support for debugging tools. You will not implement this functionality in these tutorials.

Open the `main.go` file in the `terraform-provider-hashicups-pf` repository's root directory and replace the `main` function with the following.



main.go

Copy

```go
func main() {
    var debug bool

    flag.BoolVar(&debug, "debug", false, "set to true to run the provider with support for debuggers like delve")
    flag.Parse()

    opts := providerserver.ServeOpts{
        // NOTE: This is not a typical Terraform Registry provider address,
        // such as registry.terraform.io/hashicorp/hashicups. This specific
        // provider address is used in these tutorials in conjunction with a
        // specific Terraform CLI configuration for manual development testing
        // of this provider.
        Address: "hashicorp.com/edu/hashicups-pf",
        Debug:   debug,
    }

    err := providerserver.Serve(context.Background(), provider.New(version), opts)

    if err != nil {
        log.Fatal(err.Error())
    }
}
```

## Verify the initial provider

With the Go dependencies ready, your provider code should compile and run. Verify that your development environment is working properly by executing the code directly. This will return an error message as this is not how Terraform normally starts provider servers, but the error indicates that Go was able to compile and run your provider server.

Manually run the provider.

```shell-session
$ go run main.go
This binary is a plugin. These are not meant to be executed directly.
Please execute the program that consumes these plugins, which will
load any plugins automatically
exit status 1
```

Copy

## Prepare Terraform for local provider install

Terraform installs providers and verifies their versions and checksums when you run `terraform init`. Terraform will download your providers from either the provider registry or a local registry. However, while building your provider you will want to test Terraform configuration against a local development build of the provider. The development build will not have an associated version number or an official set of checksums listed in a provider registry.

Terraform allows you to use local provider builds by setting a `dev_overrides` block in a configuration file called `.terraformrc`. This block overrides all other configured installation methods.

Terraform searches for the `.terraformrc` file in your home directory and applies any configuration settings you set.

MacWindows

First, find the `GOBIN` path where Go installs your binaries. Your path may vary depending on how your Go environment variables are configured.

```shell-session
$ go env GOBIN
/Users/<Username>/go/bin
```

Copy

If the `GOBIN` go environment variable is not set, use the default path, `/Users/<Username>/go/bin`.

Create a new file called `.terraformrc` in your home directory (`~`), then add the `dev_overrides` block below. Change the `<PATH>` to the value returned from the `go env GOBIN` command above.



~/.terraformrc

Copy

```hcl
provider_installation {

  dev_overrides {
      "hashicorp.com/edu/hashicups-pf" = "<PATH>"
  }

  # For all other providers, install them directly from their origin provider
  # registries as normal. If you omit this, Terraform will _only_ use
  # the dev_overrides block, and so no other providers will be available.
  direct {}
}
```

## Locally install provider and verify with Terraform

Your Terraform CLI is now ready to use the locally installed provider in the `GOBIN` path. Use the `go install` command from the example repository's root directory to compile the provider into a binary and install it in your `GOBIN` path.

```shell-session
$ go install .
```

Copy

Create an `examples/provider-install-verification` directory, which will contain a terraform configuration to verify local provider installation, and navigate to it.

```shell-session
$ mkdir examples/provider-install-verification && cd "$_"
```

Copy

Create a `main.tf` file with the following.



examples/provider-install-verification/main.tf

Copy

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

The `main.tf` Terraform configuration file in this directory uses a "hashicups_coffees" data source that the provider does not yet support. You will implement this data source in a future tutorial.

Running a Terraform plan will report the provider override, as well as an error about the missing data source. Even though there was an error, this verifies that Terraform was able to successfully start the locally installed provider and interact with it in your development environment.

Run a Terraform plan with the non-existent data source. Terraform will respond with the missing data source error.

```shell-session
$ terraform plan
╷
│ Warning: Provider development overrides are in effect
│
│ The following provider development overrides are set in the CLI
│ configuration:
│  - hashicorp.com/edu/hashicups-pf in /Users/<Username>/go/bin
│
│ The behavior may therefore not match any released version of the provider and
│ applying changes may cause the state to become incompatible with published
│ releases.
╵
╷
│ Error: Invalid data source
│
│   on main.tf line 11, in data "hashicups_coffees" "example":
│   11: data "hashicups_coffees" "example" {}
│
│ The provider hashicorp.com/edu/hashicups-pf does not support data source
│ "hashicups_coffees".
╵
```

Copy

Navigate to the `terraform-provider-hashicups-pf` directory.

```shell-session
$ cd ../..
```
