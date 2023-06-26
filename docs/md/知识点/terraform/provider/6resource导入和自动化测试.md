## 实现 resource 导入

resource 的 import 的方法，能从 `terraform import` 命令中获取给定的订单 id，使得 Terraform 能使用此订单 id 将对应的信息导入到 Terraform state 文件中



### 实现 import 功能

resource 使用 `ImportState` 方法导入现有资源，import 方法只有一个步骤：

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



### 验证 import 功能

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



## 自动化测试

Go 模块 `terra-plugin-testing` 中的  `helper/resource` 包能使 provider 实现自动化验收测试。测试框架建立在标准的 `go test` 命令功能之上，并调用实际的 Terraform 命令，如 `Terraform apply`、`Terraform import` 和 `Terraform destroy`。



### 实现 data source id 属性

测试框架要求在每个 data source 和 resource 中都有一个 id 属性。为了在没有 ID 的 data source 和 resource 上运行测试，必须使用占位符值实现 ID 字段

编辑文件 `internal/provider/coffees_data_source.go`

向 Schema 方法添加 id 属性

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

用下面的代码替换 `coffeesDataSourceModel` 数据源模型

```go
// coffeesDataSourceModel maps the data source schema data.
type coffeesDataSourceModel struct {
    Coffees []coffeesModel `tfsdk:"coffees"`
    ID      types.String   `tfsdk:"id"`
}
```

在 data source 的 Read 方法的末尾附近设置一个占位符值

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



### 实施 data source 验收测试

Data source 验收测试用于验证从 API 读取后 Terraform state 包含数据

大多数 provider 将在单个测试文件中管理一些共享实现详细信息，以简化 data source 和 resource 测试实现

编辑 `internal/provider/provider_test.go`

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

创建 `internal/provider/coffees_data_source_test`

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



### 验证 data source 测试功能

使用 `TF_ACC` 环境变量运行测试

```shell
$ TF_ACC=1 go test -count=1 -v
=== RUN   TestAccCoffeesDataSource
--- PASS: TestAccCoffeesDataSource (1.23s)
PASS
ok      terraform-provider-hashicups-pf/internal/provider   2.120s
```



### 实现 resource 验收测试功能

资源验收测试用于验证整个 resource 生命周期，例如 `create`、`read`、`update` 和 `delete` 功能，以及 import 功能。测试框架自动处理销毁测试资源并返回任何错误

创建 `internal/provider/order_resource_test`

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



### 验证 resource 测试功能

使用 `TF_ACC` 环境变量运行测试

```shell
$ TF_ACC=1 go test -count=1 -run='TestAccOrderResource' -v
=== RUN   TestAccOrderResource
--- PASS: TestAccOrderResource (2.01s)
PASS
ok      terraform-provider-hashicups-pf/internal/provider   2.754s
```

