# Implement Data Source

- 12min
- |
- TerraformTerraform



Reference this often? [Create an account](https://developer.hashicorp.com/sign-up) to bookmark tutorials.



In this tutorial, you will implement a data source to read the list of coffees from the HashiCups API and save it in Terraform’s state. To do this, you will:

1. **Define the initial data source type.**
   This prepares the data source to be added to the provider.
2. **Add data source to provider.**
   This enables the data source for testing and Terraform configuration usage.
3. **Implement the HashiCups client in the data source.**
   This retrieves the configured HashiCups client from the provider and makes it available for data source operations.
4. **Define the data source schema.**
   This prepares the data source to set Terraform state with the list of coffees.
5. **Define the data source data model.**
   This models the data source schema as a Go type so the data is accessible for other Go code.
6. **Define the data source read logic.**
   This handles calling the HashiCups API using the configured client and setting the Terraform state with the data.
7. **Verify data source behavior.**
   This ensures the expected data source behavior.

## Prerequisites

To follow this tutorial, you need:

- [Go 1.19+](https://golang.org/doc/install) installed and configured.
- [Terraform v1.0.3+](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli) installed locally.
- [Docker](https://www.docker.com/products/docker-desktop) and [Docker Compose](https://docs.docker.com/compose/install/) to run an instance of HashiCups locally.

Continuing from previous tutorialNew set up

Navigate to your `terraform-provider-hashicups-pf` directory.

Your code should match the [`provider-configure` branch](https://github.com/hashicorp/terraform-provider-hashicups-pf/tree/provider-configure) from the example repository.

## Implement initial data source type

To add a new data source to your provider, start by creating a type that implements the `datasource.DataSource` interface.

This interface requires the following:

1. **Metadata method.** This defines the data source type name, which is how the data source is referred to in Terraform configurations.
2. **Schema method.** This defines the schema for any data source configuration and state data.
3. **Read method.** This defines the logic which sets the Terraform state for the data source.

Add a new data source that will load data about coffee drinks from the HashiCups API by creating a `internal/provider/coffees_data_source.go` file with the following.



internal/provider/coffees_data_source.go

Copy

```go
package provider

import (
    "context"

    "github.com/hashicorp/terraform-plugin-framework/datasource"
    "github.com/hashicorp/terraform-plugin-framework/datasource/schema"
)

// Ensure the implementation satisfies the expected interfaces.
var (
    _ datasource.DataSource = &coffeesDataSource{}
)

// NewCoffeesDataSource is a helper function to simplify the provider implementation.
func NewCoffeesDataSource() datasource.DataSource {
    return &coffeesDataSource{}
}

// coffeesDataSource is the data source implementation.
type coffeesDataSource struct{}

// Metadata returns the data source type name.
func (d *coffeesDataSource) Metadata(_ context.Context, req datasource.MetadataRequest, resp *datasource.MetadataResponse) {
    resp.TypeName = req.ProviderTypeName + "_coffees"
}

// Schema defines the schema for the data source.
func (d *coffeesDataSource) Schema(_ context.Context, _ datasource.SchemaRequest, resp *datasource.SchemaResponse) {
    resp.Schema = schema.Schema{}
}

// Read refreshes the Terraform state with the latest data.
func (d *coffeesDataSource) Read(ctx context.Context, req datasource.ReadRequest, resp *datasource.ReadResponse) {
}
```

## Add data source to provider

Providers use the `DataSources` method to define the data sources they implement.

Open the `internal/provider/provider.go` file.

Add your new data source by replacing the `DataSources` method with the following.



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

## Implement data source client functionality

Data sources use the optional `Configure` method to fetch configured clients from the provider. The provider configures the HashiCups client and the data source can save a reference to that client for its operations.

Open the `internal/provider/coffees_data_source.go` file.

Allow your data source type to store a reference to the HashiCups client by replacing the `coffeesDataSource` type with the following.



internal/provider/coffees_data_source.go

Copy

```go
// coffeesDataSource is the data source implementation.
type coffeesDataSource struct {
    client *hashicups.Client
}
```

Replace the `import` statement at the beginning of the file with the following.



internal/provider/coffees_data_source.go

Copy

```go
import (
       "context"

       "github.com/hashicorp-demoapp/hashicups-client-go"
       "github.com/hashicorp/terraform-plugin-framework/datasource"
       "github.com/hashicorp/terraform-plugin-framework/datasource/schema"
)
```

Ensure that your data source implements the `DataSourceWithConfigure` interface by replacing the `var ( ... )` statement with the following.



internal/provider/coffees_data_source.go

Copy

```go
// Ensure the implementation satisfies the expected interfaces.
var (
    _ datasource.DataSource              = &coffeesDataSource{}
    _ datasource.DataSourceWithConfigure = &coffeesDataSource{}
)
```

Fetch the HashiCups client from the provider by adding the `Configure` method to your data source type.



internal/provider/coffees_data_source.go

Copy

```go
// Configure adds the provider configured client to the data source.
func (d *coffeesDataSource) Configure(_ context.Context, req datasource.ConfigureRequest, resp *datasource.ConfigureResponse) {
    if req.ProviderData == nil {
        return
    }

    client, ok := req.ProviderData.(*hashicups.Client)
    if !ok {
        resp.Diagnostics.AddError(
            "Unexpected Data Source Configure Type",
            fmt.Sprintf("Expected *hashicups.Client, got: %T. Please report this issue to the provider developers.", req.ProviderData),
        )

        return
    }

    d.client = client
}
```

## Implement data source schema

The data source uses the `Schema` method to define the acceptable configuration and state attribute names and types. The coffees data source will need to save a list of coffees with various attributes to the state.

Replace your data source's `Schema` method with the following.



internal/provider/coffees_data_source.go

Copy

```go
// Schema defines the schema for the data source.
func (d *coffeesDataSource) Schema(_ context.Context, _ datasource.SchemaRequest, resp *datasource.SchemaResponse) {
    resp.Schema = schema.Schema{
        Attributes: map[string]schema.Attribute{
            "coffees": schema.ListNestedAttribute{
                Computed: true,
                NestedObject: schema.NestedAttributeObject{
                    Attributes: map[string]schema.Attribute{
                        "id": schema.Int64Attribute{
                            Computed: true,
                        },
                        "name": schema.StringAttribute{
                            Computed: true,
                        },
                        "teaser": schema.StringAttribute{
                            Computed: true,
                        },
                        "description": schema.StringAttribute{
                            Computed: true,
                        },
                        "price": schema.Float64Attribute{
                            Computed: true,
                        },
                        "image": schema.StringAttribute{
                            Computed: true,
                        },
                        "ingredients": schema.ListNestedAttribute{
                            Computed: true,
                            NestedObject: schema.NestedAttributeObject{
                                Attributes: map[string]schema.Attribute{
                                    "id": schema.Int64Attribute{
                                        Computed: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    }
}
```

## Implement data source data models

Add data model types to your data source with the following.



internal/provider/coffees_data_source.go

Copy

```go
// coffeesDataSourceModel maps the data source schema data.
type coffeesDataSourceModel struct {
    Coffees []coffeesModel `tfsdk:"coffees"`
}

// coffeesModel maps coffees schema data.
type coffeesModel struct {
    ID          types.Int64               `tfsdk:"id"`
    Name        types.String              `tfsdk:"name"`
    Teaser      types.String              `tfsdk:"teaser"`
    Description types.String              `tfsdk:"description"`
    Price       types.Float64             `tfsdk:"price"`
    Image       types.String              `tfsdk:"image"`
    Ingredients []coffeesIngredientsModel `tfsdk:"ingredients"`
}

// coffeesIngredientsModel maps coffee ingredients data
type coffeesIngredientsModel struct {
    ID types.Int64 `tfsdk:"id"`
}
```

Replace the `import` statement at the beginning of the file with the following.



internal/provider/coffees_data_source.go

Copy

```go
import (
    "context"
    "fmt"

    "github.com/hashicorp-demoapp/hashicups-client-go"
    "github.com/hashicorp/terraform-plugin-framework/datasource"
    "github.com/hashicorp/terraform-plugin-framework/datasource/schema"
    "github.com/hashicorp/terraform-plugin-framework/types"
)
```

## Implement read functionality

The data source uses the `Read` method to refresh the Terraform state based on the schema data. The `hashicups_coffees` data source will use the configured HashiCups client to call the HashiCups API coffee listing endpoint and save this data to the Terraform state.

The read method follows these steps:

1. **Reads coffees list.** The method invokes the API client's `GetCoffees` method.
2. **Maps response body to schema attributes.** After the method reads the coffees, it maps the `[]hashicups.Coffee` response to `coffeesModel` so the data source can set the Terraform state.
3. **Sets state with coffees list.**

Replace your data source's `Read` method with the following.



internal/provider/coffees_data_source.go

Copy

```go
// Read refreshes the Terraform state with the latest data.
func (d *coffeesDataSource) Read(ctx context.Context, req datasource.ReadRequest, resp *datasource.ReadResponse) {
    var state coffeesDataSourceModel

    coffees, err := d.client.GetCoffees()
    if err != nil {
        resp.Diagnostics.AddError(
            "Unable to Read HashiCups Coffees",
            err.Error(),
        )
        return
    }

    // Map response body to model
    for _, coffee := range coffees {
        coffeeState := coffeesModel{
            ID:          types.Int64Value(int64(coffee.ID)),
            Name:        types.StringValue(coffee.Name),
            Teaser:      types.StringValue(coffee.Teaser),
            Description: types.StringValue(coffee.Description),
            Price:       types.Float64Value(coffee.Price),
            Image:       types.StringValue(coffee.Image),
        }

        for _, ingredient := range coffee.Ingredient {
            coffeeState.Ingredients = append(coffeeState.Ingredients, coffeesIngredientsModel{
                ID: types.Int64Value(int64(ingredient.ID)),
            })
        }

        state.Coffees = append(state.Coffees, coffeeState)
    }

    // Set state
    diags := resp.State.Set(ctx, &state)
    resp.Diagnostics.Append(diags...)
    if resp.Diagnostics.HasError() {
        return
    }
}
```

Build and install the updated provider.

```shell-session
$ go install .
```

Copy

## Verify data source

Navigate to the `examples/coffees` directory.

```shell-session
$ cd examples/coffees
```

Copy

The `main.tf` Terraform configuration file in this directory reads data from your new `hashicups_coffees` data source and outputs that data.



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

output "edu_coffees" {
  value = data.hashicups_coffees.edu
}
```

Run a Terraform plan. Terraform will report the data it retrieved from the HashiCups API.

```shell-session
$ terraform plan
##...
data.hashicups_coffees.edu: Reading...
data.hashicups_coffees.edu: Read complete after 0s

Changes to Outputs:
  + edu_coffees = {
      + coffees = [
          + {
              + description = ""
              + id          = 1
              + image       = "/hashicorp.png"
              + ingredients = [
                  + {
                      + id = 6
                    },
                ]
              + name        = "HCP Aeropress"
              + price       = 200
              + teaser      = "Automation in a cup"
            },
##...
You can apply this plan to save these new output values to the Terraform state,
without changing any real infrastructure.

───────────────────────────────────────────────────────────────────────────────

Note: You didn't use the -out option to save this plan, so Terraform can't
guarantee to take exactly these actions if you run "terraform apply" now.
```

Copy

Navigate to the `terraform-provider-hashicups-pf` directory.

```shell-session
$ cd ../..
```

Copy

## Next steps

Congratulations! You have implemented a data source in the provider that uses the configured API client to save Terraform state.

If you were stuck during this tutorial, checkout the [`read-coffees`](https://github.com/hashicorp/terraform-provider-hashicups-pf/tree/read-coffees) branch to see the changes implemented in this tutorial.

- To learn more about the Terraform Plugin Framework, refer to the [Terraform Plugin Framework documentation](https://developer.hashicorp.com/terraform/plugin/framework).
- For a full capability comparison between the SDKv2 and the Plugin Framework, refer to the [Which SDK Should I Use? documentation](https://developer.hashicorp.com/terraform/plugin/which-sdk).
- The Terraform HashiCups (plugin-framework) provider's [`main` branch](https://github.com/hashicorp/terraform-provider-hashicups-pf) contains the complete HashiCups provider. It includes a data source written with the plugin framework and implements create, read, update and delete functionality for the order resource.
- Submit any Terraform Plugin Framework bug reports or feature requests to the development team in the [Terraform Plugin Framework Github repository](https://github.com/hashicorp/terraform-plugin-framework).
- Submit any Terraform Plugin Framework questions in the [Terraform Plugin Framework Discuss forum](https://discuss.hashicorp.com/c/terraform-providers/tf-plugin-sdk/43).