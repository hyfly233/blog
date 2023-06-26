# 实现 data source

## 实现初始 data source

实现 `datasource.DataSource` 接口，此接口需要满足以下条件：

1. Metadata 方法。定义 data source 类型名称
2. Schema 方法。定义任意 data source 配置和 state data 的 schema
3. Read 方法。定义为 data source 设置 Terraform state 的逻辑

添加并编辑 `internal/provider/coffees_data_source.go`

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



## 将 data source 添加到 provider 

将 data source 添加到 provider 的 `DataSources` 方法中

打开并编辑 `internal/provider/provider.go`

```go
// DataSources defines the data sources implemented in the provider.
func (p *hashicupsProvider) DataSources(_ context.Context) []func() datasource.DataSource {
    return []func() datasource.DataSource {
        NewCoffeesDataSource,
    }
}
```



## 实现 data source 客户端功能

数据源使用可选的 Configure 方法从提供程序获取已配置的客户端。提供者配置 HashiCups 客户端，数据源可以为其操作保存对该客户端的引用。

打开并编辑 `internal/provider/coffees_data_source.go`

```go
import (
       "context"

       "github.com/hashicorp-demoapp/hashicups-client-go"
       "github.com/hashicorp/terraform-plugin-framework/datasource"
       "github.com/hashicorp/terraform-plugin-framework/datasource/schema"
)

// Ensure the implementation satisfies the expected interfaces.
var (
    _ datasource.DataSource              = &coffeesDataSource{}
    _ datasource.DataSourceWithConfigure = &coffeesDataSource{}
)

// coffeesDataSource is the data source implementation.
type coffeesDataSource struct {
    client *hashicups.Client
}

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



## 实现 data source schema

替换 data source 的 Schema 方法

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



## 实现 data source 的 data model

使用以下内容向 data source 添加 data model

```go
import (
    "context"
    "fmt"

    "github.com/hashicorp-demoapp/hashicups-client-go"
    "github.com/hashicorp/terraform-plugin-framework/datasource"
    "github.com/hashicorp/terraform-plugin-framework/datasource/schema"
    "github.com/hashicorp/terraform-plugin-framework/types"
)

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



## 实现 read

data source 使用 Read 方法根据 schema 数据刷新 Terraform state，读取方法遵循以下步骤：

1. Read 方法，该方法调用 API Client 的 GetCoffees 方法
2. 将 response 正文映射到 schema 属性中
3. 设置 Terraform state

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

生成并安装更新的 provider 。

```shell
$ go install .
```



## 验证 data source

导航到该目录 `examples/coffees`

```shell
$ cd examples/coffees
```

创建并编辑 `examples/coffees/main.tf`

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

运行 Terraform plan，Terraform将报告它从 HashiCups API 检索到的数据。

```shell
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

