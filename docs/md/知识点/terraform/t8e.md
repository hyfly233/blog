# Implement Resource Import

- 8min
- |
- TerraformTerraform



Reference this often? [Create an account](https://developer.hashicorp.com/sign-up) to bookmark tutorials.



In this tutorial, you will add import capabilities to the resource of a provider that interacts with the API of a fictional coffee-shop application called Hashicups. To do this, you will:`order`

1. **Implement resource import.**
   This import method takes the given order ID from the command and enables Terraform to begin managing the existing order.`terraform import`
2. **Verify import functionality.**
   This ensures that resource import functionality is working as expected.

## Prerequisites

To follow this tutorial, you need:

- [Go 1.19+](https://golang.org/doc/install) installed and configured.
- [Terraform v1.0.3+](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli) installed locally.
- [Docker](https://www.docker.com/products/docker-desktop) and [Docker Compose](https://docs.docker.com/compose/install/) to run an instance of HashiCups locally.

Continuing from previous tutorialNew set up

Navigate to your directory.`terraform-provider-hashicups-pf`

Your code should match the [`delete-order` branch](https://github.com/hashicorp/terraform-provider-hashicups-pf/tree/delete-order) from the example repository.

If you're stuck at any point during this tutorial, refer to the branch to see the changes implemented in this tutorial.`import-order`

## Implement import functionality

The provider uses the method to import an existing resource.`ImportState`

The import method implements a single step:

1. **Retrieves import identifier and saves to attribute state.** The method will use the function to retrieve the ID value from the command and save it to the attribute.`resource.ImportStatePassthroughID()``terraform import``id`

If there are no errors, Terraform will automatically call the resource's method to import the rest of the Terraform state. Since the attribute is all that is necessary for the method to work, no additional implementation is required.`Read``id``Read`

Open the file.`internal/provider/order_resource.go`

Add a new method to implement importing the resource in with the following.`ImportState``order_resource.go`



internal/provider/order_resource.go

Copy

```go
func (r *orderResource) ImportState(ctx context.Context, req resource.ImportStateRequest, resp *resource.ImportStateResponse) {
    // Retrieve import ID and save to id attribute
    resource.ImportStatePassthroughID(ctx, path.Root("id"), req, resp)
}
```

Add the required libraries by replacing the statement at the beginning of the file with the following.`import`



internal/provider/order_resource.go

Copy

```go
import (
    "context"
    "fmt"
    "strconv"
    "time"

    "github.com/hashicorp-demoapp/hashicups-client-go"
    "github.com/hashicorp/terraform-plugin-framework/path"
    "github.com/hashicorp/terraform-plugin-framework/resource"
    "github.com/hashicorp/terraform-plugin-framework/resource/schema"
    "github.com/hashicorp/terraform-plugin-framework/resource/schema/planmodifier"
    "github.com/hashicorp/terraform-plugin-framework/resource/schema/stringplanmodifier"
    "github.com/hashicorp/terraform-plugin-framework/types"
)
```

Replace the statement with the following to ensure that your resource implements the interface from the Framework.`var``ResourceWithImportState`



internal/provider/order_resource.go

Copy

```go
// Ensure the implementation satisfies the expected interfaces.
var (
    _ resource.Resource                = &orderResource{}
    _ resource.ResourceWithConfigure   = &orderResource{}
    _ resource.ResourceWithImportState = &orderResource{}
)
```

Build and install the updated provider.

```shell-session
$ go install .
```

Copy

## Verify import functionality

Navigate to the directory. This contains a sample Terraform configuration for the Terraform HashiCups provider.`examples/order`

```shell-session
$ cd examples/order
```

Copy

Apply this configuration to ensure that the HashiCups API contains an order.

```shell-session
$ terraform apply -auto-approve
##...
Apply complete! Resources: 1 added, 0 changed, 0 destroyed.

Outputs:

edu_order = {
  "id" = "2"
  "items" = tolist([
    {
##...
```

Copy

Retrieve the order ID from the Terraform state. You will use this order ID to import the order in the next step.

```shell-session
$ terraform show
# hashicups_order.edu:
resource "hashicups_order" "edu" {
    id           = "2"
    items        = [
        # (2 unchanged elements hidden)
    ]
    last_updated = "Wednesday, 14-Dec-22 11:18:20 CST"
}
##...
```

Copy

Remove the existing order from Terraform's state. The order will still exist in the HashiCups API.

```shell-session
$ terraform state rm hashicups_order.edu
Removed hashicups_order.edu
Successfully removed 1 resource instance(s).
```

Copy

Verify that the Terraform state no longer contains the order resource. The previous output value will still remain.`edu_order`

```shell-session
$ terraform show

Outputs:

edu_order = {
    id           = "2"
    items        = [
##...
```

Copy

Verify that the HashiCups API still has your order. If needed, replace with the order ID from the output of the command.`2``terraform show`

```shell-session
$ curl -X GET -H "Authorization: ${HASHICUPS_TOKEN}" localhost:19090/orders/2
```

Copy

Import the existing HashiCups API order into Terraform. Replace the order ID with your order ID.

```shell-session
$ terraform import hashicups_order.edu 2
hashicups_order.edu: Importing from ID "2"...
hashicups_order.edu: Import prepared!
  Prepared hashicups_order for import
hashicups_order.edu: Refreshing state... [id=2]

Import successful!

The resources that were imported are shown above. These resources are now in
your Terraform state and will henceforth be managed by Terraform.
```

Copy

Verify that the Terraform state contains the order again.

```shell-session
$ terraform show
# hashicups_order.edu:
resource "hashicups_order" "edu" {
    id    = "2"
    items = [
        # (2 unchanged elements hidden)
    ]
}

##...
```

Copy

Navigate to the directory.`terraform-provider-hashicups-pf`

```shell-session
$ cd ../..
```

Copy

## Next steps

Congratulations! You have enhanced the resource with import capabilities.`order`

If you were stuck during this tutorial, checkout the [`import-order`](https://github.com/hashicorp/terraform-provider-hashicups-pf/tree/import-order) branch to see the changes implemented in this tutorial.

- To learn more about the Terraform Plugin Framework, refer to the [Terraform Plugin Framework documentation](https://developer.hashicorp.com/terraform/plugin/framework).
- For a full capability comparison between the SDKv2 and the Plugin Framework, refer to the [Which SDK Should I Use? documentation](https://developer.hashicorp.com/terraform/plugin/which-sdk).
- The Terraform HashiCups (plugin-framework) provider's [`main` branch](https://github.com/hashicorp/terraform-provider-hashicups-pf) contains the complete HashiCups provider. It includes a data source written with the plugin framework and implements create, read, update and delete functionality for the order resource.
- Submit any Terraform Plugin Framework bug reports or feature requests to the development team in the [Terraform Plugin Framework Github repository](https://github.com/hashicorp/terraform-plugin-framework).
- Submit any Terraform Plugin Framework questions in the [Terraform Plugin Framework Discuss forum](https://discuss.hashicorp.com/c/terraform-providers/tf-plugin-sdk/43).