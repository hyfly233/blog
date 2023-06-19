# Implement Resource Create and Read

In this tutorial, you will add create and read capabilities to a new `order` resource of a provider that interacts with the API of a fictional coffee-shop application called Hashicups. To do this, you will:

1. **Define the initial resource type.**
   This prepares the resource to be added to the provider.
2. **Add the resource to the provider.**
   This enables the resource for testing and Terraform configuration usage.
3. **Implement the HashiCups client in the resource.**
   This retrieves the configured HashiCups client from the provider and makes it available for resource operations.
4. **Define the resource's schema.**
   This prepares the resource to accept data from the Terraform configuration and store order information in the Terraform state.
5. **Define the resource's data model.**
   This models the resource schema as a Go type so the data is accessible for other Go code.
6. **Define the resource's create logic.**
   This handles calling the HashiCups API to create an order using the configuration saving Terraform state with the data.
7. **Define the resource's read logic.**
   This handles calling the HashiCups API using the configured client and refreshing the Terraform state with the data.
8. **Verify the resource's behavior.**
   This verifies that the resource behaves as expected when you refer to it in Terraform configuration.



## Implement initial resource type

Providers use an implementation of the `resource.Resource` interface type as the starting point for a resource implementation.

This interface requires the following:

1. A **Metadata method** to define the resource type name, which is how the resource is used in Terraform configurations.
2. A **Schema method** to define the schema for any resource configuration, plan, and state data.
3. A **Create method** to define the logic which creates the resource and sets its initial Terraform state.
4. A **Read method** to define the logic which refreshes the Terraform state for the resource.
5. An **Update method** to define the logic which updates the resource and sets the updated Terraform state on success.
6. A **Delete method** to define the logic which deletes the resource and removes the Terraform state on success.

Create a `internal/provider/order_resource.go` file.



internal/provider/order_resource.go

Copy

```go
package provider

import (
    "context"

    "github.com/hashicorp/terraform-plugin-framework/resource"
    "github.com/hashicorp/terraform-plugin-framework/resource/schema"
)

// Ensure the implementation satisfies the expected interfaces.
var (
    _ resource.Resource = &orderResource{}
)

// NewOrderResource is a helper function to simplify the provider implementation.
func NewOrderResource() resource.Resource {
    return &orderResource{}
}

// orderResource is the resource implementation.
type orderResource struct{}

// Metadata returns the resource type name.
func (r *orderResource) Metadata(_ context.Context, req resource.MetadataRequest, resp *resource.MetadataResponse) {
    resp.TypeName = req.ProviderTypeName + "_order"
}

// Schema defines the schema for the resource.
func (r *orderResource) Schema(_ context.Context, _ resource.SchemaRequest, resp *resource.SchemaResponse) {
    resp.Schema = schema.Schema{}
}

// Create creates the resource and sets the initial Terraform state.
func (r *orderResource) Create(ctx context.Context, req resource.CreateRequest, resp *resource.CreateResponse) {
}

// Read refreshes the Terraform state with the latest data.
func (r *orderResource) Read(ctx context.Context, req resource.ReadRequest, resp *resource.ReadResponse) {
}

// Update updates the resource and sets the updated Terraform state on success.
func (r *orderResource) Update(ctx context.Context, req resource.UpdateRequest, resp *resource.UpdateResponse) {
}

// Delete deletes the resource and removes the Terraform state on success.
func (r *orderResource) Delete(ctx context.Context, req resource.DeleteRequest, resp *resource.DeleteResponse) {
}
```

## Add resource to provider

Providers return the resources they support from their `Resources` method.

Open the `internal/provider/provider.go` file.

Add the `NewOrderResource` resource to your provider by replacing the `Resources` method with the following.



internal/provider/provider.go

Copy

```go
// Resources defines the resources implemented in the provider.
func (p *hashicupsProvider) Resources(_ context.Context) []func() resource.Resource {
    return []func() resource.Resource{
        NewOrderResource,
    }
}
```

## Implement resource client functionality

Resources use the optional `Configure` method to fetch configured clients from the provider. The provider already configures the HashiCups client and the resource can save a reference to that client for its operations.

Open the `internal/provider/order_resource.go` file.

Allow your resource type to store a reference to the HashiCups client by replacing the `orderResource` type with the following.



internal/provider/order_resource.go

Copy

```go
// orderResource is the resource implementation.
type orderResource struct {
    client *hashicups.Client
}
```

Import the HashiCups client package your resource will require by replacing the `import` statement at the beginning of the file with the following.



internal/provider/order_resource.go

Copy

```go
import (
    "context"

    "github.com/hashicorp-demoapp/hashicups-client-go"
    "github.com/hashicorp/terraform-plugin-framework/resource"
    "github.com/hashicorp/terraform-plugin-framework/resource/schema"
)
```

Ensure that your resource satisfies the `Resource` and `ResourceWithConfigure` interfaces defined by the Framework by replacing the `var` statement with the following.



internal/provider/order_resource.go

Copy

```go
// Ensure the implementation satisfies the expected interfaces.
var (
    _ resource.Resource              = &orderResource{}
    _ resource.ResourceWithConfigure = &orderResource{}
)
```

Add a `Configure` method to retrieve the HashiCups client with the following.



internal/provider/order_resource.go

Copy

```go
// Configure adds the provider configured client to the resource.
func (r *orderResource) Configure(_ context.Context, req resource.ConfigureRequest, resp *resource.ConfigureResponse) {
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

    r.client = client
}
```

## Implement resource schema

The resource uses the `Schema` method to define the supported configuration, plan, and state attribute names and types. The order resource will need to save a list of coffees with various attributes to Terraform's state.

Replace your order resource's `Schema` method with the following.



internal/provider/order_resource.go

Copy

```go
// Schema defines the schema for the resource.
func (r *orderResource) Schema(_ context.Context, _ resource.SchemaRequest, resp *resource.SchemaResponse) {
    resp.Schema = schema.Schema{
        Attributes: map[string]schema.Attribute{
            "id": schema.StringAttribute{
                Computed: true,
            },
            "last_updated": schema.StringAttribute{
                Computed: true,
            },
            "items": schema.ListNestedAttribute{
                Required: true,
                NestedObject: schema.NestedAttributeObject{
                    Attributes: map[string]schema.Attribute{
                        "quantity": schema.Int64Attribute{
                            Required: true,
                        },
                        "coffee": schema.SingleNestedAttribute{
                            Required: true,
                            Attributes: map[string]schema.Attribute{
                                "id": schema.Int64Attribute{
                                    Required: true,
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
                            },
                        },
                    },
                },
            },
        },
    }
}
```

## Implement resource data models

Add the following data model types for your resource to `order_resource.go`.



internal/provider/order_resource.go

Copy

```go
// orderResourceModel maps the resource schema data.
type orderResourceModel struct {
    ID          types.String     `tfsdk:"id"`
    Items       []orderItemModel `tfsdk:"items"`
    LastUpdated types.String     `tfsdk:"last_updated"`
}

// orderItemModel maps order item data.
type orderItemModel struct {
    Coffee   orderItemCoffeeModel `tfsdk:"coffee"`
    Quantity types.Int64          `tfsdk:"quantity"`
}

// orderItemCoffeeModel maps coffee order item data.
type orderItemCoffeeModel struct {
    ID          types.Int64   `tfsdk:"id"`
    Name        types.String  `tfsdk:"name"`
    Teaser      types.String  `tfsdk:"teaser"`
    Description types.String  `tfsdk:"description"`
    Price       types.Float64 `tfsdk:"price"`
    Image       types.String  `tfsdk:"image"`
}
```

## Implement create functionality

The provider uses the `Create` method to create a new resource based on the schema data.

The create method follows these steps:

1. **Checks whether the API Client is configured.** If not, the resource responds with an error.
2. **Retrieves values from the plan.** The function will attempt to retrieve values from the plan and convert it to an `orderResourceModel`.
3. **Generates an API request body from the plan values.** The function loops through each plan item and maps it to a `hashicups.OrderItem`. This is what the API client needs to create a new order.
4. **Creates a new order.** The function invokes the API client's `CreateOrder` method.
5. **Maps response body to resource schema attributes.** After the function creates an order, it maps the `hashicups.Order` response to `[]OrderItem` so the provider can update the Terraform state.
6. **Sets Terraform's state with the new order's details.**

Replace your resource's `Create` method with the following.



internal/provider/order_resource.go

Copy

```go
// Create a new resource.
func (r *orderResource) Create(ctx context.Context, req resource.CreateRequest, resp *resource.CreateResponse) {
    // Retrieve values from plan
    var plan orderResourceModel
    diags := req.Plan.Get(ctx, &plan)
    resp.Diagnostics.Append(diags...)
    if resp.Diagnostics.HasError() {
        return
    }

    // Generate API request body from plan
    var items []hashicups.OrderItem
    for _, item := range plan.Items {
        items = append(items, hashicups.OrderItem{
            Coffee: hashicups.Coffee{
                ID: int(item.Coffee.ID.ValueInt64()),
            },
            Quantity: int(item.Quantity.ValueInt64()),
        })
    }

    // Create new order
    order, err := r.client.CreateOrder(items)
    if err != nil {
        resp.Diagnostics.AddError(
            "Error creating order",
            "Could not create order, unexpected error: "+err.Error(),
        )
        return
    }

    // Map response body to schema and populate Computed attribute values
    plan.ID = types.StringValue(strconv.Itoa(order.ID))
    for orderItemIndex, orderItem := range order.Items {
        plan.Items[orderItemIndex] = orderItemModel{
            Coffee: orderItemCoffeeModel{
                ID:          types.Int64Value(int64(orderItem.Coffee.ID)),
                Name:        types.StringValue(orderItem.Coffee.Name),
                Teaser:      types.StringValue(orderItem.Coffee.Teaser),
                Description: types.StringValue(orderItem.Coffee.Description),
                Price:       types.Float64Value(orderItem.Coffee.Price),
                Image:       types.StringValue(orderItem.Coffee.Image),
            },
            Quantity: types.Int64Value(int64(orderItem.Quantity)),
        }
    }
    plan.LastUpdated = types.StringValue(time.Now().Format(time.RFC850))

    // Set state to fully populated data
    diags = resp.State.Set(ctx, plan)
    resp.Diagnostics.Append(diags...)
    if resp.Diagnostics.HasError() {
        return
    }
}
```

Add the packages used in the `Create` method by replacing the `import` statement with the following.



internal/provider/order_resource.go

Copy

```go
import (
    "context"
    "fmt"
    "strconv"
    "time"

    "github.com/hashicorp-demoapp/hashicups-client-go"
    "github.com/hashicorp/terraform-plugin-framework/resource"
    "github.com/hashicorp/terraform-plugin-framework/resource/schema"
    "github.com/hashicorp/terraform-plugin-framework/types"
)
```

## Implement read functionality

The provider uses the `Read` function to retrieve the resource's information and update the Terraform state to reflect the resource's current state. The provider invokes this function before every plan to generate an accurate diff between the resource's current state and the configuration.

The read function follows these steps:

1. **Gets the current state.** If it is unable to, the provider responds with an error.
2. **Retrieves the order ID from Terraform's state.**
3. **Retrieves the order details from the client.** The function invokes the API client's `GetOrder` method with the order ID.
4. **Maps the response body to resource schema attributes.** After the function retrieves the order, it maps the `hashicups.Order` response to `[]OrderItem` so the provider can update the Terraform state.
5. **Set Terraform's state with the order's details.**

Replace your provider's `Read` method in `order_resource.go` with the following:



internal/provider/order_resource.go

Copy

```go
// Read resource information.
func (r *orderResource) Read(ctx context.Context, req resource.ReadRequest, resp *resource.ReadResponse) {
// Get current state
    var state orderResourceModel
    diags := req.State.Get(ctx, &state)
    resp.Diagnostics.Append(diags...)
    if resp.Diagnostics.HasError() {
        return
    }

    // Get refreshed order value from HashiCups
    order, err := r.client.GetOrder(state.ID.ValueString())
    if err != nil {
        resp.Diagnostics.AddError(
            "Error Reading HashiCups Order",
            "Could not read HashiCups order ID "+state.ID.ValueString()+": "+err.Error(),
        )
        return
    }

    // Overwrite items with refreshed state
    state.Items = []orderItemModel{}
    for _, item := range order.Items {
        state.Items = append(state.Items, orderItemModel{
            Coffee: orderItemCoffeeModel{
                ID:          types.Int64Value(int64(item.Coffee.ID)),
                Name:        types.StringValue(item.Coffee.Name),
                Teaser:      types.StringValue(item.Coffee.Teaser),
                Description: types.StringValue(item.Coffee.Description),
                Price:       types.Float64Value(item.Coffee.Price),
                Image:       types.StringValue(item.Coffee.Image),
            },
            Quantity: types.Int64Value(int64(item.Quantity)),
        })
    }

    // Set refreshed state
    diags = resp.State.Set(ctx, &state)
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

If you were stuck at any step, check out the [`create-read-order`](https://github.com/hashicorp/terraform-provider-hashicups-pf/tree/create-read-order) branch to see the changes implemented in this tutorial.

## Verify resource

The Terraform provider you just modified is ready to communicate with your API endpoint to create an order.

Create an `examples/order` directory and navigate to it.

```shell-session
$ mkdir examples/order && cd "$_"
```

Copy

Create a `main.tf` Terraform configuration file in this directory that creates a new order.



examples/order/main.tf

Copy

```terraform
terraform {
  required_providers {
    hashicups = {
      source  = "hashicorp.com/edu/hashicups-pf"
    }
  }
  required_version = ">= 1.1.0"
}

provider "hashicups" {
  username = "education"
  password = "test123"
  host     = "http://localhost:19090"
}

resource "hashicups_order" "edu" {
  items = [{
    coffee = {
      id = 3
    }
    quantity = 2
    }, {
    coffee = {
      id = 1
    }
    quantity = 2
    }
  ]
}

output "edu_order" {
  value = hashicups_order.edu
}
```

Apply your configuration to create the order. Notice how the execution plan shows a proposed order, with additional information about the order. Remember to confirm the apply step with a `yes`.

```shell-session
$ terraform apply

Terraform used the selected providers to generate the following execution plan. Resource actions are indicated with the following symbols:
  + create

Terraform will perform the following actions:

  # hashicups_order.edu will be created
  + resource "hashicups_order" "edu" {
      + id           = (known after apply)
      ## ...
    }

Plan: 1 to add, 0 to change, 0 to destroy.

Changes to Outputs:
  + edu_order = {
      + id           = (known after apply)
      + items        = [
          + {
##...

Do you want to perform these actions?
  Terraform will perform the actions described above.
  Only 'yes' will be accepted to approve.

  Enter a value: yes

hashicups_order.edu: Creating...
hashicups_order.edu: Creation complete after 0s [id=21]

Apply complete! Resources: 1 added, 0 changed, 0 destroyed.

Outputs:

edu_order = {
  "id" = "1"
  "items" = tolist([
    {
      "coffee" = {
        "description" = ""
        "id" = 3
        "image" = "/vault.png"
        "name" = "Vaulatte"
        "price" = 200
        "teaser" = "Nothing gives you a safe and secure feeling like a Vaulatte"
      }
      "quantity" = 2
    },
    {
      "coffee" = {
        "description" = ""
        "id" = 1
        "image" = "/hashicorp.png"
        "name" = "HCP Aeropress"
        "price" = 200
        "teaser" = "Automation in a cup"
      }
      "quantity" = 2
    },
  ])
  "last_updated" = "Thursday, 09-Feb-23 11:32:05 EST"
}
```

Copy

Once the apply completes, the provider saves the resource's details in Terraform's state. View the state by running `terraform state show <resource_name>`.

```shell-session
$ terraform state show hashicups_order.edu
# hashicups_order.edu:
resource "hashicups_order" "edu" {
    id           = "1"
    items        = [
      # (2 unchanged elements hidden)
    ]
    last_updated = "Thursday, 22-Jul-21 03:26:51 PDT"
}
```

Copy

The `(known after apply)` values in the execution plan during the terraform apply state have all been populated, since the order was successfully created.

Navigate to the `terraform-provider-hashicups-pf` directory.

```shell-session
$ cd ../..
```

Copy

### Verify order created

When you create an order in HashiCups using Terraform, the terminal containing your HashiCups logs will have recorded operations invoked by the HashiCups Provider. Switch to that terminal to review the log messages.

```shell-session
api_1  | 2021-07-22T10:26:31.179Z [INFO]  Handle User | signin
api_1  | 2021-07-22T10:26:51.179Z [INFO]  Handle User | signin
api_1  | 2021-07-22T10:26:51.195Z [INFO]  Handle Orders | CreateOrder
```

The provider invoked a total of 3 operations.

1. The provider invoked the first `signin` operation when you ran `terraform apply` to retrieve the current state of your resources. Because there are no resources, it only authenticates the user.
2. The provider invoked the second `signin` operation after you confirmed the apply run. The provider authenticated using the provided credentials to retrieve and save the JWT token.
3. The provider invoked the `CreateOrder` operation to create the order defined by the Terraform configuration. Since this is a protected endpoint, it used the saved JWT token from the prior `signin` operation.

Verify that Terraform created the order by retrieving the order details via the API.

```shell-session
$ curl -X GET  -H "Authorization: ${HASHICUPS_TOKEN}" localhost:19090/orders/1
{"id":1,"items":[{"coffee":{"id":3,"name":"Vaulatte","teaser":"Nothing gives you a safe and secure feeling like a Vaulatte","collection":"Foundations","origin":"Spring 2015","color":"#FFD814","description":"","price":200,"image":"/vault.png","ingredients":[{"ingredient_id":1},{"ingredient_id":2}]},"quantity":2},{"coffee":{"id":1,"name":"HCP Aeropress","teaser":"Automation in a cup","collection":"Foundations","origin":"Summer 2020","color":"#444","description":"","price":200,"image":"/hashicorp.png","ingredients":[{"ingredient_id":6}]},"quantity":2}]}
```

Copy

The order's properties should be the same as that of your `hashicups_order.edu` resource.

## Next steps

Congratulations! You have implemented the `order` resource with create and read capabilities.

If you were stuck during this tutorial, checkout the [`create-read-order`](https://github.com/hashicorp/terraform-provider-hashicups-pf/tree/create-read-order) branch to see the changes implemented in this tutorial.

- To learn more about the Terraform Plugin Framework, refer to the [Terraform Plugin Framework documentation](https://developer.hashicorp.com/terraform/plugin/framework).
- For a full capability comparison between the SDKv2 and the Plugin Framework, refer to the [Which SDK Should I Use? documentation](https://developer.hashicorp.com/terraform/plugin/which-sdk).
- The Terraform HashiCups (plugin-framework) provider's [`main` branch](https://github.com/hashicorp/terraform-provider-hashicups-pf) contains the complete HashiCups provider. It includes a resource written with the plugin framework and implements create, read, update and delete functionality for the order resource.
- Submit any Terraform Plugin Framework bug reports or feature requests to the development team in the [Terraform Plugin Framework Github repository](https://github.com/hashicorp/terraform-plugin-framework).
- Submit any Terraform Plugin Framework questions in the [Terraform Plugin Framework Discuss forum](https://discuss.hashicorp.com/c/terraform-providers/tf-plugin-sdk/43).