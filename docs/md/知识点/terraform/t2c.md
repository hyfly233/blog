# 配置提供程序客户端

- 15分
- |
- 大地形态大地形态



经常引用这个？ [创建一个帐户](https://developer.hashicorp.com/sign-up)以书签教程。



在本教程中，您将通过 Terraform 提供程序配置或环境变量配置 HashiCups API 客户端。然后，配置的客户端将可供任何数据源或资源使用。为此，您将：

1. **定义提供程序架构。**
   这使提供程序准备好接受客户端身份验证和主机信息的 Terraform 配置。
2. **定义提供程序数据模型。**
   这会将提供程序架构建模为 Go 类型，以便其他 Go 代码可以访问数据。
3. **定义提供程序配置方法。**
   这将使用数据模型读取 Terraform 配置，或检查配置中是否缺少数据的环境变量。如果缺少任何必要的客户端配置，则会引发错误。然后创建配置的客户端，使其可用于数据源和资源。
4. **验证配置行为。**
   这可确保预期的提供程序配置行为。

## 先决条件

要学习本教程，您需要：

- [Go 1.19+](https://golang.org/doc/install) 已安装并配置。
- [Terraform v1.0.3+](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli) 本地安装。
- 码头[工人](https://www.docker.com/products/docker-desktop)和[码头工人 撰写](https://docs.docker.com/compose/install/)以运行 本地桥杯。

继续上一教程新设置

导航到您的目录。`terraform-provider-hashicups-pf`

代码应与示例存储库中的[`提供程序`分支](https://github.com/hashicorp/terraform-provider-hashicups-pf/tree/provider)匹配。

## 实现提供程序架构

插件框架使用提供程序的方法定义可接受的配置属性名称和类型。HashiCups 客户端需要主机、用户名和密码才能正确配置。Terraform 插件框架包包含可以使用 Terraform 的空值、未知值或已知值的模式和数据模型类型。`Schema``types`

打开文件。`internal/provider/provider.go`

将您的方法替换为以下内容。`Schema`



internal/provider/provider.go

复制

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

## 实现提供程序数据模型

Terraform 插件框架使用 Go 结构类型和结构字段标签将模式定义映射到包含实际数据的 Go 类型中。结构中的类型必须与架构中的类型对齐。`tfsdk`

使用以下内容添加提供程序数据模型类型定义。`internal/provider/provider.go`



internal/provider/provider.go

复制

```go
// hashicupsProviderModel maps provider schema data to a Go type.
type hashicupsProviderModel struct {
    Host     types.String `tfsdk:"host"`
    Username types.String `tfsdk:"username"`
    Password types.String `tfsdk:"password"`
}
```

## 实现客户端配置功能

提供程序使用该方法从 Terraform 配置或环境变量中读取 API 客户端配置值。验证值是否可接受后，将创建 API 客户端并使其可用于数据源和资源使用。`Configure`

配置方法遵循以下步骤：

1. **从配置中检索值。**该方法将尝试从提供程序配置中检索值并将其转换为结构。`providerModel`
2. **检查未知的配置值。**如果 Terraform 配置值仅在应用其他资源后才知道，则此方法可防止客户端意外配置错误。
3. **从环境变量中检索值。**该方法从环境变量中检索值，然后使用任何设置的 Terraform 配置值重写它们。
4. **创建 API 客户端。**该方法调用 HashiCups API 客户端的函数。`NewClient`
5. **存储为数据源和资源使用情况配置的客户端。**该方法设置响应的 and 字段，以便客户端可供数据源和资源实现使用。`DataSourceData``ResourceData`

将你的方法替换为以下内容。`Configure``internal/provider/provider.go`



internal/provider/provider.go

复制

```go
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

将文件顶部的语句替换为以下内容。`import``provider/provider.go`



provider/provider.go

复制

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
```

下载新的桥杯客户端依赖项。

```shell-session
$ go get github.com/hashicorp-demoapp/hashicups-client-go@v0.1.0
go: downloading github.com/hashicorp-demoapp/hashicups-client-go v0.1.0
go: added github.com/hashicorp-demoapp/hashicups-client-go v0.1.0
```

复制

确保正确更新所有依赖项。

```shell-session
$ go mod tidy
```

复制

生成并安装更新的提供程序。

```shell-session
$ go install .
```

复制

## 在本地启动桥杯

您的 HashiCups 提供程序需要一个正在运行的 HashiCups 实例。

在另一个终端窗口中，导航到该目录。`docker_compose`

```shell-session
$ cd docker_compose
```

复制

运行以在端口 上启动 HashiCups 的本地实例。`docker-compose up``19090`

```shell-session
$ docker-compose up
```

复制

让此过程在终端窗口中运行。HashiCups 服务将在此终端中打印出日志消息。

在原始终端窗口中，通过向其运行状况检查端点发送请求来验证 HashiCups 是否正在运行。桥杯服务将使用 进行响应。`ok`

```shell-session
$ curl localhost:19090/health/readyz
ok
```

复制

## 创建桥杯用户

HashiCups需要用户名和密码才能生成JSON网络令牌（JWT） 用于针对受保护的终结点进行身份验证。您将使用此 用户向桥杯提供商进行身份验证以管理您的订单。

在以密码命名的桥杯上创建一个用户。`education``test123`

```shell-session
$ curl -X POST localhost:19090/signup -d '{"username":"education", "password":"test123"}'
{"UserID":1,"Username":"education","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1OTEwNzgwODUsInVzZXJfaWQiOjIsInVzZXJuYW1lIjoiZWR1Y2F0aW9uIn0.CguceCNILKdjOQ7Gx0u4UAMlOTaH3Dw-fsll2iXDrYU"}
```

复制

将环境变量设置为从中检索的令牌 调用终结点。您将在后面的教程中使用它。`HASHICUPS_TOKEN``/signup`

```shell-session
$ export HASHICUPS_TOKEN=ey...
```

复制

包含HashiCups日志的终端将记录注册操作。

```shell-session
api_1  | 2020-12-10T09:19:50.601Z [INFO]  Handle User | signup
```

现在，HashiCups 应用程序正在运行，可以开始验证 Terraform 提供程序配置行为了。

## 实现临时数据源

仅当提供程序支持并在 Terraform 配置中使用的有效数据源或资源时，才会发生提供程序配置。现在，请创建一个临时数据源实现，以便验证提供程序配置行为。后面的教程将指导您完成实际数据源和资源的概念和实现详细信息。

通过创建以以下内容命名的文件来添加临时数据源。`internal/provider/coffees_data_source.go`



哈希库普斯/coffees_data_source.go

复制

```go
package provider

import (
    "context"

    "github.com/hashicorp/terraform-plugin-framework/datasource"
    "github.com/hashicorp/terraform-plugin-framework/datasource/schema"
)

func NewCoffeesDataSource() datasource.DataSource {
    return &coffeesDataSource{}
}

type coffeesDataSource struct{}

func (d *coffeesDataSource) Metadata(_ context.Context, req datasource.MetadataRequest, resp *datasource.MetadataResponse) {
    resp.TypeName = req.ProviderTypeName + "_coffees"
}

func (d *coffeesDataSource) Schema(_ context.Context, _ datasource.SchemaRequest, resp *datasource.SchemaResponse) {
    resp.Schema = schema.Schema{}
}

func (d *coffeesDataSource) Read(ctx context.Context, req datasource.ReadRequest, resp *datasource.ReadResponse) {
}
```

打开文件。`internal/provider/provider.go`

通过将临时数据源替换为以下内容，将临时数据源添加到提供程序。`DataSources`



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

生成并安装更新的提供程序。

```shell-session
$ go install .
```

复制

## 验证提供程序配置

导航到该目录。`examples/provider-install-verification`

```shell-session
$ cd examples/provider-install-verification
```

复制

此目录中的 Terraform 配置文件在 Terraform 配置中没有提供程序配置值。`main.tf`



examples/provider-install-verification/main.tf

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

运行缺少提供程序配置的 Terraform 计划。Terraform 将报告缺少提供程序配置值的错误。

```shell-session
$ terraform plan
##...
╷
│ Error: Missing HashiCups API Host
│ 
│   with provider["hashicorp.com/edu/hashicups-pf"],
│   on main.tf line 9, in provider "hashicups":
│    9: provider "hashicups" {}
│ 
│ The provider cannot create the HashiCups API client as there is a missing or
│ empty value for the HashiCups API host. Set the host value in the
│ configuration or use the HASHICUPS_HOST environment variable. If either is
│ already set, ensure the value is not empty.
╵
╷
│ Error: Missing HashiCups API Username
│ 
│   with provider["hashicorp.com/edu/hashicups-pf"],
│   on main.tf line 9, in provider "hashicups":
│    9: provider "hashicups" {}
│ 
│ The provider cannot create the HashiCups API client as there is a missing or
│ empty value for the HashiCups API username. Set the username value in the
│ configuration or use the HASHICUPS_USERNAME environment variable. If either
│ is already set, ensure the value is not empty.
╵
╷
│ Error: Missing HashiCups API Password
│ 
│   with provider["hashicorp.com/edu/hashicups-pf"],
│   on main.tf line 9, in provider "hashicups":
│    9: provider "hashicups" {}
│ 
│ The provider cannot create the HashiCups API client as there is a missing or
│ empty value for the HashiCups API password. Set the password value in the
│ configuration or use the HASHICUPS_PASSWORD environment variable. If either
│ is already set, ensure the value is not empty.
╵
```

复制

加载本教程前面添加的提供程序配置方法。 来自环境变量或提供程序块的配置数据 在地形配置中。通过设置 执行 Terraform 计划时提供程序定义的 、 和环境变量。 Terraform将通过这些环境变量配置HashiCups客户端。`HASHICUPS_HOST``HASHICUPS_USERNAME``HASHICUPS_PASSWORD`

运行具有环境变量的地形规划。

```shell-session
$ HASHICUPS_HOST=http://localhost:19090 \
  HASHICUPS_USERNAME=education \
  HASHICUPS_PASSWORD=test123 \
  terraform plan
```

复制

Terraform 将报告它能够从数据源读取，而配置不能 包括对基础结构的任何更改。`hashicups_coffees.example`

```text
## ...
data.hashicups_coffees.example: Reading...
data.hashicups_coffees.example: Read complete after 0s

No changes. Your infrastructure matches the configuration.

Terraform has compared your real infrastructure against your configuration and
found no differences, so no changes are needed.
```

复制

包含桥杯日志的终端将记录登录操作。

```shell-session
api_1  | 2020-12-10T09:19:50.601Z [INFO]  Handle User | signin
```

通过设置提供程序来验证地形配置行为 地形中的架构定义 、 和值 配置。`host``username``password`

创建一个目录并导航到该目录。`examples/coffees`

```shell-session
$ mkdir ../coffees && cd "$_"
```

复制

在此目录中创建一个 Terraform 配置文件，用于在 Terraform 配置中设置提供程序配置值。`main.tf`



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
```

运行地形规划。Terraform 将使用您的 HashiCups 实例进行身份验证 使用提供程序块中的值，并再次报告它能够 从数据源读取。`hashicups_coffees.example`

```shell-session
$ terraform plan
##...
data.hashicups_coffees.edu: Reading...
data.hashicups_coffees.edu: Read complete after 0s
##...
```

复制

导航到该目录。`terraform-provider-hashicups-pf`

```shell-session
$ cd ../..
```

复制

## 删除临时数据源

在继续学习下一教程之前，请删除临时数据的代码 源。

删除该文件。`internal/provider/coffees_data_source.go`

```shell-session
$ rm internal/provider/coffees_data_source.go
```

复制

打开文件。`internal/provider/provider.go`

通过将该方法替换为以下内容，从提供程序的架构中删除数据源。`DataSources`



internal/provider/provider.go

复制

```go
// DataSources defines the data sources implemented in the provider.
func (p *hashicupsProvider) DataSources(_ context.Context) []func() datasource.DataSource {
    return nil
}
```

生成并安装更新的提供程序。

```shell-session
$ go install .
```

复制

## 后续步骤

祝贺！您已准备好提供程序与 API 客户端通信。后面的教程将介绍如何实现数据源和资源功能。

如果在本教程中遇到困难，请查看[`提供程序配置`](https://github.com/hashicorp/terraform-provider-hashicups-pf/tree/provider)分支以查看本教程中实现的更改。

- 了解有关 Terraform 插件的更多信息 框架，参考 [Terraform 插件框架 文档](https://developer.hashicorp.com/terraform/plugin/framework)。
- 有关 SDKv2 和插件框架之间的完整功能比较， 请参阅[我应该使用哪个 SDK？ 文档](https://developer.hashicorp.com/terraform/plugin/which-sdk)。
- The Terraform HashiCups （plugin-framework） 提供程序的主[``分支](https://github.com/hashicorp/terraform-provider-hashicups-pf)包含完整的 HashiCups 提供程序。它包括一个数据源 使用插件框架编写并实现创建、读取、更新和删除 订单资源的功能。
- 向 [Terraform 插件框架 Github 存储库](https://github.com/hashicorp/terraform-plugin-framework)中的开发团队提交任何 Terraform 插件框架错误报告或功能请求。
- 在 [Terraform 插件框架讨论论坛中提交任何 Terraform 插件框架](https://discuss.hashicorp.com/c/terraform-providers/tf-plugin-sdk/43)问题。