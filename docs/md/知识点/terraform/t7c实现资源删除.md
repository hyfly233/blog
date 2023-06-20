# 实现资源删除

## 实现删除功能

提供程序使用该方法删除现有资源。`Delete`

删除方法遵循以下步骤：

1. **从状态中检索值。**该方法将尝试从状态中检索值并将其转换为结构（在 中定义）。`Order``models.go`
2. **删除现有订单。**该方法调用 API 客户端的方法。`DeleteOrder`

如果没有错误，框架将自动从 Terraform 的状态中删除资源。

打开文件。`internal/provider/order_resource.go`

将您的方法替换为以下内容。`Delete`



内部/提供商/order_resource.go

复制

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

生成并安装更新的提供程序。

```shell-session
$ go install .
```

复制

## 验证删除功能

导航到该目录。这包含 Terraform HashiCups 提供程序的示例 Terraform 配置。`examples/order`

```shell-session
$ cd examples/order
```

复制

销毁配置。这将删除您的订单。

```shell-session
$ terraform destroy -auto-approve
##...
Destroy complete! Resources: 1 destroyed.
```

复制

通过调用桥杯 API 验证提供商是否删除了您的订单。将订单号替换为您的订单 ID，将身份验证令牌替换为您的身份验证令牌。

```shell-session
$ curl -X GET -H "Authorization: ${HASHICUPS_TOKEN}" localhost:19090/orders/1
{}
```

复制

导航到该目录。`terraform-provider-hashicups-pf`

```shell-session
$ cd ../..
```

- 