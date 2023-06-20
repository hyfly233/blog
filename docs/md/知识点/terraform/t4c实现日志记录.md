# 实现日志记录

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

