# 使用 Terraform 插件框架实现提供程序

## 先决条件

要学习本教程，您需要：

- [Go 1.19+](https://golang.org/doc/install) 已安装并配置
- [Terraform v1.0.3+](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli) 本地安装
- docker 本地安装

## 设置开发环境

克隆 [Terraform 提供程序基架框架存储库](https://github.com/hashicorp/terraform-provider-scaffolding-framework)。

```shell-session
$ git clone https://github.com/hashicorp/terraform-provider-scaffolding-framework
```

 

将目录重命名为 。`terraform-provider-hashicups-pf`

```shell-session
$ mv terraform-provider-scaffolding-framework terraform-provider-hashicups-pf
```

 

切换到克隆的存储库。

```shell-session
$ cd terraform-provider-hashicups-pf
```

 

重命名模块。`go.mod`

```shell-session
$ go mod edit -module terraform-provider-hashicups-pf
```

 

然后，安装提供程序的所有依赖项。

```shell-session
$ go mod tidy
```

 

在存储库的根目录中打开该文件，并将声明替换为以下内容。`main.go``terraform-provider-hashicups-pf``import`



主去

 

```go
import (
    "context"
    "flag"
    "log"

    "github.com/hashicorp/terraform-plugin-framework/providerserver"

    "terraform-provider-hashicups-pf/internal/provider"
)
```

在您克隆的存储库中创建一个目录，该目录将包含启动 HashiCups 本地实例所需的 Docker 配置。`docker_compose`

```shell-session
$ mkdir docker_compose
```

 

使用以下内容创建一个文件。`docker_compose/conf.json`



docker_compose/conf.json

 

```json
{
  "db_connection": "host=db port=5432 user=postgres password=password dbname=products sslmode=disable",
  "bind_address": "0.0.0.0:9090",
  "metrics_address": "localhost:9102"
}
```

使用以下内容创建一个文件。`docker_compose/docker-compose.yml`



docker_compose/docker-compose.yml

 

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

如果您在本教程中的任何时候都卡住了，请参阅 Terraform Hashicups 提供程序存储库中的[`提供程序`分支](https://github.com/hashicorp/terraform-provider-hashicups-pf/tree/provider)，以查看本教程中实现的更改。

## 实现初始提供程序类型

提供程序使用接口类型的实现作为所有实现详细信息的起点。`provider.Provider`

此接口需要满足以下条件：

1. **一个 Metadata 方法**，用于定义要包含在每个数据源和资源类型名称中的提供程序类型名称。例如，名为“hashicups_order”的资源类型的提供程序类型名称为“hashicups”。
2. 用于定义提供程序级配置的架构**的架构方法**。在本教程的后面部分，你将更新此方法以接受 HashiCups API 令牌和终结点。
3. 一种**配置方法**，用于为数据源和资源实现配置共享客户端。
4. 用于定义提供程序的数据源**的数据源方法**。
5. 用于定义提供程序的资源**的资源方法**。

转到您克隆的存储库中的目录，该目录将包含提供程序的所有 Go 代码（提供程序服务器除外）。`internal/provider`

打开该文件并将现有代码替换为以下内容。`internal/provider/provider.go`



internal/provider/provider.go

 

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

## 实现提供程序服务器

Terraform 提供程序是 Terraform 与之交互的服务器进程，用于处理每个数据源和资源操作，例如在远程系统上创建资源。在这些教程的后面部分，您将把这些 Terraform 操作连接到本地运行的 HashiCups API。

为提供商提供服务遵循以下步骤：

1. **启动提供程序服务器进程。**通过实现该函数（这是 Go 语言程序的代码执行起点），长时间运行的服务器将侦听 Terraform 请求。`main`

框架提供程序服务器还支持可选功能，例如启用对调试工具的支持。您将不会在这些教程中实现此功能。

在存储库的根目录中打开该文件，并将函数替换为以下内容。`main.go``terraform-provider-hashicups-pf``main`



主去

 

```go
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

## 验证初始提供程序

准备好 Go 依赖项后，提供程序代码应编译并运行。通过直接执行代码来验证开发环境是否正常工作。这将返回一条错误消息，因为这不是 Terraform 通常启动提供商服务器的方式，但该错误表明 Go 能够编译并运行您的提供商服务器。

手动运行提供程序。

```shell-session
$ go run main.go
This binary is a plugin. These are not meant to be executed directly.
Please execute the program that consumes these plugins, which will
load any plugins automatically
exit status 1
```

 

## 准备 Terraform 以进行本地提供程序安装

Terraform 会在您运行 时安装提供程序并验证其版本和校验和。Terraform 将从提供商注册表或本地注册表下载您的提供程序。但是，在构建提供程序时，需要针对提供程序的本地开发版本测试 Terraform 配置。开发版本不会有关联的版本号或提供程序注册表中列出的一组正式校验和。`terraform init`

Terraform 允许您通过在名为 的配置文件中设置块来使用本地提供程序构建。此块将覆盖所有其他已配置的安装方法。`dev_overrides``.terraformrc`

Terraform 会在您的主目录中搜索该文件，并应用您设置的任何配置设置。`.terraformrc`

苹果电脑窗户

首先，找到 Go 安装二进制文件的路径。您的路径可能会有所不同，具体取决于您的 Go 环境变量的配置方式。`GOBIN`

```shell-session
$ go env GOBIN
/Users/<Username>/go/bin
```

 

如果未设置 go 环境变量，请使用默认路径 .`GOBIN``/Users/<Username>/go/bin`

创建一个在主目录中调用的新文件 （），然后添加下面的块。将 更改为从上述命令返回的值。`.terraformrc``~``dev_overrides``<PATH>``go env GOBIN`



~/.terraformrc

 

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

## 本地安装提供程序并使用 Terraform 进行验证

您的 Terraform CLI 现在已准备好使用路径中本地安装的提供程序。使用示例存储库根目录中的命令将提供程序编译为二进制文件并将其安装在您的路径中。`GOBIN``go install``GOBIN`

```shell-session
$ go install .
```

 

创建一个目录，该目录将包含用于验证本地提供程序安装的 terraform 配置，并导航到该目录。`examples/provider-install-verification`

```shell-session
$ mkdir examples/provider-install-verification && cd "$_"
```

 

使用以下内容创建一个文件。`main.tf`



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

此目录中的 Terraform 配置文件使用提供程序尚不支持的“hashicups_coffees”数据源。您将在以后的教程中实现此数据源。`main.tf`

运行 Terraform 计划将报告提供程序覆盖以及错误 关于缺少的数据源。即使存在错误，这也验证了 Terraform能够成功启动本地安装的提供程序，并且 在开发环境中与之交互。

使用不存在的数据源运行地形规划。大地形态会做出回应 缺少数据源错误。

```shell-session
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

 

导航到该目录。`terraform-provider-hashicups-pf`

```shell-session
$ cd ../..
```

 

## 后续步骤

祝贺！您已经开始开发自己的自定义 Terraform 提供程序。后面的教程将介绍如何实现数据源和资源功能。

如果在本教程中遇到困难，请查看[`提供程序`](https://github.com/hashicorp/terraform-provider-hashicups-pf/tree/provider)分支以查看本教程中实现的更改。

- 了解有关 Terraform 插件的更多信息 框架，参考 [Terraform 插件框架 文档](https://developer.hashicorp.com/terraform/plugin/framework)。
- 有关 SDKv2 和插件框架之间的完整功能比较， 请参阅[我应该使用哪个 SDK？ 文档](https://developer.hashicorp.com/terraform/plugin/which-sdk)。
- The Terraform HashiCups （plugin-framework） 提供程序的主[``分支](https://github.com/hashicorp/terraform-provider-hashicups-pf)包含完整的 HashiCups 提供程序。它包括一个数据源 使用插件框架编写并实现创建、读取、更新和删除 订单资源的功能。
- 向 [Terraform 插件框架 Github 存储库](https://github.com/hashicorp/terraform-plugin-framework)中的开发团队提交任何 Terraform 插件框架错误报告或功能请求。
- 在 [Terraform 插件框架讨论论坛中提交任何 Terraform 插件框架](https://discuss.hashicorp.com/c/terraform-providers/tf-plugin-sdk/43)问题。