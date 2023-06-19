# 实现资源创建和读取

## 步骤

1. 定义初始 resource 类型
2. 将 resource 添加到 provider 中
3. 在 resource 中实现 HashiCups 客户端
4. 定义 resource 的 schema
5. 定义 resource 的 data mode
6. 定义 resource 的 create 逻辑
7. 定义 resource 的 read 逻辑
8. 验证 resource 的行为



## 实现初始 resource 类型

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



## 将 resource 添加到 provider 中

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



## 实现 resource 客户端功能

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



## 实现 Schema

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



## 实现 data model

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