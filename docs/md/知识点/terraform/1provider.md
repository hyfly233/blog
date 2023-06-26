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

