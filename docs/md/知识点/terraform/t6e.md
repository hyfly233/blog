# Implement Resource Update

- 12min
- |
- TerraformTerraform



Reference this often? [Create an account](https://developer.hashicorp.com/sign-up) to bookmark tutorials.



In this tutorial, you will add update capabilities to the resource of a provider that interacts with the API of a fictional coffee-shop application called Hashicups. To do this, you will:`order`

1. **Verify your schema and model.**
   Verify the attribute is in the resource schema and model. The provider will update this attribute to the current date time whenever the order resource is updated.`last_updated``order`
2. **Implement resource update.**
   This update method uses the HashiCups client library to invoke a request to the endpoint with the updated order items in the request body. After the update is successful, it updates the resource's state.`PUT``/orders/{orderId}`
3. **Enhance plan output with plan modifier.**
   This clarifies the plan output of the attribute to remove its difference by keeping the existing state value on updates.`id`
4. **Verify update functionality.**
   This ensures the resource is working as expected.

## Prerequisites

To follow this tutorial, you need:

- [Go 1.19+](https://golang.org/doc/install) installed and configured.
- [Terraform v1.0.3+](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli) installed locally.
- [Docker](https://www.docker.com/products/docker-desktop) and [Docker Compose](https://docs.docker.com/compose/install/) to run an instance of HashiCups locally.

Continuing from previous tutorialNew set up

Navigate to your directory.`terraform-provider-hashicups-pf`

Your code should match the [`create-read-order` branch](https://github.com/hashicorp/terraform-provider-hashicups-pf/tree/create-read-order) from the example repository.

If you're stuck at any point during this tutorial, refer to the branch to see the changes implemented in this tutorial.`update-order`

## Verify schema and model

Verify your method includes an attribute named .`Schema``last_updated`



internal/provider/order_resource.go

```go
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
                // ...
```

Verify that your type includes a field to handle the attribute.`orderResourceModel``last_updated`



internal/provider/order_resource.go

```go
type orderResourceModel struct {
    ID          types.String     `tfsdk:"id"`
    Items       []orderItemModel `tfsdk:"items"`
    LastUpdated types.String     `tfsdk:"last_updated"`
}
```

## Implement update functionality

The provider uses the method to update an existing resource based on the schema data.`Update`

The update method follows these steps:

1. **Retrieves values from the plan.** The method will attempt to retrieve values from the plan and convert it to an . The model includes the order's attribute, which specifies which order to update.`orderResourceModel``id`
2. **Generates an API request body from the plan values.** The method loops through each plan item and maps it to a . This is what the API client needs to update an existing order.`hashicups.OrderItem`
3. **Updates the order.** The method invokes the API client's method with the order's ID and OrderItems.`UpdateOrder`
4. **Maps the response body to resource schema attributes.** After the method updates the order, it maps the response to so the provider can update the Terraform state.`hashicups.Order``[]OrderItem`
5. **Sets the LastUpdated attribute.** The method sets the Order's LastUpdated attribute to the current system time.
6. **Sets Terraform's state with the updated order.**

Open the file.`internal/provider/order_resource.go`

Replace your Order resource's method in with the following.`Update``order_resource.go`



internal/provider/order_resource.go

Copy

```go
func (r *orderResource) Update(ctx context.Context, req resource.UpdateRequest, resp *resource.UpdateResponse) {
    // Retrieve values from plan
    var plan orderResourceModel
    diags := req.Plan.Get(ctx, &plan)
    resp.Diagnostics.Append(diags...)
    if resp.Diagnostics.HasError() {
        return
    }

    // Generate API request body from plan
    var hashicupsItems []hashicups.OrderItem
    for _, item := range plan.Items {
        hashicupsItems = append(hashicupsItems, hashicups.OrderItem{
            Coffee: hashicups.Coffee{
                ID: int(item.Coffee.ID.ValueInt64()),
            },
            Quantity: int(item.Quantity.ValueInt64()),
        })
    }

    // Update existing order
    _, err := r.client.UpdateOrder(plan.ID.ValueString(), hashicupsItems)
    if err != nil {
        resp.Diagnostics.AddError(
            "Error Updating HashiCups Order",
            "Could not update order, unexpected error: "+err.Error(),
        )
        return
    }

    // Fetch updated items from GetOrder as UpdateOrder items are not
    // populated.
    order, err := r.client.GetOrder(plan.ID.ValueString())
    if err != nil {
        resp.Diagnostics.AddError(
            "Error Reading HashiCups Order",
            "Could not read HashiCups order ID "+plan.ID.ValueString()+": "+err.Error(),
        )
        return
    }

    // Update resource state with updated items and timestamp
    plan.Items = []orderItemModel{}
    for _, item := range order.Items {
        plan.Items = append(plan.Items, orderItemModel{
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
    plan.LastUpdated = types.StringValue(time.Now().Format(time.RFC850))

    diags = resp.State.Set(ctx, plan)
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

## Verify update functionality

Navigate to the directory. This contains a sample Terraform configuration for the Terraform HashiCups provider.`examples/order`

```shell-session
$ cd examples/order
```

Copy

Replace your resource in . This configuration changes the drinks and quantities in the order.`hashicups_order.edu``examples/order/main.tf`



examples/order/main.tf

Copy

```go
resource "hashicups_order" "edu" {
  items = [{
    coffee = {
      id = 3
    }
    quantity = 2
    },
    {
      coffee = {
        id = 2
      }
      quantity = 3
  }]
}
```

Plan the configuration.

```shell-session
$ terraform plan
hashicups_order.edu: Refreshing state... [id=1]

Terraform used the selected providers to generate the following execution plan. Resource actions are indicated with the following symbols:
  ~ update in-place

Terraform will perform the following actions:

  # hashicups_order.edu will be updated in-place
  ~ resource "hashicups_order" "edu" {
      ~ id           = "1" -> (known after apply)
      ~ items        = [
          ~ {
              ~ coffee   = {
                  + description = (known after apply)
                    id          = 3
                  ~ image       = "/vault.png" -> (known after apply)
                  ~ name        = "Vaulatte" -> (known after apply)
                  ~ price       = 200 -> (known after apply)
                  ~ teaser      = "Nothing gives you a safe and secure feeling like a Vaulatte" -> (known after apply)
                }
                # (1 unchanged attribute hidden)
            },
          ~ {
              ~ coffee   = {
                  + description = (known after apply)
                  ~ id          = 1 -> 2
                  ~ image       = "/hashicorp.png" -> (known after apply)
                  ~ name        = "HCP Aeropress" -> (known after apply)
                  ~ price       = 200 -> (known after apply)
                  ~ teaser      = "Automation in a cup" -> (known after apply)
                }
              ~ quantity = 2 -> 3
            },
        ]
      ~ last_updated = "Thursday, 09-Feb-23 11:32:05 EST" -> (known after apply)
    }

Plan: 0 to add, 1 to change, 0 to destroy.
```

Copy

Note that the attribute is showing a plan difference where the value is going from the known value to an unknown value ().`id``(known after apply)`

```mdx-code-blocks_codeBlockMargin__TI7B4
      ~ id           = "1" -> (known after apply)
```

Copy

During updates, this attribute value is not expected to change. To prevent practitioner confusion, in the next section you will update the attribute's definition to keep the existing state value on update.`id`

## Enhance plan output

Terraform Plugin Framework attributes which are not configurable and that should not show updates from the existing state value should implement the plan modifier.`UseStateForUnknown()`

Open the file.`internal/provider/order_resource.go`

Replace the attribute definition in the method with the following.`id``Schema`



internal/provider/order_resource.go

Copy

```go
            "id": schema.StringAttribute{
                Computed: true,
                PlanModifiers: []planmodifier.String{
                    stringplanmodifier.UseStateForUnknown(),
                },
            },
```

Replace the statement with the following.`import`



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
    "github.com/hashicorp/terraform-plugin-framework/resource/schema/planmodifier"
    "github.com/hashicorp/terraform-plugin-framework/resource/schema/stringplanmodifier"
    "github.com/hashicorp/terraform-plugin-framework/types"
)
```

In your terminal, navigate to the directory.`terraform-provider-hashicups-pf`

```shell-session
cd ../..
```

Copy

Build and install the updated provider.

```shell-session
go install .
```

Copy

## Verify update functionality

Navigate back to the directory.`examples/order`

```shell-session
cd examples/order
```

Copy

Run a Terraform apply to update your order. The plan will not mark the attribute as any longer. Your provider will update your order and set a new value for the attribute.`id``(known after apply)``last_updated`

```shell-session
$ terraform apply -auto-approve
##...

Apply complete! Resources: 0 added, 1 changed, 0 destroyed.

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
        "id" = 2
        "image" = "/packer.png"
        "name" = "Packer Spiced Latte"
        "price" = 350
        "teaser" = "Packed with goodness to spice up your images"
      }
      "quantity" = 3
    },
  ])
  "last_updated" = "Thursday, 09-Feb-23 11:39:35 EST"
}
```

Copy

Verify that the provider updated your order by invoking the HashiCups API.

```shell-session
$ curl -X GET -H "Authorization: ${HASHICUPS_TOKEN}" localhost:19090/orders/1
{"id":1,"items":[{"coffee":{"id":3,"name":"Vaulatte","teaser":"Nothing gives you a safe and secure feeling like a Vaulatte","collection":"Foundations","origin":"Spring 2015","color":"#FFD814","description":"","price":200,"image":"/vault.png","ingredients":[{"ingredient_id":1},{"ingredient_id":2}]},"quantity":2},{"coffee":{"id":2,"name":"Packer Spiced Latte","teaser":"Packed with goodness to spice up your images","collection":"Origins","origin":"Summer 2013","color":"#1FA7EE","description":"","price":350,"image":"/packer.png","ingredients":[{"ingredient_id":1},{"ingredient_id":2},{"ingredient_id":4}]},"quantity":3}]}%
```

Copy

This is the same API call that your Terraform provider made to update your order's state.

Navigate back to the directory.`terraform-provider-hashicups-pf`

```shell-session
$ cd ../..
```

Copy

## Next steps

Congratulations! You have enhanced the resource with update capabilities.`order`

If you were stuck during this tutorial, checkout the [`update-order`](https://github.com/hashicorp/terraform-provider-hashicups-pf/tree/update-order) branch to see the changes implemented in this tutorial.

- To learn more about the Terraform Plugin Framework, refer to the [Terraform Plugin Framework documentation](https://developer.hashicorp.com/terraform/plugin/framework).
- For a full capability comparison between the SDKv2 and the Plugin Framework, refer to the [Which SDK Should I Use? documentation](https://developer.hashicorp.com/terraform/plugin/which-sdk).
- The Terraform HashiCups (plugin-framework) provider's [`main` branch](https://github.com/hashicorp/terraform-provider-hashicups-pf) contains the complete HashiCups provider. It includes a data source written with the plugin framework and implements create, read, update and delete functionality for the order resource.
- Submit any Terraform Plugin Framework bug reports or feature requests to the development team in the [Terraform Plugin Framework Github repository](https://github.com/hashicorp/terraform-plugin-framework).
- Submit any Terraform Plugin Framework questions in the [Terraform Plugin Framework Discuss forum](https://discuss.hashicorp.com/c/terraform-providers/tf-plugin-sdk/43).