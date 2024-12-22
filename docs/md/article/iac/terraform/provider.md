# 使用 Terraform 插件框架实现 provider

## 先决条件

- Go 1.19+ 已安装并配置
- Terraform v1.0.3+ 本地安装
- Docker 本地安装



## 设置开发环境

克隆项目 [Terraform Provider Scaffolding Framework repository](https://github.com/hashicorp/terraform-provider-scaffolding-framework)

```shell
$ git clone https://github.com/hashicorp/terraform-provider-scaffolding-framework
```

项目重命名`terraform-provider-hashicups-pf`

```shell
$ mv terraform-provider-scaffolding-framework terraform-provider-hashicups-pf
```

切换到克隆的项目

```shell
$ cd terraform-provider-hashicups-pf
```

 重命名模块 `go.mod`

```shell
$ go mod edit -module terraform-provider-hashicups-pf
```

安装依赖

```shell
$ go mod tidy && go install
```



### 设置 docker compose

在项目中创建一个 `docker_compose` 目录，该目录将包含启动 HashiCups 本地实例所需的 Docker 配置

```shell
$ mkdir docker_compose
```

创建文件 `docker_compose/conf.json` 

```json
{
  "db_connection": "host=db port=5432 user=postgres password=password dbname=products sslmode=disable",
  "bind_address": "0.0.0.0:9090",
  "metrics_address": "localhost:9102"
}
```

创建文件 `docker_compose/docker-compose.yml` 

```yaml
version: '3.7'
services:
  api:
    image: "hashicorpdemoapp/product-api:v0.0.22"
    ports:
      - "19090:9090"
    volumes:
      - ./conf.json:/config/config.json
    environment:
      CONFIG_FILE: '/config/config.json'
    depends_on:
      - db
  db:
    image: "hashicorpdemoapp/product-api-db:v0.0.22"
    ports:
      - "15432:5432"
    environment:
      POSTGRES_DB: 'products'
      POSTGRES_USER: 'postgres'
      POSTGRES_PASSWORD: 'password'
```

启动 docker 容器



## 实现 provider

Provider 使用 `provider.Provider` 接口作为所有实现 provider 细节的起点，此接口需要满足以下条件：

1. Metadata 方法，用于定义要包含在每个 data source 和 resource 类型名称中的 provider 类型名称
2. Schema 方法，用于定义 provider 的 schema
3. Configure 方法，用于为 data source 和 resource 实现配置共享客户端
4. DataSources 方法，用于定义 provider 的 data sources
5. Resources 方法，用于定义 provider 的 resource

打开 `internal/provider/provider.go` 替换为以下内容

```go
package provider

import (
    "context"

    "github.com/hashicorp/terraform-plugin-framework/datasource"
    "github.com/hashicorp/terraform-plugin-framework/provider"
    "github.com/hashicorp/terraform-plugin-framework/provider/schema"
    "github.com/hashicorp/terraform-plugin-framework/resource"
)

// Ensure the implementation satisfies the expected interfaces.
var (
    _ provider.Provider = &hashicupsProvider{}
)

// New is a helper function to simplify provider server and testing implementation.
func New(version string) func() provider.Provider {
    return func() provider.Provider {
        return &hashicupsProvider{
            version: version,
        }
    }
}

// hashicupsProvider is the provider implementation.
type hashicupsProvider struct {
    // version is set to the provider version on release, "dev" when the
    // provider is built and ran locally, and "test" when running acceptance
    // testing.
    version string
}

// Metadata returns the provider type name.
func (p *hashicupsProvider) Metadata(_ context.Context, _ provider.MetadataRequest, resp *provider.MetadataResponse) {
    resp.TypeName = "hashicups"
    resp.Version = p.version
}

// Schema defines the provider-level schema for configuration data.
func (p *hashicupsProvider) Schema(_ context.Context, _ provider.SchemaRequest, resp *provider.SchemaResponse) {
    resp.Schema = schema.Schema{}
}

// Configure prepares a HashiCups API client for data sources and resources.
func (p *hashicupsProvider) Configure(ctx context.Context, req provider.ConfigureRequest, resp *provider.ConfigureResponse) {
}

// DataSources defines the data sources implemented in the provider.
func (p *hashicupsProvider) DataSources(_ context.Context) []func() datasource.DataSource {
    return nil
}

// Resources defines the resources implemented in the provider.
func (p *hashicupsProvider) Resources(_ context.Context) []func() resource.Resource {
    return nil
}
```



## 实现 provider server

Terraform provider 是与 Terraform 交互以处理每个 data source 和 resource 操作的服务器进程

打开 `main.go` 替换为以下内容

```go
import (
    "context"
    "flag"
    "log"

    "github.com/hashicorp/terraform-plugin-framework/providerserver"

    "terraform-provider-hashicups-pf/internal/provider"
)

func main() {
    var debug bool

    flag.BoolVar(&debug, "debug", false, "set to true to run the provider with support for debuggers like delve")
    flag.Parse()

    opts := providerserver.ServeOpts{
        // NOTE: This is not a typical Terraform Registry provider address,
        // such as registry.terraform.io/hashicorp/hashicups. This specific
        // provider address is used in these tutorials in conjunction with a
        // specific Terraform CLI configuration for manual development testing
        // of this provider.
        Address: "hashicorp.com/edu/hashicups-pf",
        Debug:   debug,
    }

    err := providerserver.Serve(context.Background(), provider.New(version), opts)

    if err != nil {
        log.Fatal(err.Error())
    }
}
```



## 验证 provider

运行程序，输出如下内容为正确情况

```shell
$ go run main.go
This binary is a plugin. These are not meant to be executed directly.
Please execute the program that consumes these plugins, which will
load any plugins automatically
exit status 1
```

 

## 进行本地 provider 安装

当运行 `Terraform init` 时，Terraform 会安装 provider 并验证它们的版本和校验和

Terraform 将从 `provider registry` 或`本地注册中心`下载 provider

Terraform 通过在配置文件 `.terraformrc` 中设置 `dev_overrides` 块来指定使用本地 provider

1. 首先，找到 Go 安装二进制文件的 `GOBIN` 路径

```shell
$ go env GOBIN
/Users/<Username>/go/bin
```

2. 编辑  `.terraformrc` 文件，将 `PATH` 替换为 `go env GOBIN` 的值

```hcl
provider_installation {

  dev_overrides {
      "hashicorp.com/edu/hashicups-pf" = "<PATH>"
  }

  # For all other providers, install them directly from their origin provider
  # registries as normal. If you omit this, Terraform will _only_ use
  # the dev_overrides block, and so no other providers will be available.
  direct {}
}
```



## 本地安装 provider 并使用 Terraform 进行验证

编译后的二进制文件将会安装在 `GOBIN` 路径中

```shell
$ go install .
```

 创建目录 `examples/provider-install-verification`，该目录将包含用于验证本地 provider 的 terraform 配置

```shell
$ mkdir examples/provider-install-verification && cd "$_"
```

 使用以下内容创建文件 `examples/provider-install-verification/main.tf` 

```terraform
terraform {
  required_providers {
    hashicups = {
      source = "hashicorp.com/edu/hashicups-pf"
    }
  }
}

provider "hashicups" {}

data "hashicups_coffees" "example" {}
```

运行 `Terraform plan` 将报错，但能够验证 Terraform 能够成功启动本地安装的 provider

```shell
$ terraform plan
╷
│ Warning: Provider development overrides are in effect
│
│ The following provider development overrides are set in the CLI
│ configuration:
│  - hashicorp.com/edu/hashicups-pf in /Users/<Username>/go/bin
│
│ The behavior may therefore not match any released version of the provider and
│ applying changes may cause the state to become incompatible with published
│ releases.
╵
╷
│ Error: Invalid data source
│
│   on main.tf line 11, in data "hashicups_coffees" "example":
│   11: data "hashicups_coffees" "example" {}
│
│ The provider hashicorp.com/edu/hashicups-pf does not support data source
│ "hashicups_coffees".
╵
```



## 实现 provider schema

Terraform Plugin Framework 使用 provider 的 `Schema` 方法来定义可接受的配置属性名称和类型。HashiCups 客户端需要正确配置主机、用户名和密码。Terraform Plugin Framework 的`types` 包含 schema 和 data model，可以使用 Terraform 的空值、未知值或已知值。

编辑文件`internal/provider/provider.go` 添加以下内容

```go
// Schema defines the provider-level schema for configuration data.
func (p *hashicupsProvider) Schema(_ context.Context, _ provider.SchemaRequest, resp *provider.SchemaResponse) {
    resp.Schema = schema.Schema{
        Attributes: map[string]schema.Attribute{
            "host": schema.StringAttribute{
                Optional: true,
            },
            "username": schema.StringAttribute{
                Optional: true,
            },
            "password": schema.StringAttribute{
                Optional:  true,
                Sensitive: true,
            },
        },
    }
}
```



## 实现 provider data model

Terraform Plugin Framework 使用带有 tfsdk 结构字段标签的 Go 语言结构类型，将 schema 定义映射为带有实际数据的 Go 语言类型。结构体中的类型必须与 schema 中的类型保持一致

编辑文件 `internal/provider/provider.go` 添加以下内容

```go
// hashicupsProviderModel maps provider schema data to a Go type.
type hashicupsProviderModel struct {
    Host     types.String `tfsdk:"host"`
    Username types.String `tfsdk:"username"`
    Password types.String `tfsdk:"password"`
}
```



## 实现客户端配置功能

provider 使用 Configure 方法从 Terraform 配置或环境变量中读取 API Client 的配置值。在验证值之后，将创建 API Client，并使其可用于 data source 和 resource 使用，Configure 方法遵循以下步骤：

1. 从配置中检索值。该方法将尝试从提供程序配置中检索值，并将其转换为 `providerModel` 结构体
2. 检查未知的配置值。如果只有在应用另一个资源后才知道 Terraform 配置值，则该方法可以防止意外配置错误的客户端
3. 从环境变量中检索值。该方法从环境变量中检索值，然后用任何已设置的 Terraform 配置值覆盖它们
4. 创建 API Client。该方法调用HashiCups API客户端的 `NewClient` 函数
5. 存储已配置的客户端供 data source 和 resource 使用。该方法设置 response 的 `DataSourceData` 和 `ResourceData` 字段，因此客户端可供 data source 和 resource 实现使用

编辑文件 `internal/provider/provider.go` 添加以下内容

```go
import (
       "context"
       "os"

       "github.com/hashicorp-demoapp/hashicups-client-go"
       "github.com/hashicorp/terraform-plugin-framework/datasource"
       "github.com/hashicorp/terraform-plugin-framework/path"
       "github.com/hashicorp/terraform-plugin-framework/provider"
       "github.com/hashicorp/terraform-plugin-framework/provider/schema"
       "github.com/hashicorp/terraform-plugin-framework/resource"
       "github.com/hashicorp/terraform-plugin-framework/types"
)

func (p *hashicupsProvider) Configure(ctx context.Context, req provider.ConfigureRequest, resp *provider.ConfigureResponse) {
    // Retrieve provider data from configuration
    var config hashicupsProviderModel
    diags := req.Config.Get(ctx, &config)
    resp.Diagnostics.Append(diags...)
    if resp.Diagnostics.HasError() {
        return
    }

    // If practitioner provided a configuration value for any of the
    // attributes, it must be a known value.

    if config.Host.IsUnknown() {
        resp.Diagnostics.AddAttributeError(
            path.Root("host"),
            "Unknown HashiCups API Host",
            "The provider cannot create the HashiCups API client as there is an unknown configuration value for the HashiCups API host. "+
                "Either target apply the source of the value first, set the value statically in the configuration, or use the HASHICUPS_HOST environment variable.",
        )
    }

    if config.Username.IsUnknown() {
        resp.Diagnostics.AddAttributeError(
            path.Root("username"),
            "Unknown HashiCups API Username",
            "The provider cannot create the HashiCups API client as there is an unknown configuration value for the HashiCups API username. "+
                "Either target apply the source of the value first, set the value statically in the configuration, or use the HASHICUPS_USERNAME environment variable.",
        )
    }

    if config.Password.IsUnknown() {
        resp.Diagnostics.AddAttributeError(
            path.Root("password"),
            "Unknown HashiCups API Password",
            "The provider cannot create the HashiCups API client as there is an unknown configuration value for the HashiCups API password. "+
                "Either target apply the source of the value first, set the value statically in the configuration, or use the HASHICUPS_PASSWORD environment variable.",
        )
    }

    if resp.Diagnostics.HasError() {
        return
    }

    // Default values to environment variables, but override
    // with Terraform configuration value if set.

    host := os.Getenv("HASHICUPS_HOST")
    username := os.Getenv("HASHICUPS_USERNAME")
    password := os.Getenv("HASHICUPS_PASSWORD")

    if !config.Host.IsNull() {
        host = config.Host.ValueString()
    }

    if !config.Username.IsNull() {
        username = config.Username.ValueString()
    }

    if !config.Password.IsNull() {
        password = config.Password.ValueString()
    }

    // If any of the expected configurations are missing, return
    // errors with provider-specific guidance.

    if host == "" {
        resp.Diagnostics.AddAttributeError(
            path.Root("host"),
            "Missing HashiCups API Host",
            "The provider cannot create the HashiCups API client as there is a missing or empty value for the HashiCups API host. "+
                "Set the host value in the configuration or use the HASHICUPS_HOST environment variable. "+
                "If either is already set, ensure the value is not empty.",
        )
    }

    if username == "" {
        resp.Diagnostics.AddAttributeError(
            path.Root("username"),
            "Missing HashiCups API Username",
            "The provider cannot create the HashiCups API client as there is a missing or empty value for the HashiCups API username. "+
                "Set the username value in the configuration or use the HASHICUPS_USERNAME environment variable. "+
                "If either is already set, ensure the value is not empty.",
        )
    }

    if password == "" {
        resp.Diagnostics.AddAttributeError(
            path.Root("password"),
            "Missing HashiCups API Password",
            "The provider cannot create the HashiCups API client as there is a missing or empty value for the HashiCups API password. "+
                "Set the password value in the configuration or use the HASHICUPS_PASSWORD environment variable. "+
                "If either is already set, ensure the value is not empty.",
        )
    }

    if resp.Diagnostics.HasError() {
        return
    }

    // Create a new HashiCups client using the configuration values
    client, err := hashicups.NewClient(&host, &username, &password)
    if err != nil {
        resp.Diagnostics.AddError(
            "Unable to Create HashiCups API Client",
            "An unexpected error occurred when creating the HashiCups API client. "+
                "If the error is not clear, please contact the provider developers.\n\n"+
                "HashiCups Client Error: "+err.Error(),
        )
        return
    }

    // Make the HashiCups client available during DataSource and Resource
    // type Configure methods.
    resp.DataSourceData = client
    resp.ResourceData = client
}
```

更新所有依赖

```shell
$ go mod tidy
```

 生成并安装更新的 provider 。

```shell
$ go install .
```

 

## 在本地启动 HashiCups

您的 HashiCups  provider 需要一个正在运行的 HashiCups 实例。

在另一个终端窗口中，导航到该目录。`docker_compose`

```shell
$ cd docker_compose
$ docker-compose up
```

验证 HashiCups 是否正在运行

```shell
$ curl localhost:19090/health/readyz
ok
```

 

## 创建 HashiCups 用户

HashiCups 需要用户名和密码来生成 JWT 令牌，用于对受保护的端点进行身份验证。在 HashiCups 上创建一个名为education 的用户，密码为 test123

```shell
$ curl -X POST localhost:19090/signup -d '{"username":"education", "password":"test123"}'
{"UserID":1,"Username":"education","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1OTEwNzgwODUsInVzZXJfaWQiOjIsInVzZXJuYW1lIjoiZWR1Y2F0aW9uIn0.CguceCNILKdjOQ7Gx0u4UAMlOTaH3Dw-fsll2iXDrYU"}
```

设置环境变量 HASHICUPS_TOKEN

```shell
$ export HASHICUPS_TOKEN=ey...
```

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

```shell
$ cd ../..
```

# 实现日志记录

## 实现日志消息

provider 支持通过 `github.com/hashicorp/terraform-plugin-log` 模块的 `tflog` 包进行日志记录。这个包实现了结构化的日志记录和过滤功能。

编辑`internal/provider/provider.go`

```go
import (
    "context"
    "os"

    "github.com/hashicorp-demoapp/hashicups-client-go"
    "github.com/hashicorp/terraform-plugin-framework/datasource"
    "github.com/hashicorp/terraform-plugin-framework/path"
    "github.com/hashicorp/terraform-plugin-framework/provider"
    "github.com/hashicorp/terraform-plugin-framework/provider/schema"
    "github.com/hashicorp/terraform-plugin-framework/resource"
    "github.com/hashicorp/terraform-plugin-framework/types"
    "github.com/hashicorp/terraform-plugin-log/tflog"
)

func (p *hashicupsProvider) Configure(ctx context.Context, req provider.ConfigureRequest, resp *provider.ConfigureResponse) {
    tflog.Info(ctx, "Configuring HashiCups client")

    // Retrieve provider data from configuration
    var config hashicupsProviderModel
    /* ... */
```



## 实现结构化日志字段

`tflog` 包支持向日志中添加额外的键值对，以实现一致性和跟踪流。这些对可以通过 `tlog.setfield()` 调用添加到 provider 请求的其余部分，或者作为任何日志调用的最终参数内联。

编辑 `internal/provider/provider.go`

在 provider 的 `Configure` 方法中，在 `hashicup.newclient()` 调用之前立即设置三个日志字段和一条日志消息，如下所示。

```go
    /* ... */
    if resp.Diagnostics.HasError() {
        return
    }

    ctx = tflog.SetField(ctx, "hashicups_host", host)
    ctx = tflog.SetField(ctx, "hashicups_username", username)
    ctx = tflog.SetField(ctx, "hashicups_password", password)

    tflog.Debug(ctx, "Creating HashiCups client")

    // Create a new HashiCups client using the configuration values
    client, err := hashicups.NewClient(&host, &username, &password)
    /* ... */
```

在 `Configure `方法的末尾添加一条日志消息

```go
    /* ... */
    // Make the HashiCups client available during DataSource and Resource
    // type Configure methods.
    resp.DataSourceData = client
    resp.ResourceData = client

    tflog.Info(ctx, "Configured HashiCups client", map[string]any{"success": true})
}
```



## 实现日志过滤

在 `tflog. Debug(ctx, "Creating HashiCups client") ` 之前添加过滤器来屏蔽用户的密码

```go
    /* ... */
    ctx = tflog.SetField(ctx, "hashicups_host", host)
    ctx = tflog.SetField(ctx, "hashicups_username", username)
    ctx = tflog.SetField(ctx, "hashicups_password", password)
    ctx = tflog.MaskFieldValuesWithFieldKeys(ctx, "hashicups_password")

    tflog.Debug(ctx, "Creating HashiCups client")
    /* ... */
```

生成 provider

```shell
$ go install .
```



## 查看所有 Terraform 日志输出

Terraform的日志输出由各种环境变量控制，例如 `TF_LOG` 或 `TF_LOG_` 为前缀。

移动到 `examples/coffees`

```shell
$ cd examples/coffees
```

运行一个将 `TF_LOG` 环境变量设置为 `TRACE` 的 Terraform plan

Terraform 将为 Terraform 本身、Terraform 插件框架和任何 provider 日志记录中的所有组件输出大量日志条目。

```shell
$ TF_LOG=TRACE terraform plan
##...
2022-09-19T09:33:34.487-0500 [INFO]  provider.terraform-provider-hashicups-pf
2022-09-19T09:33:34.487-0500 [DEBUG] provider.terraform-provider-hashicups-pf
2022-09-19T09:33:34.517-0500 [INFO]  provider.terraform-provider-hashicups-pf
##...
```



## 保存所有 Terraform 日志输出

运行 terraform plan 同时设置 `TF_LOG` 和 `TF_LOG_PATH`

```shell
$ TF_LOG=TRACE TF_LOG_PATH=trace.txt terraform plan
```

日志将保存在 `examples/coffees/trace.txt`中



## 查看特定的 Terraform 日志输出

日志级别包括 `DEBUG` `INFO` `WARN` `ERROR`

```shell
$ TF_LOG=INFO terraform plan
2022-09-30T16:27:38.446-0500 [INFO]  Terraform version: 1.3.0
2022-09-30T16:27:38.447-0500 [INFO]  Go runtime version: go1.19.1
2022-09-30T16:27:38.447-0500 [INFO]  CLI args: []string{"terraform", "plan"}
##...
```

仅输出 provider 日志

```shell
$ TF_LOG_PROVIDER=INFO terraform plan
##...
2022-12-14T10:39:33.247-0600 [INFO]  provider.terraform-provider-hashicups-pf
2022-12-14T10:39:33.255-0600 [INFO]  provider.terraform-provider-hashicups-pf
data.hashicups_coffees.edu: Reading...
data.hashicups_coffees.edu: Read complete after 0s
##...
```

## 实现 resource 创建和读取的准备工作

### 步骤

1. 定义初始 resource 类型
2. 将 resource 添加到 provider 中
3. 在 resource 中实现 HashiCups 客户端
4. 定义 resource 的 schema
5. 定义 resource 的 data mode
6. 定义 resource 的 create 逻辑
7. 定义 resource 的 read 逻辑
8. 验证 resource 的行为



### 实现初始 resource 类型

Provider 使用接口类型 `resource.Resource` 的实现作为 resource 实现的起点

此接口需要满足以下条件：

1. 用于定义 resource 类型名称的元数据 Metadata 方法
2. Schema 方法，用于定义 resource 的 configure、plan 和 state data
3. Create 方法，用于定义创建 resource 并设置其初始 Terraform 状态的逻辑
4. Read 方法，用于定义刷新 resource 的 Terraform 状态的逻辑
5. Update 方法，用于定义更新并在成功时设置 resource 的 Terraform 状态的逻辑
6. Delete 方法，用于定义删除并在成功时移除 resource 的 Terraform 状态的逻辑



### 创建文件 order_resource.go

文件路径 `internal/provider/order_resource.go`

```go
package provider

import (
    "context"

    "github.com/hashicorp/terraform-plugin-framework/resource"
    "github.com/hashicorp/terraform-plugin-framework/resource/schema"
)

// Ensure the implementation satisfies the expected interfaces.
var (
    _ resource.Resource = &orderResource{}
)

// NewOrderResource is a helper function to simplify the provider implementation.
func NewOrderResource() resource.Resource {
    return &orderResource{}
}

// orderResource is the resource implementation.
type orderResource struct{}

// Metadata returns the resource type name.
func (r *orderResource) Metadata(_ context.Context, req resource.MetadataRequest, resp *resource.MetadataResponse) {
    resp.TypeName = req.ProviderTypeName + "_order"
}

// Schema defines the schema for the resource.
func (r *orderResource) Schema(_ context.Context, _ resource.SchemaRequest, resp *resource.SchemaResponse) {
    resp.Schema = schema.Schema{}
}

// Create creates the resource and sets the initial Terraform state.
func (r *orderResource) Create(ctx context.Context, req resource.CreateRequest, resp *resource.CreateResponse) {
}

// Read refreshes the Terraform state with the latest data.
func (r *orderResource) Read(ctx context.Context, req resource.ReadRequest, resp *resource.ReadResponse) {
}

// Update updates the resource and sets the updated Terraform state on success.
func (r *orderResource) Update(ctx context.Context, req resource.UpdateRequest, resp *resource.UpdateResponse) {
}

// Delete deletes the resource and removes the Terraform state on success.
func (r *orderResource) Delete(ctx context.Context, req resource.DeleteRequest, resp *resource.DeleteResponse) {
}
```



### 将 resource 添加到 provider 中

provider 使用 `Resources` 方法返回其支持的 resource

打开文件 `internal/provider/provider.go`

将 resource 中的 `NewOrderResource` 方法替换为以下内容

```go
// Resources defines the resources implemented in the provider.
func (p *hashicupsProvider) Resources(_ context.Context) []func() resource.Resource {
    return []func() resource.Resource{
        NewOrderResource,
    }
}
```



### 实现 resource 客户端功能

resource 使用可选的 `Configure` 方法从提供程序中获取已配置的客户端。provider 已经配置了 HashiCups 客户端， resource 可以为其操作保存对该客户端的引用

打开文件 `internal/provider/order_resource.go`

通过将 `orderResource` 类型替换为以下内容，允许 resource 类型存储对 HashiCups 客户端的引用

```go
import (
    "context"

    "github.com/hashicorp-demoapp/hashicups-client-go"
    "github.com/hashicorp/terraform-plugin-framework/resource"
    "github.com/hashicorp/terraform-plugin-framework/resource/schema"
)

// orderResource is the resource implementation.
type orderResource struct {
    client *hashicups.Client
}
```

确保 resource 满足框架定义的 Resource 和 ResourceWithConfigure 接口，可用下面的语句替换 var 语句

```go
// Ensure the implementation satisfies the expected interfaces.
var (
    _ resource.Resource              = &orderResource{}
    _ resource.ResourceWithConfigure = &orderResource{}
)
```

添加一个 `Configure` 方法，使用以下代码配置 HashiCups 客户端

```go
// Configure adds the provider configured client to the resource.
func (r *orderResource) Configure(_ context.Context, req resource.ConfigureRequest, resp *resource.ConfigureResponse) {
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

    r.client = client
}
```



### 实现 Schema

该资源使用 `Schema` 方法来定义支持的 configuration、plan 和 state attribute names/types

将 resource 的 `Schema` 方法替换为以下内容

```go
// Schema defines the schema for the resource.
func (r *orderResource) Schema(_ context.Context, _ resource.SchemaRequest, resp *resource.SchemaResponse) {
    resp.Schema = schema.Schema{
        Attributes: map[string]schema.Attribute{
            "id": schema.StringAttribute{
                Computed: true,
            },
            "last_updated": schema.StringAttribute{
                Computed: true,
            },
            "items": schema.ListNestedAttribute{
                Required: true,
                NestedObject: schema.NestedAttributeObject{
                    Attributes: map[string]schema.Attribute{
                        "quantity": schema.Int64Attribute{
                            Required: true,
                        },
                        "coffee": schema.SingleNestedAttribute{
                            Required: true,
                            Attributes: map[string]schema.Attribute{
                                "id": schema.Int64Attribute{
                                    Required: true,
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
                            },
                        },
                    },
                },
            },
        },
    }
}
```



### 实现 data model

将资源的以下 data model 添加到 order_resource.go

```go
// orderResourceModel maps the resource schema data.
type orderResourceModel struct {
    ID          types.String     `tfsdk:"id"`
    Items       []orderItemModel `tfsdk:"items"`
    LastUpdated types.String     `tfsdk:"last_updated"`
}

// orderItemModel maps order item data.
type orderItemModel struct {
    Coffee   orderItemCoffeeModel `tfsdk:"coffee"`
    Quantity types.Int64          `tfsdk:"quantity"`
}

// orderItemCoffeeModel maps coffee order item data.
type orderItemCoffeeModel struct {
    ID          types.Int64   `tfsdk:"id"`
    Name        types.String  `tfsdk:"name"`
    Teaser      types.String  `tfsdk:"teaser"`
    Description types.String  `tfsdk:"description"`
    Price       types.Float64 `tfsdk:"price"`
    Image       types.String  `tfsdk:"image"`
}
```



## 实现 create

provider 使用 `Create` 方法基于 data model 创建新资源，create 方法遵循以下步骤

1. 检查是否配置 API Client。如果不是，resource 抛出一个错误
2. 从 plan 中检索值。该方法将尝试从 plan 中检索值并将其转换为 `orderResourceModel`
3. 根据 plan 的值生成 API 请求体。该方法循环遍历每个 plan 项并将其映射到 `hashicups.OrderItem`
4. 创建一个新订单。该方法调用 API 客户端的 `CreateOrder` 方法
5. 将响应体映射到 resource schema attributes 属性中。该方法创建一个订单后，它会映射 `hashicups.Order` 响应到 `[]OrderItem`，以便提供程序可以更新 Terraform 的 state
6. 设置 Terraform 的 state 与新订单的详细信息

```go
import (
    "context"
    "fmt"
    "strconv"
    "time"

    "github.com/hashicorp-demoapp/hashicups-client-go"
    "github.com/hashicorp/terraform-plugin-framework/resource"
    "github.com/hashicorp/terraform-plugin-framework/resource/schema"
    "github.com/hashicorp/terraform-plugin-framework/types"
)

// Create a new resource.
func (r *orderResource) Create(ctx context.Context, req resource.CreateRequest, resp *resource.CreateResponse) {
    // Retrieve values from plan
    var plan orderResourceModel
    diags := req.Plan.Get(ctx, &plan)
    resp.Diagnostics.Append(diags...)
    if resp.Diagnostics.HasError() {
        return
    }

    // Generate API request body from plan
    var items []hashicups.OrderItem
    for _, item := range plan.Items {
        items = append(items, hashicups.OrderItem{
            Coffee: hashicups.Coffee{
                ID: int(item.Coffee.ID.ValueInt64()),
            },
            Quantity: int(item.Quantity.ValueInt64()),
        })
    }

    // Create new order
    order, err := r.client.CreateOrder(items)
    if err != nil {
        resp.Diagnostics.AddError(
            "Error creating order",
            "Could not create order, unexpected error: "+err.Error(),
        )
        return
    }

    // Map response body to schema and populate Computed attribute values
    plan.ID = types.StringValue(strconv.Itoa(order.ID))
    for orderItemIndex, orderItem := range order.Items {
        plan.Items[orderItemIndex] = orderItemModel{
            Coffee: orderItemCoffeeModel{
                ID:          types.Int64Value(int64(orderItem.Coffee.ID)),
                Name:        types.StringValue(orderItem.Coffee.Name),
                Teaser:      types.StringValue(orderItem.Coffee.Teaser),
                Description: types.StringValue(orderItem.Coffee.Description),
                Price:       types.Float64Value(orderItem.Coffee.Price),
                Image:       types.StringValue(orderItem.Coffee.Image),
            },
            Quantity: types.Int64Value(int64(orderItem.Quantity)),
        }
    }
    plan.LastUpdated = types.StringValue(time.Now().Format(time.RFC850))

    // Set state to fully populated data
    diags = resp.State.Set(ctx, plan)
    resp.Diagnostics.Append(diags...)
    if resp.Diagnostics.HasError() {
        return
    }
}
```



## 实现 read

provider 使用 `Read` 方法来检索 resource 的信息并更新 Terraform 的 state 以反映 resource 的当前状态。provider 在每个 plan 生成 resource 当前 state 和 configuration 之间的准确差异之前调用此函数，read 方法遵循以下步骤:

1. 获取当前状态。如果不能，则 provider 响应一个错误
2. 从 Terraform 的 state 中获取订单 ID
3. 从客户端获取订单详情。该方法使用订单 ID 调用 API 客户端的 `GetOrder` 方法
4. 将响应体映射到 resource schema attributes 属性上。方法检索到顺序后，映射 `hashicups.Order` 响应到 `[]OrderItem`，以便提供程序可以更新 Terraform 的 state
5. 设置 Terraform 的 state 与订单的详细信息

```go
// Read resource information.
func (r *orderResource) Read(ctx context.Context, req resource.ReadRequest, resp *resource.ReadResponse) {
// Get current state
    var state orderResourceModel
    diags := req.State.Get(ctx, &state)
    resp.Diagnostics.Append(diags...)
    if resp.Diagnostics.HasError() {
        return
    }

    // Get refreshed order value from HashiCups
    order, err := r.client.GetOrder(state.ID.ValueString())
    if err != nil {
        resp.Diagnostics.AddError(
            "Error Reading HashiCups Order",
            "Could not read HashiCups order ID "+state.ID.ValueString()+": "+err.Error(),
        )
        return
    }

    // Overwrite items with refreshed state
    state.Items = []orderItemModel{}
    for _, item := range order.Items {
        state.Items = append(state.Items, orderItemModel{
            Coffee: orderItemCoffeeModel{
                ID:          types.Int64Value(int64(item.Coffee.ID)),
                Name:        types.StringValue(item.Coffee.Name),
                Teaser:      types.StringValue(item.Coffee.Teaser),
                Description: types.StringValue(item.Coffee.Description),
                Price:       types.Float64Value(item.Coffee.Price),
                Image:       types.StringValue(item.Coffee.Image),
            },
            Quantity: types.Int64Value(int64(item.Quantity)),
        })
    }

    // Set refreshed state
    diags = resp.State.Set(ctx, &state)
    resp.Diagnostics.Append(diags...)
    if resp.Diagnostics.HasError() {
        return
    }
}
```

生成并安装 provider

```shell
go install .
```



## 验证 resource

创建一个 `examples/order` 目录

```shell
mkdir examples/order && cd "$_"
```

在此目录中创建一个 `examples/order/main.tf`

```terraform
terraform {
  required_providers {
    hashicups = {
      source  = "hashicorp.com/edu/hashicups-pf"
    }
  }
  required_version = ">= 1.1.0"
}

provider "hashicups" {
  username = "education"
  password = "test123"
  host     = "http://localhost:19090"
}

resource "hashicups_order" "edu" {
  items = [{
    coffee = {
      id = 3
    }
    quantity = 2
    }, {
    coffee = {
      id = 1
    }
    quantity = 2
    }
  ]
}

output "edu_order" {
  value = hashicups_order.edu
}
```

执行 terraform apply 并输入 yes

```shell
$ terraform apply

Terraform used the selected providers to generate the following execution plan. Resource actions are indicated with the following symbols:
  + create

Terraform will perform the following actions:

  # hashicups_order.edu will be created
  + resource "hashicups_order" "edu" {
      + id           = (known after apply)
      ## ...
    }

Plan: 1 to add, 0 to change, 0 to destroy.

Changes to Outputs:
  + edu_order = {
      + id           = (known after apply)
      + items        = [
          + {
##...

Do you want to perform these actions?
  Terraform will perform the actions described above.
  Only 'yes' will be accepted to approve.

  Enter a value: yes

hashicups_order.edu: Creating...
hashicups_order.edu: Creation complete after 0s [id=21]

Apply complete! Resources: 1 added, 0 changed, 0 destroyed.

Outputs:

edu_order = {
  "id" = "1"
  "items" = tolist([
    {
      "coffee" = {
        "description" = ""
        "id" = 3
        "image" = "/vault.png"
        "name" = "Vaulatte"
        "price" = 200
        "teaser" = "Nothing gives you a safe and secure feeling like a Vaulatte"
      }
      "quantity" = 2
    },
    {
      "coffee" = {
        "description" = ""
        "id" = 1
        "image" = "/hashicorp.png"
        "name" = "HCP Aeropress"
        "price" = 200
        "teaser" = "Automation in a cup"
      }
      "quantity" = 2
    },
  ])
  "last_updated" = "Thursday, 09-Feb-23 11:32:05 EST"
}
```

一旦申请完成，provider 将 resource 的详细信息保存在 Terraform 的 state 中。执行 `terraform state show resource_name` 命令查看状态。

```shell
$ terraform state show hashicups_order.edu
# hashicups_order.edu:
resource "hashicups_order" "edu" {
    id           = "1"
    items        = [
      # (2 unchanged elements hidden)
    ]
    last_updated = "Thursday, 22-Jul-21 03:26:51 PDT"
}
```



### 验证创建的订单

使用 RESTful api 查询订单信息，验证 Terraform 是否通过 API 检索订单详细信息创建了订单

```shell
$ curl -X GET  -H "Authorization: ${HASHICUPS_TOKEN}" localhost:19090/orders/1

{"id":1,"items":[{"coffee":{"id":3,"name":"Vaulatte","teaser":"Nothing gives you a safe and secure feeling like a Vaulatte","collection":"Foundations","origin":"Spring 2015","color":"#FFD814","description":"","price":200,"image":"/vault.png","ingredients":[{"ingredient_id":1},{"ingredient_id":2}]},"quantity":2},{"coffee":{"id":1,"name":"HCP Aeropress","teaser":"Automation in a cup","collection":"Foundations","origin":"Summer 2020","color":"#444","description":"","price":200,"image":"/hashicorp.png","ingredients":[{"ingredient_id":6}]},"quantity":2}]}
```

订单的属性应该与 `hashicups_order.edu` resource 的属性相同

## 实施 resource 更新

1. 验证 schema 和 model
2. 实现 resource update
3. 使用 plan modifier 增强 plan output
4. 验证 update 功能



### 修改 schema 和 model

添加 last_updated 的属性

```go
func (r *orderResource) Schema(_ context.Context, _ resource.SchemaRequest, resp *resource.SchemaResponse) {
    resp.Schema = schema.Schema{
        Attributes: map[string]schema.Attribute{
            "id": schema.StringAttribute{
                Computed: true,
            },
            "last_updated": schema.StringAttribute{
                Computed: true,
            },
            "items": schema.ListNestedAttribute{
                // ...
```

在 `orderResourceModel` 中添加 `last_updated` 字段

```go
type orderResourceModel struct {
    ID          types.String     `tfsdk:"id"`
    Items       []orderItemModel `tfsdk:"items"`
    LastUpdated types.String     `tfsdk:"last_updated"`
}
```



### 实现 update

Provider 使用 Update 方法基于 schema 数据更新现有 resource，Update 方法遵循以下步骤：

1. 从 plan 中检索值
2. 从 plan 值生成 API 请求体
3. 更新订单
4. 将 response 正文映射到 resource schema 属性
5. 设置 `LastUpdated` 属性
6. 使用更新后的订单设置 Terraform state

编辑 `internal/provider/order_resource.go`

```go
import (
    "context"
    "fmt"
    "strconv"
    "time"

    "github.com/hashicorp-demoapp/hashicups-client-go"
    "github.com/hashicorp/terraform-plugin-framework/resource"
    "github.com/hashicorp/terraform-plugin-framework/resource/schema"
    "github.com/hashicorp/terraform-plugin-framework/resource/schema/planmodifier"
    "github.com/hashicorp/terraform-plugin-framework/resource/schema/stringplanmodifier"
    "github.com/hashicorp/terraform-plugin-framework/types"
)

func (r *orderResource) Update(ctx context.Context, req resource.UpdateRequest, resp *resource.UpdateResponse) {
    // Retrieve values from plan
    var plan orderResourceModel
    diags := req.Plan.Get(ctx, &plan)
    resp.Diagnostics.Append(diags...)
    if resp.Diagnostics.HasError() {
        return
    }

    // Generate API request body from plan
    var hashicupsItems []hashicups.OrderItem
    for _, item := range plan.Items {
        hashicupsItems = append(hashicupsItems, hashicups.OrderItem{
            Coffee: hashicups.Coffee{
                ID: int(item.Coffee.ID.ValueInt64()),
            },
            Quantity: int(item.Quantity.ValueInt64()),
        })
    }

    // Update existing order
    _, err := r.client.UpdateOrder(plan.ID.ValueString(), hashicupsItems)
    if err != nil {
        resp.Diagnostics.AddError(
            "Error Updating HashiCups Order",
            "Could not update order, unexpected error: "+err.Error(),
        )
        return
    }

    // Fetch updated items from GetOrder as UpdateOrder items are not
    // populated.
    order, err := r.client.GetOrder(plan.ID.ValueString())
    if err != nil {
        resp.Diagnostics.AddError(
            "Error Reading HashiCups Order",
            "Could not read HashiCups order ID "+plan.ID.ValueString()+": "+err.Error(),
        )
        return
    }

    // Update resource state with updated items and timestamp
    plan.Items = []orderItemModel{}
    for _, item := range order.Items {
        plan.Items = append(plan.Items, orderItemModel{
            Coffee: orderItemCoffeeModel{
                ID:          types.Int64Value(int64(item.Coffee.ID)),
                Name:        types.StringValue(item.Coffee.Name),
                Teaser:      types.StringValue(item.Coffee.Teaser),
                Description: types.StringValue(item.Coffee.Description),
                Price:       types.Float64Value(item.Coffee.Price),
                Image:       types.StringValue(item.Coffee.Image),
            },
            Quantity: types.Int64Value(int64(item.Quantity)),
        })
    }
    plan.LastUpdated = types.StringValue(time.Now().Format(time.RFC850))

    diags = resp.State.Set(ctx, plan)
    resp.Diagnostics.Append(diags...)
    if resp.Diagnostics.HasError() {
        return
    }
}
```

更新 provider

```shell
$ go install .
```



### 验证 update 功能

导航到目录 `examples/order`

```shell
$ cd examples/order
```

编辑 `examples/order/main.tf`

```go
resource "hashicups_order" "edu" {
  items = [{
    coffee = {
      id = 3
    }
    quantity = 2
    },
    {
      coffee = {
        id = 2
      }
      quantity = 3
  }]
}
```

执行 terraform plan

```shell
$ terraform plan
hashicups_order.edu: Refreshing state... [id=1]

Terraform used the selected providers to generate the following execution plan. Resource actions are indicated with the following symbols:
  ~ update in-place

Terraform will perform the following actions:

  # hashicups_order.edu will be updated in-place
  ~ resource "hashicups_order" "edu" {
      ~ id           = "1" -> (known after apply)
      ~ items        = [
          ~ {
              ~ coffee   = {
                  + description = (known after apply)
                    id          = 3
                  ~ image       = "/vault.png" -> (known after apply)
                  ~ name        = "Vaulatte" -> (known after apply)
                  ~ price       = 200 -> (known after apply)
                  ~ teaser      = "Nothing gives you a safe and secure feeling like a Vaulatte" -> (known after apply)
                }
                # (1 unchanged attribute hidden)
            },
          ~ {
              ~ coffee   = {
                  + description = (known after apply)
                  ~ id          = 1 -> 2
                  ~ image       = "/hashicorp.png" -> (known after apply)
                  ~ name        = "HCP Aeropress" -> (known after apply)
                  ~ price       = 200 -> (known after apply)
                  ~ teaser      = "Automation in a cup" -> (known after apply)
                }
              ~ quantity = 2 -> 3
            },
        ]
      ~ last_updated = "Thursday, 09-Feb-23 11:32:05 EST" -> (known after apply)
    }

Plan: 0 to add, 1 to change, 0 to destroy.
```



### 增强 plan output

可配置的 Terraform Plugin Framework 属性不应该显示现有状态值的更新，应该使用 `UseStateForUnknown()` plan 修饰符

编辑 `internal/provider/order_resource.go`

```go
"id": schema.StringAttribute{
    Computed: true,
    PlanModifiers: []planmodifier.String{
        stringplanmodifier.UseStateForUnknown(),
    },
},
```



## 实施资源删除

### 实现 delete

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



### 验证 delete

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

