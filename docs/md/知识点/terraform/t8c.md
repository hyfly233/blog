# 实现资源导入

- 8分
- |
- 大地形态大地形态



经常引用这个？ [创建一个帐户](https://developer.hashicorp.com/sign-up)以书签教程。



在本教程中，您将向提供程序的资源添加导入功能，该提供程序与名为 Hashicups 的虚构咖啡店应用程序的 API 进行交互。为此，您将：`order`

1. **实现资源导入。**
   此导入方法从命令中获取给定的订单 ID，并使 Terraform 能够开始管理现有订单。`terraform import`
2. **验证导入功能。**
   这可确保资源导入功能按预期工作。

## 先决条件

要学习本教程，您需要：

- [Go 1.19+](https://golang.org/doc/install) 已安装并配置。
- [Terraform v1.0.3+](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli) 本地安装。
- Docker 和 [Docker Compose](https://docs.docker.com/compose/install/) 以在本地运行 HashiCups 实例。

继续上一教程新设置

导航到您的目录。`terraform-provider-hashicups-pf`

您的代码应与示例存储库中的[`删除顺序`分支](https://github.com/hashicorp/terraform-provider-hashicups-pf/tree/delete-order)匹配。

如果在本教程中的任何时间点遇到困难，请参阅分支以查看本教程中实现的更改。`import-order`

## 实现导入功能

提供程序使用该方法导入现有资源。`ImportState`

导入方法实现单个步骤：

1. **检索导入标识符并保存到属性状态。**该方法将使用该函数从命令中检索 ID 值并将其保存到属性中。`resource.ImportStatePassthroughID()``terraform import``id`

如果没有错误，Terraform 将自动调用资源的方法导入 Terraform 状态的其余部分。由于该属性是方法工作所需的全部属性，因此不需要其他实现。`Read``id``Read`

打开文件。`internal/provider/order_resource.go`

添加一个新方法，通过以下内容实现导入资源。`ImportState``order_resource.go`



内部/提供商/order_resource.go

复制

```go
func (r *orderResource) ImportState(ctx context.Context, req resource.ImportStateRequest, resp *resource.ImportStateResponse) {
    // Retrieve import ID and save to id attribute
    resource.ImportStatePassthroughID(ctx, path.Root("id"), req, resp)
}
```

通过将文件开头的语句替换为以下内容来添加所需的库。`import`



内部/提供商/order_resource.go

复制

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

将该语句替换为以下内容，以确保资源从框架实现接口。`var``ResourceWithImportState`



内部/提供商/order_resource.go

复制

```go
// Ensure the implementation satisfies the expected interfaces.
var (
    _ resource.Resource                = &orderResource{}
    _ resource.ResourceWithConfigure   = &orderResource{}
    _ resource.ResourceWithImportState = &orderResource{}
)
```

生成并安装更新的提供程序。

```shell-session
$ go install .
```

复制

## 验证导入功能

导航到该目录。这包含 Terraform HashiCups 提供程序的示例 Terraform 配置。`examples/order`

```shell-session
$ cd examples/order
```

复制

应用此配置以确保桥杯 API 包含订单。

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

复制

从地形状态检索订单 ID。您将在下一步中使用此订单 ID 导入订单。

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

复制

从 Terraform 的状态中删除现有订单。该顺序仍将存在于HashiCups API中。

```shell-session
$ terraform state rm hashicups_order.edu
Removed hashicups_order.edu
Successfully removed 1 resource instance(s).
```

复制

验证地形状态是否不再包含订单资源。这 以前的输出值仍将保留。`edu_order`

```shell-session
$ terraform show

Outputs:

edu_order = {
    id           = "2"
    items        = [
##...
```

复制

验证桥杯 API 是否仍有您的订单。如果需要，请替换为 命令输出中的订单 ID。`2``terraform show`

```shell-session
$ curl -X GET -H "Authorization: ${HASHICUPS_TOKEN}" localhost:19090/orders/2
```

复制

将现有的HashiCups API订单导入Terraform。将订单 ID 替换为您的订单 ID。

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

复制

再次验证地形状态是否包含该顺序。

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

复制

导航到该目录。`terraform-provider-hashicups-pf`

```shell-session
$ cd ../..
```

复制

## 后续步骤

祝贺！您已通过导入增强了资源 能力。`order`

如果在本教程中遇到困难，请查看[`导入顺序`](https://github.com/hashicorp/terraform-provider-hashicups-pf/tree/import-order)分支以查看本教程中实现的更改。

- 了解有关 Terraform 插件的更多信息 框架，参考 [Terraform 插件框架 文档](https://developer.hashicorp.com/terraform/plugin/framework)。
- 有关 SDKv2 和插件框架之间的完整功能比较， 请参阅[我应该使用哪个 SDK？ 文档](https://developer.hashicorp.com/terraform/plugin/which-sdk)。
- The Terraform HashiCups （plugin-framework） 提供程序的主[``分支](https://github.com/hashicorp/terraform-provider-hashicups-pf)包含完整的 HashiCups 提供程序。它包括一个数据源 使用插件框架编写并实现创建、读取、更新和删除 订单资源的功能。
- 向 [Terraform 插件框架 Github 存储库](https://github.com/hashicorp/terraform-plugin-framework)中的开发团队提交任何 Terraform 插件框架错误报告或功能请求。
- 在 [Terraform 插件框架讨论论坛中提交任何 Terraform 插件框架](https://discuss.hashicorp.com/c/terraform-providers/tf-plugin-sdk/43)问题。