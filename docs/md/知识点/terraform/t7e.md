# Implement Resource Delete

- 7min
- |
- TerraformTerraform



Reference this often? [Create an account](https://developer.hashicorp.com/sign-up) to bookmark tutorials.



In this tutorial, you will add delete capabilities to the `order` resource of a provider that interacts with the API of a fictional coffee-shop application called Hashicups. To do this, you will:

1. **Implement resource delete.**
   This delete method uses the HashiCups API client to invoke a `DELETE` request to the `/orders/{orderId}` endpoint. After the delete is successful, the framework automatically removes the resource from Terraform's state.
2. **Verify delete functionality.**
   This ensures that the resource is working as expected.

## Prerequisites

To follow this tutorial, you need:

- [Go 1.19+](https://golang.org/doc/install) installed and configured.
- [Terraform v1.0.3+](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli) installed locally.
- [Docker](https://www.docker.com/products/docker-desktop) and [Docker Compose](https://docs.docker.com/compose/install/) to run an instance of HashiCups locally.

Continuing from previous tutorialNew set up

Navigate to your `terraform-provider-hashicups-pf` directory.

Your code should match the [`update-order` branch](https://github.com/hashicorp/terraform-provider-hashicups-pf/tree/update-order) from the example repository.

If you're stuck at any point during this tutorial, refer to the `delete-order` branch to see the changes implemented in this tutorial.

## Implement delete functionality

The provider uses the `Delete` method to delete an existing resource.

The delete method follows these steps:

1. **Retrieves values from the state.** The method will attempt to retrieve values from the state and convert it to an `Order` struct (defined in `models.go`).
2. **Deletes an existing order.** The method invokes the API client's `DeleteOrder` method.

If there are no errors, the framework will automatically remove the resource from Terraform's state.

Open the `internal/provider/order_resource.go` file.

Replace your `Delete` method with the following.



internal/provider/order_resource.go

Copy

```go
func (r *orderResource) Delete(ctx context.Context, req resource.DeleteRequest, resp *resource.DeleteResponse) {
// Retrieve values from state
    var state orderResourceModel
    diags := req.State.Get(ctx, &state)
    resp.Diagnostics.Append(diags...)
    if resp.Diagnostics.HasError() {
        return
    }

    // Delete existing order
    err := r.client.DeleteOrder(state.ID.ValueString())
    if err != nil {
        resp.Diagnostics.AddError(
            "Error Deleting HashiCups Order",
            "Could not delete order, unexpected error: "+err.Error(),
        )
        return
    }
}
```

Build and install the updated provider.

```shell-session
$ go install .
```

Copy

## Verify delete functionality

Navigate to the `examples/order` directory. This contains a sample Terraform configuration for the Terraform HashiCups provider.

```shell-session
$ cd examples/order
```

Copy

Destroy the configuration. This will delete your order.

```shell-session
$ terraform destroy -auto-approve
##...
Destroy complete! Resources: 1 destroyed.
```

Copy

Verify that the provider deleted your order by invoking the HashiCups API. Substitute the order number with your order ID and the auth token with your auth token.

```shell-session
$ curl -X GET -H "Authorization: ${HASHICUPS_TOKEN}" localhost:19090/orders/1
{}
```

Copy

Navigate to the `terraform-provider-hashicups-pf` directory.

```shell-session
$ cd ../..
```

Copy

## Next steps

Congratulations! You have enhanced the `order` resource with delete capabilities.

If you were stuck during this tutorial, checkout the [`delete-order`](https://github.com/hashicorp/terraform-provider-hashicups-pf/tree/delete-order) branch to see the changes implemented in this tutorial.

- To learn more about the Terraform Plugin Framework, refer to the [Terraform Plugin Framework documentation](https://developer.hashicorp.com/terraform/plugin/framework).
- For a full capability comparison between the SDKv2 and the Plugin Framework, refer to the [Which SDK Should I Use? documentation](https://developer.hashicorp.com/terraform/plugin/which-sdk).
- The Terraform HashiCups (plugin-framework) provider's [`main` branch](https://github.com/hashicorp/terraform-provider-hashicups-pf) contains the complete HashiCups provider. It includes a data source written with the plugin framework and implements create, read, update and delete functionality for the order resource.
- Submit any Terraform Plugin Framework bug reports or feature requests to the development team in the [Terraform Plugin Framework Github repository](https://github.com/hashicorp/terraform-plugin-framework).
- Submit any Terraform Plugin Framework questions in the [Terraform Plugin Framework Discuss forum](https://discuss.hashicorp.com/c/terraform-providers/tf-plugin-sdk/43).