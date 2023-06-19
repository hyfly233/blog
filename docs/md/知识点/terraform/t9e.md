# Implement Automated Testing

- 11min
- |
- TerraformTerraform



Reference this often? [Create an account](https://developer.hashicorp.com/sign-up) to bookmark tutorials.



In this tutorial, you will add automated acceptance testing capabilities to the data source and resource of a provider that interacts with the API of a fictional coffee-shop application called HashiCups. To do this, you will:

1. **Implement data source id attribute.**
   This ensures the data source is compatible with the testing framework.
2. **Implement data source acceptance testing.**
   This automates the end-to-end testing of the data source.
3. **Run data source acceptance testing.**
   This ensures that the data source testing works as expected.
4. **Implement resource acceptance testing.**
   This automates the end-to-end testing of the resource.
5. **Run resource acceptance testing.**
   This ensures that the resource testing works as expected.

The `terraform-plugin-testing` Go module `helper/resource` package enables providers to implement automated acceptance testing. The testing framework is built on top of standard `go test` command functionality and calls actual Terraform commands, such as `terraform apply`, `terraform import`, and `terraform destroy`. Unlike manual testing, you do not have to locally reinstall the provider on code updates or switch directories to use the expected Terraform configuration when you run the automated tests.

## Prerequisites

To follow this tutorial, you need:

- [Go 1.19+](https://golang.org/doc/install) installed and configured.
- [Terraform v1.0.3+](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli) installed locally.
- [Docker](https://www.docker.com/products/docker-desktop) and [Docker Compose](https://docs.docker.com/compose/install/) to run an instance of HashiCups locally.

Continuing from previous tutorialNew set up

Navigate to your `terraform-provider-hashicups-pf` directory.

Your code should match the [`import-order` branch](https://github.com/hashicorp/terraform-provider-hashicups-pf/tree/import-order) from the example repository.

If you're stuck at any point during this tutorial, refer to the `acceptance-tests` branch to see the changes implemented in this tutorial.

## Implement data source id attribute

The testing framework requires an `id` attribute to be present in every data source and resource. In order to run tests on data sources and resources that do not have their own ID, you must implement an ID field with a placeholder value.

Open the `internal/provider/coffees_data_source.go` file.

Add the `id` attribute to the `Schema` method with the following.



internal/provider/coffees_data_source.go

```go
func (d *coffeesDataSource) Schema(_ context.Context, _ datasource.SchemaRequest, resp *datasource.SchemaResponse) {
    resp.Schema = schema.Schema{
        Attributes: map[string]schema.Attribute{
            "id": schema.StringAttribute{
                Computed: true,
            },
            "coffees": schema.ListNestedAttribute{
                //...
```

Replace the `coffeesDataSourceModel` data source model with the following.



internal/provider/coffees_data_source.go

Copy

```go
// coffeesDataSourceModel maps the data source schema data.
type coffeesDataSourceModel struct {
    Coffees []coffeesModel `tfsdk:"coffees"`
    ID      types.String   `tfsdk:"id"`
}
```

Set a placeholder value near the end of the data source's `Read` method immediately before returning the state with the following.



internal/provider/coffees_data_source.go

```go
func (d *coffeesDataSource) Read(ctx context.Context, req datasource.ReadRequest, resp *datasource.ReadResponse) {
    //...

    state.ID = types.StringValue("placeholder")

    // Set state
    diags := resp.State.Set(ctx, &state)
    resp.Diagnostics.Append(diags...)
    if resp.Diagnostics.HasError() {
        return
    }
}
```

## Implement data source acceptance testing

Data source acceptance testing is used to verify the Terraform state contains data after being read from the API.

Most providers will manage some shared implementation details in a single testing file to simplify the data source and resource testing implementations.

Navigate to the `internal/provider` directory and remove the example scaffolding test files.

```shell-session
$ cd internal/provider && rm example_data_source_test.go; rm example_resource_test.go
```

Copy

Open the `internal/provider/provider_test.go` file and replace the existing code with the following.



internal/provider/provider_test.go

Copy

```go
package provider

import (
    "github.com/hashicorp/terraform-plugin-framework/providerserver"
    "github.com/hashicorp/terraform-plugin-go/tfprotov6"
)

const (
    // providerConfig is a shared configuration to combine with the actual
    // test configuration so the HashiCups client is properly configured.
    // It is also possible to use the HASHICUPS_ environment variables instead,
    // such as updating the Makefile and running the testing through that tool.
    providerConfig = `
provider "hashicups" {
  username = "education"
  password = "test123"
  host     = "http://localhost:19090"
}
`
)

var (
    // testAccProtoV6ProviderFactories are used to instantiate a provider during
    // acceptance testing. The factory function will be invoked for every Terraform
    // CLI command executed to create a provider server to which the CLI can
    // reattach.
    testAccProtoV6ProviderFactories = map[string]func() (tfprotov6.ProviderServer, error){
        "hashicups": providerserver.NewProtocol6WithError(New("test")()),
    }
)
```

Create a new `internal/provider/coffees_data_source_test.go` file with the following.



internal/provider/coffees_data_source_test.go

Copy

```go
package provider

import (
    "testing"

    "github.com/hashicorp/terraform-plugin-testing/helper/resource"
)

func TestAccCoffeesDataSource(t *testing.T) {
    resource.Test(t, resource.TestCase{
        ProtoV6ProviderFactories: testAccProtoV6ProviderFactories,
        Steps: []resource.TestStep{
            // Read testing
            {
                Config: providerConfig + `data "hashicups_coffees" "test" {}`,
                Check: resource.ComposeAggregateTestCheckFunc(
                    // Verify number of coffees returned
                    resource.TestCheckResourceAttr("data.hashicups_coffees.test", "coffees.#", "9"),
                    // Verify the first coffee to ensure all attributes are set
                    resource.TestCheckResourceAttr("data.hashicups_coffees.test", "coffees.0.description", ""),
                    resource.TestCheckResourceAttr("data.hashicups_coffees.test", "coffees.0.id", "1"),
                    resource.TestCheckResourceAttr("data.hashicups_coffees.test", "coffees.0.image", "/hashicorp.png"),
                    resource.TestCheckResourceAttr("data.hashicups_coffees.test", "coffees.0.ingredients.#", "1"),
                    resource.TestCheckResourceAttr("data.hashicups_coffees.test", "coffees.0.ingredients.0.id", "6"),
                    resource.TestCheckResourceAttr("data.hashicups_coffees.test", "coffees.0.name", "HCP Aeropress"),
                    resource.TestCheckResourceAttr("data.hashicups_coffees.test", "coffees.0.price", "200"),
                    resource.TestCheckResourceAttr("data.hashicups_coffees.test", "coffees.0.teaser", "Automation in a cup"),
                    // Verify placeholder id attribute
                    resource.TestCheckResourceAttr("data.hashicups_coffees.test", "id", "placeholder"),
                ),
            },
        },
    })
}
```

## Verify data source testing functionality

Now that you have implemented the testing functionality to the data source, you can run the tests.

Run Go testing with the `TF_ACC` environment variable set. The test framework will report that your data source's test passed.

```shell-session
$ TF_ACC=1 go test -count=1 -v
=== RUN   TestAccCoffeesDataSource
--- PASS: TestAccCoffeesDataSource (1.23s)
PASS
ok      terraform-provider-hashicups-pf/internal/provider   2.120s
```

Copy

## Implement resource testing functionality

Resource acceptance testing is used to verify the entire resource lifecycle, such as the `Create`, `Read`, `Update`, and `Delete` functionality, along with import capabilities. The testing framework automatically handles destroying test resources and returning any errors as a final step, regardless of whether there is a destroy step explicitly written.

Create a new `internal/provider/order_resource_test.go` file with the following.



internal/provider/order_resource_test.go

Copy

```go
package provider

import (
    "testing"

    "github.com/hashicorp/terraform-plugin-testing/helper/resource"
)

func TestAccOrderResource(t *testing.T) {
    resource.Test(t, resource.TestCase{
        ProtoV6ProviderFactories: testAccProtoV6ProviderFactories,
        Steps: []resource.TestStep{
            // Create and Read testing
            {
                Config: providerConfig + `
resource "hashicups_order" "test" {
  items = [
    {
      coffee = {
        id = 1
      }
      quantity = 2
    },
  ]
}
`,
                Check: resource.ComposeAggregateTestCheckFunc(
                    // Verify number of items
                    resource.TestCheckResourceAttr("hashicups_order.test", "items.#", "1"),
                    // Verify first order item
                    resource.TestCheckResourceAttr("hashicups_order.test", "items.0.quantity", "2"),
                    resource.TestCheckResourceAttr("hashicups_order.test", "items.0.coffee.id", "1"),
                    // Verify first coffee item has Computed attributes filled.
                    resource.TestCheckResourceAttr("hashicups_order.test", "items.0.coffee.description", ""),
                    resource.TestCheckResourceAttr("hashicups_order.test", "items.0.coffee.image", "/hashicorp.png"),
                    resource.TestCheckResourceAttr("hashicups_order.test", "items.0.coffee.name", "HCP Aeropress"),
                    resource.TestCheckResourceAttr("hashicups_order.test", "items.0.coffee.price", "200"),
                    resource.TestCheckResourceAttr("hashicups_order.test", "items.0.coffee.teaser", "Automation in a cup"),
                    // Verify dynamic values have any value set in the state.
                    resource.TestCheckResourceAttrSet("hashicups_order.test", "id"),
                    resource.TestCheckResourceAttrSet("hashicups_order.test", "last_updated"),
                ),
            },
            // ImportState testing
            {
                ResourceName:      "hashicups_order.test",
                ImportState:       true,
                ImportStateVerify: true,
                // The last_updated attribute does not exist in the HashiCups
                // API, therefore there is no value for it during import.
                ImportStateVerifyIgnore: []string{"last_updated"},
            },
            // Update and Read testing
            {
                Config: providerConfig + `
resource "hashicups_order" "test" {
  items = [
    {
      coffee = {
        id = 2
      }
      quantity = 2
    },
  ]
}
`,
                Check: resource.ComposeAggregateTestCheckFunc(
                    // Verify first order item updated
                    resource.TestCheckResourceAttr("hashicups_order.test", "items.0.quantity", "2"),
                    resource.TestCheckResourceAttr("hashicups_order.test", "items.0.coffee.id", "2"),
                    // Verify first coffee item has Computed attributes updated.
                    resource.TestCheckResourceAttr("hashicups_order.test", "items.0.coffee.description", ""),
                    resource.TestCheckResourceAttr("hashicups_order.test", "items.0.coffee.image", "/packer.png"),
                    resource.TestCheckResourceAttr("hashicups_order.test", "items.0.coffee.name", "Packer Spiced Latte"),
                    resource.TestCheckResourceAttr("hashicups_order.test", "items.0.coffee.price", "350"),
                    resource.TestCheckResourceAttr("hashicups_order.test", "items.0.coffee.teaser", "Packed with goodness to spice up your images"),
                ),
            },
            // Delete testing automatically occurs in TestCase
        },
    })
}
```

## Verify resource testing functionality

Now that you have implemented the testing functionality for the order resource, run the tests.

Run Go testing with the `TF_ACC` environment variable set and only running the resource tests. The test framework will report that your resource's test passed.

```shell-session
$ TF_ACC=1 go test -count=1 -run='TestAccOrderResource' -v
=== RUN   TestAccOrderResource
--- PASS: TestAccOrderResource (2.01s)
PASS
ok      terraform-provider-hashicups-pf/internal/provider   2.754s
```

Copy

Navigate to the `terraform-provider-hashicups-pf` directory.

```shell-session
$ cd ../..
```

Copy

## Next steps

Congratulations! You have enhanced the provider with acceptance testing capabilities.

If you were stuck during this tutorial, checkout the [`acceptance-tests`](https://github.com/hashicorp/terraform-provider-hashicups-pf/tree/acceptance-tests) branch to see the changes implemented in this tutorial.

- To learn more about the Terraform Plugin Framework, refer to the [Terraform Plugin Framework documentation](https://developer.hashicorp.com/terraform/plugin/framework).
- For a full capability comparison between the SDKv2 and the Plugin Framework, refer to the [Which SDK Should I Use? documentation](https://developer.hashicorp.com/terraform/plugin/which-sdk).
- The Terraform HashiCups (plugin-framework) provider's [`main` branch](https://github.com/hashicorp/terraform-provider-hashicups-pf) contains the complete HashiCups provider. It includes a data source written with the plugin framework and implements create, read, update and delete functionality for the order resource.
- Submit any Terraform Plugin Framework bug reports or feature requests to the development team in the [Terraform Plugin Framework Github repository](https://github.com/hashicorp/terraform-plugin-framework).
- Submit any Terraform Plugin Framework questions in the [Terraform Plugin Framework Discuss forum](https://discuss.hashicorp.com/c/terraform-providers/tf-plugin-sdk/43).