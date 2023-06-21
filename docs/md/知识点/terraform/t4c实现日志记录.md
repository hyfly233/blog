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

