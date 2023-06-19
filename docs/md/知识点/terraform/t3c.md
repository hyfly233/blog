# 实现数据源

- 12分
- |
- 大地形态大地形态



经常引用这个？ [创建一个帐户](https://developer.hashicorp.com/sign-up)以书签教程。



在本教程中，您将实现一个数据源，以从 HashiCups API 读取咖啡列表，并将其保存在 Terraform 的状态中。为此，您将：

1. **定义初始数据源类型。**
   这将准备要添加到提供程序的数据源。
2. **将数据源添加到提供程序。**
   这将启用数据源进行测试和 Terraform 配置使用。
3. **在数据源中实现 HashiCups 客户端。**
   这会从提供程序检索配置的 HashiCups 客户端，并使其可用于数据源操作。
4. **定义数据源架构。**
   这会准备数据源以使用咖啡列表设置 Terraform 状态。
5. **定义数据源数据模型。**
   这会将数据源架构建模为 Go 类型，以便其他 Go 代码可以访问数据。
6. **定义数据源读取逻辑。**
   这将处理使用配置的客户端调用 HashiCups API 并使用数据设置 Terraform 状态。
7. **验证数据源行为。**
   这可确保预期的数据源行为。

## 先决条件

要学习本教程，您需要：

- [Go 1.19+](https://golang.org/doc/install) 已安装并配置。
- [Terraform v1.0.3+](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli) 本地安装。
- 码头[工人](https://www.docker.com/products/docker-desktop)和[码头工人 撰写](https://docs.docker.com/compose/install/)以运行 本地桥杯。

继续上一教程新设置

导航到您的目录。`terraform-provider-hashicups-pf`

您的代码应与示例存储库中的[`提供程序配置`分支](https://github.com/hashicorp/terraform-provider-hashicups-pf/tree/provider-configure)匹配。

## 实现初始数据源类型

若要向提供程序添加新数据源，请首先创建一个类型 实现接口。`datasource.DataSource`

此接口需要满足以下条件：

1. **元数据方法。**这将定义数据源类型名称，这是在 Terraform 配置中引用数据源的方式。
2. **架构方法。**这将定义任何数据源配置和状态数据的架构。
3. **读取方法。**这将定义为数据源设置 Terraform 状态的逻辑。

添加一个新数据源，该数据源将从桥杯加载有关咖啡饮料的数据 通过创建具有以下内容的文件来提供 API。`internal/provider/coffees_data_source.go`



内部/提供商/coffees_data_source.go

复制

```go
package provider

import (
    "context"

    "github.com/hashicorp/terraform-plugin-framework/datasource"
    "github.com/hashicorp/terraform-plugin-framework/datasource/schema"
)

// Ensure the implementation satisfies the expected interfaces.
var (
    _ datasource.DataSource = &coffeesDataSource{}
)

// NewCoffeesDataSource is a helper function to simplify the provider implementation.
func NewCoffeesDataSource() datasource.DataSource {
    return &coffeesDataSource{}
}

// coffeesDataSource is the data source implementation.
type coffeesDataSource struct{}

// Metadata returns the data source type name.
func (d *coffeesDataSource) Metadata(_ context.Context, req datasource.MetadataRequest, resp *datasource.MetadataResponse) {
    resp.TypeName = req.ProviderTypeName + "_coffees"
}

// Schema defines the schema for the data source.
func (d *coffeesDataSource) Schema(_ context.Context, _ datasource.SchemaRequest, resp *datasource.SchemaResponse) {
    resp.Schema = schema.Schema{}
}

// Read refreshes the Terraform state with the latest data.
func (d *coffeesDataSource) Read(ctx context.Context, req datasource.ReadRequest, resp *datasource.ReadResponse) {
}
```

## 将数据源添加到提供程序

提供程序使用该方法定义其数据源 实现。`DataSources`

打开文件。`internal/provider/provider.go`

通过将方法替换为 以后。`DataSources`



internal/provider/provider.go

复制

```go
// DataSources defines the data sources implemented in the provider.
func (p *hashicupsProvider) DataSources(_ context.Context) []func() datasource.DataSource {
    return []func() datasource.DataSource {
        NewCoffeesDataSource,
    }
}
```

## 实现数据源客户端功能

数据源使用可选方法从提供程序提取配置的客户端。提供程序配置 HashiCups 客户端，数据源可以保存对该客户端的引用以用于其操作。`Configure`

打开文件。`internal/provider/coffees_data_source.go`

允许数据源类型通过以下方式存储对 HashiCups 客户端的引用 将类型替换为以下内容。`coffeesDataSource`



内部/提供商/coffees_data_source.go

复制

```go
// coffeesDataSource is the data source implementation.
type coffeesDataSource struct {
    client *hashicups.Client
}
```

将文件开头的语句替换为以下内容。`import`



内部/提供商/coffees_data_source.go

复制

```go
import (
       "context"

       "github.com/hashicorp-demoapp/hashicups-client-go"
       "github.com/hashicorp/terraform-plugin-framework/datasource"
       "github.com/hashicorp/terraform-plugin-framework/datasource/schema"
)
```

确保您的数据源实现了接口 将语句替换为以下内容。`DataSourceWithConfigure``var ( ... )`



内部/提供商/coffees_data_source.go

复制

```go
// Ensure the implementation satisfies the expected interfaces.
var (
    _ datasource.DataSource              = &coffeesDataSource{}
    _ datasource.DataSourceWithConfigure = &coffeesDataSource{}
)
```

通过将方法添加到 数据源类型。`Configure`



内部/提供商/coffees_data_source.go

复制

```go
// Configure adds the provider configured client to the data source.
func (d *coffeesDataSource) Configure(_ context.Context, req datasource.ConfigureRequest, resp *datasource.ConfigureResponse) {
    if req.ProviderData == nil {
        return
    }

    client, ok := req.ProviderData.(*hashicups.Client)
    if !ok {
        resp.Diagnostics.AddError(
            "Unexpected Data Source Configure Type",
            fmt.Sprintf("Expected *hashicups.Client, got: %T. Please report this issue to the provider developers.", req.ProviderData),
        )

        return
    }

    d.client = client
}
```

## 实现数据源架构

数据源使用该方法定义可接受的配置和状态属性名称和类型。咖啡数据源需要将具有各种属性的咖啡列表保存到状态。`Schema`

将数据源的方法替换为以下内容。`Schema`



内部/提供商/coffees_data_source.go

复制

```go
// Schema defines the schema for the data source.
func (d *coffeesDataSource) Schema(_ context.Context, _ datasource.SchemaRequest, resp *datasource.SchemaResponse) {
    resp.Schema = schema.Schema{
        Attributes: map[string]schema.Attribute{
            "coffees": schema.ListNestedAttribute{
                Computed: true,
                NestedObject: schema.NestedAttributeObject{
                    Attributes: map[string]schema.Attribute{
                        "id": schema.Int64Attribute{
                            Computed: true,
                        },
                        "name": schema.StringAttribute{
                            Computed: true,
                        },
                        "teaser": schema.StringAttribute{
                            Computed: true,
                        },
                        "description": schema.StringAttribute{
                            Computed: true,
                        },
                        "price": schema.Float64Attribute{
                            Computed: true,
                        },
                        "image": schema.StringAttribute{
                            Computed: true,
                        },
                        "ingredients": schema.ListNestedAttribute{
                            Computed: true,
                            NestedObject: schema.NestedAttributeObject{
                                Attributes: map[string]schema.Attribute{
                                    "id": schema.Int64Attribute{
                                        Computed: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    }
}
```

## 实现数据源数据模型

使用以下方法将数据模型类型添加到数据源。



内部/提供商/coffees_data_source.go

复制

```go
// coffeesDataSourceModel maps the data source schema data.
type coffeesDataSourceModel struct {
    Coffees []coffeesModel `tfsdk:"coffees"`
}

// coffeesModel maps coffees schema data.
type coffeesModel struct {
    ID          types.Int64               `tfsdk:"id"`
    Name        types.String              `tfsdk:"name"`
    Teaser      types.String              `tfsdk:"teaser"`
    Description types.String              `tfsdk:"description"`
    Price       types.Float64             `tfsdk:"price"`
    Image       types.String              `tfsdk:"image"`
    Ingredients []coffeesIngredientsModel `tfsdk:"ingredients"`
}

// coffeesIngredientsModel maps coffee ingredients data
type coffeesIngredientsModel struct {
    ID types.Int64 `tfsdk:"id"`
}
```

将文件开头的语句替换为以下内容。`import`



内部/提供商/coffees_data_source.go

复制

```go
import (
    "context"
    "fmt"

    "github.com/hashicorp-demoapp/hashicups-client-go"
    "github.com/hashicorp/terraform-plugin-framework/datasource"
    "github.com/hashicorp/terraform-plugin-framework/datasource/schema"
    "github.com/hashicorp/terraform-plugin-framework/types"
)
```

## 实现读取功能

数据源使用该方法根据架构数据刷新 Terraform 状态。数据源将使用配置的 HashiCups 客户端调用 HashiCups API 咖啡列表终结点，并将此数据保存到 Terraform 状态。`Read``hashicups_coffees`

读取方法遵循以下步骤：

1. **阅读咖啡清单。**该方法调用 API 客户端的方法。`GetCoffees`
2. **将响应正文映射到架构属性。**该方法读取咖啡后，它将响应映射到，以便数据源可以设置 Terraform 状态。`[]hashicups.Coffee``coffeesModel`
3. **使用咖啡列表设置状态。**

将数据源的方法替换为以下内容。`Read`



内部/提供商/coffees_data_source.go

复制

```go
// Read refreshes the Terraform state with the latest data.
func (d *coffeesDataSource) Read(ctx context.Context, req datasource.ReadRequest, resp *datasource.ReadResponse) {
    var state coffeesDataSourceModel

    coffees, err := d.client.GetCoffees()
    if err != nil {
        resp.Diagnostics.AddError(
            "Unable to Read HashiCups Coffees",
            err.Error(),
        )
        return
    }

    // Map response body to model
    for _, coffee := range coffees {
        coffeeState := coffeesModel{
            ID:          types.Int64Value(int64(coffee.ID)),
            Name:        types.StringValue(coffee.Name),
            Teaser:      types.StringValue(coffee.Teaser),
            Description: types.StringValue(coffee.Description),
            Price:       types.Float64Value(coffee.Price),
            Image:       types.StringValue(coffee.Image),
        }

        for _, ingredient := range coffee.Ingredient {
            coffeeState.Ingredients = append(coffeeState.Ingredients, coffeesIngredientsModel{
                ID: types.Int64Value(int64(ingredient.ID)),
            })
        }

        state.Coffees = append(state.Coffees, coffeeState)
    }

    // Set state
    diags := resp.State.Set(ctx, &state)
    resp.Diagnostics.Append(diags...)
    if resp.Diagnostics.HasError() {
        return
    }
}
```

生成并安装更新的提供程序。

```shell-session
$ go install .
```

复制

## 验证数据源

导航到该目录。`examples/coffees`

```shell-session
$ cd examples/coffees
```

复制

此目录中的 Terraform 配置文件从新数据源读取数据并输出该数据。`main.tf``hashicups_coffees`



examples/coffees/main.tf

```terraform
terraform {
  required_providers {
    hashicups = {
      source = "hashicorp.com/edu/hashicups-pf"
    }
  }
}

provider "hashicups" {
  host     = "http://localhost:19090"
  username = "education"
  password = "test123"
}

data "hashicups_coffees" "edu" {}

output "edu_coffees" {
  value = data.hashicups_coffees.edu
}
```

运行地形规划。Terraform将报告它从HashiCups API检索到的数据。

```shell-session
$ terraform plan
##...
data.hashicups_coffees.edu: Reading...
data.hashicups_coffees.edu: Read complete after 0s

Changes to Outputs:
  + edu_coffees = {
      + coffees = [
          + {
              + description = ""
              + id          = 1
              + image       = "/hashicorp.png"
              + ingredients = [
                  + {
                      + id = 6
                    },
                ]
              + name        = "HCP Aeropress"
              + price       = 200
              + teaser      = "Automation in a cup"
            },
##...
You can apply this plan to save these new output values to the Terraform state,
without changing any real infrastructure.

───────────────────────────────────────────────────────────────────────────────

Note: You didn't use the -out option to save this plan, so Terraform can't
guarantee to take exactly these actions if you run "terraform apply" now.
```

复制

导航到该目录。`terraform-provider-hashicups-pf`

```shell-session
$ cd ../..
```

复制

## 后续步骤

祝贺！您已在提供程序中实现了一个数据源，该数据源使用配置的 API 客户端来保存 Terraform 状态。

如果您在本教程中遇到困难，请查看 [`read-coffees`](https://github.com/hashicorp/terraform-provider-hashicups-pf/tree/read-coffees) 分支以查看本教程中实现的更改。

- 了解有关 Terraform 插件的更多信息 框架，参考 [Terraform 插件框架 文档](https://developer.hashicorp.com/terraform/plugin/framework)。
- 有关 SDKv2 和插件框架之间的完整功能比较， 请参阅[我应该使用哪个 SDK？ 文档](https://developer.hashicorp.com/terraform/plugin/which-sdk)。
- The Terraform HashiCups （plugin-framework） 提供程序的主[``分支](https://github.com/hashicorp/terraform-provider-hashicups-pf)包含完整的 HashiCups 提供程序。它包括一个数据源 使用插件框架编写并实现创建、读取、更新和删除 订单资源的功能。
- 向 [Terraform 插件框架 Github 存储库](https://github.com/hashicorp/terraform-plugin-framework)中的开发团队提交任何 Terraform 插件框架错误报告或功能请求。
- 在 [Terraform 插件框架讨论论坛中提交任何 Terraform 插件框架](https://discuss.hashicorp.com/c/terraform-providers/tf-plugin-sdk/43)问题。