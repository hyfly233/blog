# 配置 provider 客户端

## 实现 provider schema

Terraform Plugin Framework 使用 provider 的Schema方法来定义可接受的配置属性名称和类型。HashiCups 客户端需要正确配置主机、用户名和密码。Terraform Plugin Framework 的`types` 包含 schema 和 data model，可以使用 Terraform 的空值、未知值或已知值。

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

Terraform Plugin Framework 使用带有 tfsdk 结构字段标签的 Go 语言结构类型，将 schema 定义映射为带有实际数据的Go 语言类型。结构体中的类型必须与 schema 中的类型保持一致

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

