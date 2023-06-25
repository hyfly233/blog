# 实现 resource 导入

1. 实现 resource 导入，此 import 方法从 `terraform import` 命令中获取给定的订单ID，并使terraform能够开始管理现有订单
2. 验证 import 功能



## 实现 import 功能

provider 使用 `ImportState` 方法导入现有资源，import 方法只有一个步骤：

1. 检索导入标识符并保存为属性状态。该方法将使用 `resource.ImportStatePassthroughID()` 函数从 `terraform import` 命令中检索 ID 值，并将其保存到 `ID` 属性中。

如果没有错误，Terraform 将自动调用资源的 `Read` 方法来导入 `Terraform state` 的其余部分。由于 `id` 属性是 `Read` 方法所必需的，因此不需要额外的实现

编辑文件 `internal/provider/order_resource.go`

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

// Ensure the implementation satisfies the expected interfaces.
var (
    _ resource.Resource                = &orderResource{}
    _ resource.ResourceWithConfigure   = &orderResource{}
    _ resource.ResourceWithImportState = &orderResource{}
)

func (r *orderResource) ImportState(ctx context.Context, req resource.ImportStateRequest, resp *resource.ImportStateResponse) {
    // Retrieve import ID and save to id attribute
    resource.ImportStatePassthroughID(ctx, path.Root("id"), req, resp)
}
```

生成 provider

```shell
$ go install .
```



## 验证 import 功能

导航到该目录。这包含 Terraform HashiCups 提供程序的示例 Terraform 配置。`examples/order`

```shell
$ cd examples/order
```

应用此配置以确保 HashiCups API 包含订单

```shell
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

从 Terraform state 检索订单 ID，将在下一步中使用此订单 ID 导入订单

```shell
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

从 Terraform state 中删除现有的订单，订单仍然存在于 HashiCups API 中

```shell
$ terraform state rm hashicups_order.edu
Removed hashicups_order.edu
Successfully removed 1 resource instance(s).
```

确认 Terraform state 不再包含订单资源。之前的 `edu_order` 输出值仍然保留。

```shell
$ terraform show

Outputs:

edu_order = {
    id           = "2"
    items        = [
##...
```

验证 HashiCups API 是否仍然有订单。如果需要，可以将 2 替换为 terraform show 命令输出的订单号

```shell
$ curl -X GET -H "Authorization: ${HASHICUPS_TOKEN}" localhost:19090/orders/2
```

将现有的 HashiCups API 订单导入 Terraform，将订单 ID 替换为你的订单 ID

```shell
$ terraform import hashicups_order.edu 2
hashicups_order.edu: Importing from ID "2"...
hashicups_order.edu: Import prepared!
  Prepared hashicups_order for import
hashicups_order.edu: Refreshing state... [id=2]

Import successful!

The resources that were imported are shown above. These resources are now in
your Terraform state and will henceforth be managed by Terraform.
```

再次验证 Terraform state 是否包含订单

```shell
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

