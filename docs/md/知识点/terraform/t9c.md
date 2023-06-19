# 实施自动化测试

- 11分
- |
- 大地形态大地形态



经常引用这个？ [创建一个帐户](https://developer.hashicorp.com/sign-up)以书签教程。



在本教程中，您将向提供程序的数据源和资源添加自动验收测试功能，该提供程序与名为 HashiCups 的虚构咖啡店应用程序的 API 进行交互。为此，您将：

1. **实现数据源 ID 属性。**
   这可确保数据源与测试框架兼容。
2. **实施数据源验收测试。**
   这将自动执行数据源的端到端测试。
3. **运行数据源验收测试。**
   这可确保数据源测试按预期工作。
4. **实施资源验收测试。**
   这将自动执行资源的端到端测试。
5. **运行资源验收测试。**
   这可确保资源测试按预期工作。

Go 模块包使提供程序能够 实施自动化验收测试。测试框架建立在上面 标准命令功能并调用实际的 Terraform 命令， 如 、 和 。与 手动测试，您不必在本地重新安装代码上的提供程序 在以下情况下更新或切换目录以使用预期的 Terraform 配置 运行自动测试。`terraform-plugin-testing``helper/resource``go test``terraform apply``terraform import``terraform destroy`

## 先决条件

要学习本教程，您需要：

- [Go 1.19+](https://golang.org/doc/install) 已安装并配置。
- [Terraform v1.0.3+](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli) 本地安装。
- Docker 和 [Docker Compose](https://docs.docker.com/compose/install/) 以在本地运行 HashiCups 实例。

继续上一教程新设置

导航到您的目录。`terraform-provider-hashicups-pf`

您的代码应与示例存储库中的[`导入顺序`分支](https://github.com/hashicorp/terraform-provider-hashicups-pf/tree/import-order)匹配。

如果在本教程中的任何时间点遇到困难，请参阅分支以查看本教程中实现的更改。`acceptance-tests`

## 实现数据源 ID 属性

测试框架要求每个数据源和资源中都存在一个属性。若要对没有自己的 ID 的数据源和资源运行测试，必须实现具有占位符值的 ID 字段。`id`

打开文件。`internal/provider/coffees_data_source.go`

使用以下命令将属性添加到方法中。`id``Schema`



内部/提供商/coffees_data_source.go

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

将数据源模型替换为以下内容。`coffeesDataSourceModel`



内部/提供商/coffees_data_source.go

复制

```go
// coffeesDataSourceModel maps the data source schema data.
type coffeesDataSourceModel struct {
    Coffees []coffeesModel `tfsdk:"coffees"`
    ID      types.String   `tfsdk:"id"`
}
```

在数据源方法的末尾附近设置占位符值 在返回以下状态之前。`Read`



内部/提供商/coffees_data_source.go

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

## 实施数据源验收测试

数据源验收测试用于验证从 API 读取后 Terraform 状态是否包含数据。

大多数提供程序将在单个测试文件中管理一些共享实现详细信息，以简化数据源和资源测试实现。

导航到目录并删除示例基架测试文件。`internal/provider`

```shell-session
$ cd internal/provider && rm example_data_source_test.go; rm example_resource_test.go
```

复制

打开该文件并将现有代码替换为以下内容。`internal/provider/provider_test.go`



内部/提供商/provider_test.go

复制

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

使用以下方法创建一个新文件。`internal/provider/coffees_data_source_test.go`



internal/provider/coffees_data_source_test.go

复制

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

## Verify data source testing functionality

Now that you have implemented the testing functionality to the data source, you can run the tests.

Run Go testing with the environment variable set. The test framework will report that your data source's test passed.`TF_ACC`

```shell-session
$ TF_ACC=1 go test -count=1 -v
=== RUN   TestAccCoffeesDataSource
--- PASS: TestAccCoffeesDataSource (1.23s)
PASS
ok      terraform-provider-hashicups-pf/internal/provider   2.120s
```

复制

## 实现资源测试功能

资源验收测试用于验证整个资源生命周期， 例如、、、和功能，以及 导入功能。测试框架自动处理销毁测试 资源并返回任何错误作为最后一步，无论是否存在 是显式编写的销毁步骤。`Create``Read``Update``Delete`

使用以下方法创建一个新文件。`internal/provider/order_resource_test.go`



内部/提供商/order_resource_test.go

复制

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

## 验证资源测试功能

实现订单资源的测试功能后，请运行测试。

使用设置的环境变量运行 Go 测试，并且仅运行 资源测试。测试框架将报告资源的测试已通过。`TF_ACC`

```shell-session
$ TF_ACC=1 go test -count=1 -run='TestAccOrderResource' -v
=== RUN   TestAccOrderResource
--- PASS: TestAccOrderResource (2.01s)
PASS
ok      terraform-provider-hashicups-pf/internal/provider   2.754s
```

复制

导航到该目录。`terraform-provider-hashicups-pf`

```shell-session
$ cd ../..
```

复制

## 后续步骤

祝贺！您已通过验收测试增强了提供商 能力。

如果您在本教程中遇到困难，请查看[`验收测试`](https://github.com/hashicorp/terraform-provider-hashicups-pf/tree/acceptance-tests)分支以查看本教程中实现的更改。

- 了解有关 Terraform 插件的更多信息 框架，参考 [Terraform 插件框架 文档](https://developer.hashicorp.com/terraform/plugin/framework)。
- 有关 SDKv2 和插件框架之间的完整功能比较， 请参阅[我应该使用哪个 SDK？ 文档](https://developer.hashicorp.com/terraform/plugin/which-sdk)。
- The Terraform HashiCups （plugin-framework） 提供程序的主[``分支](https://github.com/hashicorp/terraform-provider-hashicups-pf)包含完整的 HashiCups 提供程序。它包括一个数据源 使用插件框架编写并实现创建、读取、更新和删除 订单资源的功能。
- 向 [Terraform 插件框架 Github 存储库](https://github.com/hashicorp/terraform-plugin-framework)中的开发团队提交任何 Terraform 插件框架错误报告或功能请求。
- 在 [Terraform 插件框架讨论论坛中提交任何 Terraform 插件框架](https://discuss.hashicorp.com/c/terraform-providers/tf-plugin-sdk/43)问题。