# 实现资源删除

## 实现 delete

provider 使用 `Delete` 方法删除现有资源

删除方法遵循以下步骤：

1. 从 state 中检索值
2. 删除现有订单

编辑文件 `internal/provider/order_resource.go`

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

更新 provider

```shell
$ go install .
```



## 验证 delete

导航到目录 `examples/order`

```shell
$ cd examples/order
```

执行 terraform destroy 将删除订单

```shell
$ terraform destroy -auto-approve
##...
Destroy complete! Resources: 1 destroyed.
```

通过 HashiCups API 验证提供商是否删除了订单

```shell
$ curl -X GET -H "Authorization: ${HASHICUPS_TOKEN}" localhost:19090/orders/1
{}
```

