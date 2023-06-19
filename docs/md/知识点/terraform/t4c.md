# 实现日志记录

- 10分
- |
- 大地形态大地形态



经常引用这个？ [创建一个帐户](https://developer.hashicorp.com/sign-up)以书签教程。



在本教程中，您将在提供程序中实现日志消息，并从日志输出中筛选特殊值。然后，您将管理日志输出，以便在执行 Terraform 时查看这些日志语句。为此，您将：

1. **添加日志消息。**
   这会在 Terraform 的日志中创建提供程序定义的日志消息。
2. **添加结构化日志字段。**
   这使用提供程序定义的键值对增强了日志记录数据，从而提高了多个日志的一致性并简化了日志查看。
3. **添加日志筛选。**
   这会编辑某些日志消息或结构化日志字段数据，使其不包含在日志输出中。
4. **在命令期间查看所有 Terraform 日志输出。**
   这将显示运行 Terraform 命令的终端中的所有 Terraform 日志。
5. **在命令期间将 Terraform 日志输出保存到文件。**
   这会在运行 Terraform 命令时将所有 Terraform 日志保存到文件中。
6. **查看特定的地形日志输出。**
   这将管理 Terraform 日志输出以仅显示某些日志。

## 先决条件

要学习本教程，您需要：

- [Go 1.19+](https://golang.org/doc/install) 已安装并配置。
- [Terraform v1.0.3+](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli) 本地安装。
- 码头[工人](https://www.docker.com/products/docker-desktop)和[码头工人 撰写](https://docs.docker.com/compose/install/)以运行 本地桥杯。

继续上一教程新设置

导航到您的目录。`terraform-provider-hashicups-pf`

您的代码应与示例存储库中的 [`read-coffees` 分支](https://github.com/hashicorp/terraform-provider-hashicups-pf/tree/read-coffees)匹配。

## 实现日志消息

提供程序支持通过 Go 模块的包进行日志记录。此包实现了结构化日志记录和筛选功能。`tflog``github.com/hashicorp/terraform-plugin-log`

打开文件。`internal/provider/provider.go`

使用以下命令更新方法逻辑的顶部。`Configure`



internal/provider/provider.go

复制

```go
func (p *hashicupsProvider) Configure(ctx context.Context, req provider.ConfigureRequest, resp *provider.ConfigureResponse) {
    tflog.Info(ctx, "Configuring HashiCups client")

    // Retrieve provider data from configuration
    var config hashicupsProviderModel
    /* ... */
```

将文件开头的语句替换为以下内容。`import`



internal/provider/provider.go

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
    "github.com/hashicorp/terraform-plugin-log/tflog"
)
```

## 实现结构化日志字段

该包支持向日志记录添加其他键值对，以实现一致性和跟踪流。这些对可以通过调用添加到提供程序请求的其余部分，也可以作为任何日志记录调用的最终参数内联添加。`tflog``tflog.SetField()`

打开文件。`internal/provider/provider.go`

在提供程序的方法中，设置三个日志记录字段和一个日志 在通话前立即发送以下消息。`Configure``hashicups.NewClient()`



internal/provider/provider.go

复制

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

Add a log message at the end of the method with the following.`Configure`



hashicups/provider.go

Copy

```go
    /* ... */
    // Make the HashiCups client available during DataSource and Resource
    // type Configure methods.
    resp.DataSourceData = client
    resp.ResourceData = client

    tflog.Info(ctx, "Configured HashiCups client", map[string]any{"success": true})
}
```

## Implement log filtering

添加筛选器以在调用方法之前屏蔽用户的密码，如下所示。`tflog.Debug(ctx, "Creating HashiCups client")``Configure`



hashicups/provider.go

复制

```go
    /* ... */
    ctx = tflog.SetField(ctx, "hashicups_host", host)
    ctx = tflog.SetField(ctx, "hashicups_username", username)
    ctx = tflog.SetField(ctx, "hashicups_password", password)
    ctx = tflog.MaskFieldValuesWithFieldKeys(ctx, "hashicups_password")

    tflog.Debug(ctx, "Creating HashiCups client")
    /* ... */
```

生成并安装更新的提供程序。

```shell-session
$ go install .
```

复制

## 查看所有地形日志输出

Terraform 的日志输出由各种环境变量控制，例如 或以其他方式以 .`TF_LOG``TF_LOG_`

导航到该目录。`examples/coffees`

```shell-session
$ cd examples/coffees
```

复制

运行环境变量设置为 的地形规划。`TF_LOG``TRACE`

Terraform 将为 Terraform 本身、Terraform 插件框架和任何提供程序日志记录中的所有组件输出大量日志条目。

```shell-session
$ TF_LOG=TRACE terraform plan
##...
2022-09-19T09:33:34.487-0500 [INFO]  provider.terraform-provider-hashicups-pf: Configuring HashiCups client: tf_provider_addr=hashicorp.com/edu/hashicups-pf tf_req_id=UUID tf_rpc=ConfigureProvider @caller=PATH @module=hashicups_pf timestamp=2022-09-19T09:33:34.487-0500
2022-09-19T09:33:34.487-0500 [DEBUG] provider.terraform-provider-hashicups-pf: Creating HashiCups client: @module=hashicups_pf hashicups_password=*** tf_req_id=UUID @caller=PATH hashicups_host=http://localhost:19090 hashicups_username=education tf_provider_addr=hashicorp.com/edu/hashicups-pf tf_rpc=ConfigureProvider timestamp=2022-09-19T09:33:34.487-0500
2022-09-19T09:33:34.517-0500 [INFO]  provider.terraform-provider-hashicups-pf: Configured HashiCups client: tf_rpc=ConfigureProvider hashicups_password=*** hashicups_username=education success=true tf_provider_addr=hashicorp.com/edu/hashicups-pf tf_req_id=UUID @caller=PATH @module=hashicups_pf hashicups_host=http://localhost:19090 timestamp=2022-09-19T09:33:34.517-0500
##...
```

复制

## 保存所有地形日志输出

如果您计划在同一终端会话中查看日志，或者希望通过管道将输出传输到其他 shell 命令（如 ）。相反，Terraform 可以将此输出写入本地文件系统上的日志文件，以便在文本编辑器中打开或用于存档目的。`grep`

运行同时设置了 和 环境变量的地形规划。`TF_LOG``TF_LOG_PATH`

```shell-session
$ TF_LOG=TRACE TF_LOG_PATH=trace.txt terraform plan
```

复制

打开文件并验证它是否包含日志 您添加到提供程序方法的消息。`examples/coffees/trace.txt``Configure`

```text
##...
2022-09-30T16:23:38.515-0500 [DEBUG] provider.terraform-provider-hashicups-pf: Calling provider defined Provider Configure: tf_provider_addr=hashicorp.com/edu/hashicups-pf tf_req_id=12541d93-279d-1ec0-eac1-d2d2fcfd4030 tf_rpc=ConfigureProvider @caller=/Users/YOU/go/pkg/mod/github.com/hashicorp/terraform-plugin-framework@v0.13.0/internal/fwserver/server_configureprovider.go:12 @module=sdk.framework timestamp=2022-09-30T16:23:38.515-0500
2022-09-30T16:23:38.515-0500 [INFO]  provider.terraform-provider-hashicups-pf: Configuring HashiCups client: tf_req_id=12541d93-279d-1ec0-eac1-d2d2fcfd4030 tf_rpc=ConfigureProvider @caller=/Users/YOU/code/terraform-provider-hashicups-pf/hashicups/provider.go:66 @module=hashicups_pf tf_provider_addr=hashicorp.com/edu/hashicups-pf timestamp=2022-09-30T16:23:38.515-0500
2022-09-30T16:23:38.515-0500 [DEBUG] provider.terraform-provider-hashicups-pf: Creating HashiCups client: hashicups_password=*** tf_req_id=12541d93-279d-1ec0-eac1-d2d2fcfd4030 tf_provider_addr=hashicorp.com/edu/hashicups-pf tf_rpc=ConfigureProvider @caller=/Users/YOU/code/terraform-provider-hashicups-pf/hashicups/provider.go:171 @module=hashicups_pf hashicups_host=http://localhost:19090 hashicups_username=education timestamp=2022-09-30T16:23:38.515-0500
2022-09-30T16:23:38.524-0500 [INFO]  provider.terraform-provider-hashicups-pf: Configured HashiCups client: @module=hashicups_pf hashicups_password=*** hashicups_username=education tf_req_id=12541d93-279d-1ec0-eac1-d2d2fcfd4030 tf_rpc=ConfigureProvider @caller=/Users/YOU/code/terraform-provider-hashicups-pf/hashicups/provider.go:190 hashicups_host=http://localhost:19090 success=true tf_provider_addr=hashicorp.com/edu/hashicups-pf timestamp=2022-09-30T16:23:38.524-0500
2022-09-30T16:23:38.524-0500 [DEBUG] provider.terraform-provider-hashicups-pf: Called provider defined Provider Configure: @module=sdk.framework tf_provider_addr=hashicorp.com/edu/hashicups-pf tf_req_id=12541d93-279d-1ec0-eac1-d2d2fcfd4030 tf_rpc=ConfigureProvider @caller=/Users/YOU/go/pkg/mod/github.com/hashicorp/terraform-plugin-framework@v0.13.0/internal/fwserver/server_configureprovider.go:20 timestamp=2022-09-30T16:23:38.524-0500
##...
```

复制

删除该文件。`examples/coffees/trace.txt`

```shell-session
$ rm trace.txt
```

复制

## 查看特定的地形日志输出

前面的示例使用了日志记录级别。跟踪日志是可用的最详细的日志记录级别，可能包含大量信息，这些信息仅在您深入了解 Terraform 或 Terraform 插件框架的某些内部组件时才相关。您可以改为将日志记录级别降低到 、、 或 。`TRACE``DEBUG``INFO``WARN``ERROR`

运行环境变量设置为 的地形规划。`TF_LOG``INFO`

```shell-session
$ TF_LOG=INFO terraform plan
2022-09-30T16:27:38.446-0500 [INFO]  Terraform version: 1.3.0
2022-09-30T16:27:38.447-0500 [INFO]  Go runtime version: go1.19.1
2022-09-30T16:27:38.447-0500 [INFO]  CLI args: []string{"terraform", "plan"}
##...
```

复制

您可以为某些组件启用日志输出，例如仅提供程序日志，而不启用 Terraform CLI 日志。

运行环境变量设置为 的地形规划。`TF_LOG_PROVIDER``INFO`

```shell-session
$ TF_LOG_PROVIDER=INFO terraform plan
##...
2022-12-14T10:39:33.247-0600 [INFO]  provider.terraform-provider-hashicups-pf: Configuring HashiCups client: @caller=/Users/YOU/code/terraform-provider-hashicups-pf/hashicups/provider.go:61 @module=hashicups_pf tf_provider_addr=hashicorp.com/edu/hashicups-pf tf_req_id=45969718-ed46-42b3-2cb9-847635d5aebb tf_rpc=ConfigureProvider timestamp=2022-12-14T10:39:33.247-0600
2022-12-14T10:39:33.255-0600 [INFO]  provider.terraform-provider-hashicups-pf: Configured HashiCups client: success=true hashicups_host=http://localhost:19090 hashicups_username=education tf_provider_addr=hashicorp.com/edu/hashicups-pf tf_req_id=45969718-ed46-42b3-2cb9-847635d5aebb tf_rpc=ConfigureProvider @caller=/Users/YOU/code/terraform-provider-hashicups-pf/hashicups/provider.go:184 @module=hashicups_pf timestamp=2022-12-14T10:39:33.255-0600
data.hashicups_coffees.edu: Reading...
data.hashicups_coffees.edu: Read complete after 0s
##...
```

复制

导航到该目录。`terraform-provider-hashicups-pf`

```shell-session
cd ../..
```

复制

## 后续步骤

祝贺！您已在提供程序中实现了日志记录，查看了它，并优化了输出。

如果在本教程中遇到困难，请查看[`日志记录`](https://github.com/hashicorp/terraform-provider-hashicups-pf/tree/logging)分支以查看本教程中实现的更改。

- 了解有关 Terraform 插件的更多信息 框架，参考 [Terraform 插件框架 文档](https://developer.hashicorp.com/terraform/plugin/framework)。
- 有关 SDKv2 和插件框架之间的完整功能比较， 请参阅[我应该使用哪个 SDK？ 文档](https://developer.hashicorp.com/terraform/plugin/which-sdk)。
- The Terraform HashiCups （plugin-framework） 提供程序的主[``分支](https://github.com/hashicorp/terraform-provider-hashicups-pf)包含完整的 HashiCups 提供程序。它包括一个数据源 使用插件框架编写并实现创建、读取、更新和删除 订单资源的功能。
- 向 [Terraform 插件框架 Github 存储库](https://github.com/hashicorp/terraform-plugin-framework)中的开发团队提交任何 Terraform 插件框架错误报告或功能请求。
- 在 [Terraform 插件框架讨论论坛中提交任何 Terraform 插件框架](https://discuss.hashicorp.com/c/terraform-providers/tf-plugin-sdk/43)问题。