# 使用 Terraform 插件框架实现 provider

## 先决条件

要学习本教程，您需要：

- [Go 1.19+](https://golang.org/doc/install) 已安装并配置
- [Terraform v1.0.3+](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli) 本地安装
- docker 本地安装



## 设置开发环境

克隆[Terraform Provider Scaffolding Framework repository](https://github.com/hashicorp/terraform-provider-scaffolding-framework)

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
$ go mod tidy
```

 

更新 `main.go` 的 import

```go
import (
    "context"
    "flag"
    "log"

    "github.com/hashicorp/terraform-plugin-framework/providerserver"

    "terraform-provider-hashicups-pf/internal/provider"
)
```

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



## 实现 provider

Provider 使用 ``provider.Provider` 接口作为所有实现细节的起点，此接口需要满足以下条件：

1. Metadata 方法，用于定义要包含在每个数据源和资源类型名称中的提供程序类型名称
2. Schema 方法，用于定义 provider-level 配置的 schema
3. Configure 方法，用于为 data source 和 resource 实现配置共享客户端
4. DataSources 方法，用于定义 provider 的 data sources
5. Resources 方法，用于定义 provider 的 resources

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

手动运行

```shell
$ go run main.go
This binary is a plugin. These are not meant to be executed directly.
Please execute the program that consumes these plugins, which will
load any plugins automatically
exit status 1
```

 

## 准备 Terraform 以进行本地 provider 安装

当运行 `Terraform init` 时，Terraform 会安装 provider 并验证它们的版本和校验和。Terraform 将从  provider registry 或本地注册中心下载 provider。然而，在构建您的 provider 时，需要针对 provider 的本地开发构建测试 Terraform 配置

Terraform 通过在配置文件 `.terraformrc` 中设置 `dev_overrides` 块来指定使用本地 provider

首先，找到 Go 安装二进制文件的 `GOBIN` 路径

```shell
$ go env GOBIN
/Users/<Username>/go/bin
```

编辑  `.terraformrc` 文件，将 `PATH` 替换为 `go env GOBIN` 的值

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

运行 `Terraform plan` 将报错，但也验证了 Terraform 能够成功启动本地安装的 provider，并且在开发环境中与之交互

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


