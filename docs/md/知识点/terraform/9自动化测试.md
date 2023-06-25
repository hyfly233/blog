# 自动化测试

`terra-plugin-testing` Go 模块 `helper/resource` 包使 provider 能够实现自动化验收测试。测试框架建立在标准的 `go test` 命令功能之上，并调用实际的 Terraform 命令，如 `Terraform apply`、`Terraform import` 和 `Terraform destroy`。与手动测试不同，在运行自动化测试时，不必在代码更新上本地重新安装提供程序，也不必切换目录以使用预期的 Terraform 配置。



## 实现 data source id 属性

测试框架要求在每个 data source 和 resource 中都有一个 id 属性。为了在没有 ID 的 data source 和 resource 上运行测试，必须使用占位符值实现 ID 字段

编辑文件 `internal/provider/coffees_data_source.go`

使用以下命令向 Schema 方法添加 id 属性

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

在使用以下命令返回状态之前，在 data source 的 Read 方法的末尾附近设置一个占位符值

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



## 实施 data source 验收测试

Data source 验收测试用于验证从 API 读取后 Terraform state 包含的数据

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

创建一个新的 `internal/provider/coffees_data_source_test`，使用以下内容创建文件

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

## 

## 验证 data source 测试功能

使用 `TF_ACC` 环境变量运行测试

```shell
$ TF_ACC=1 go test -count=1 -v
=== RUN   TestAccCoffeesDataSource
--- PASS: TestAccCoffeesDataSource (1.23s)
PASS
ok      terraform-provider-hashicups-pf/internal/provider   2.120s
```



## 实现 resource 验收测试功能

资源验收测试用于验证整个资源生命周期，例如 `创建`、`读取`、`更新`和`删除`功能，以及导入能力。测试框架自动处理销毁测试资源并返回任何错误，作为最后一步，而不管是否显式地编写了销毁步骤。

创建一个新的 `internal/provider/order_resource_test`

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



## 验证 resource 测试功能

使用 `TF_ACC` 环境变量运行测试

```shell
$ TF_ACC=1 go test -count=1 -run='TestAccOrderResource' -v
=== RUN   TestAccOrderResource
--- PASS: TestAccOrderResource (2.01s)
PASS
ok      terraform-provider-hashicups-pf/internal/provider   2.754s
```

