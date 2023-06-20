# 实施资源更新





在本教程中，您将向提供程序的资源添加更新功能，该提供程序与名为 Hashicups 的虚构咖啡店应用程序的 API 进行交互。为此，您将：`order`

1. **验证架构和模型。**
   验证属性是否在资源架构和模型中。每当更新订单资源时，提供程序都会将此属性更新为当前日期时间。`last_updated``order`
2. **实现资源更新。**
   此更新方法使用 HashiCups 客户端库调用对具有请求正文中更新的订单项的终结点的请求。更新成功后，它会更新资源的状态。`PUT``/orders/{orderId}`
3. **使用计划修改器增强计划输出。**
   这阐明了属性的计划输出，以通过在更新时保留现有状态值来消除其差异。`id`
4. **验证更新功能。**
   这可确保资源按预期工作。



内部/提供商/order_resource.go

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

验证您的类型是否包含用于处理属性的字段。`orderResourceModel``last_updated`



内部/提供商/order_resource.go

```go
type orderResourceModel struct {
    ID          types.String     `tfsdk:"id"`
    Items       []orderItemModel `tfsdk:"items"`
    LastUpdated types.String     `tfsdk:"last_updated"`
}
```

## 实现更新功能

提供程序使用该方法基于架构数据更新现有资源。`Update`

更新方法遵循以下步骤：

1. **从计划中检索值。**该方法将尝试从计划中检索值并将其转换为 .该模型包括订单的属性，该属性指定要更新的订单。`orderResourceModel``id`
2. **从计划值生成 API 请求正文。**该方法循环遍历每个计划项，并将其映射到 .这是 API 客户端更新现有订单所需的内容。`hashicups.OrderItem`
3. **更新订单。**该方法使用订单的 ID 和订单项调用 API 客户端的方法。`UpdateOrder`
4. **将响应正文映射到资源架构属性。**该方法更新顺序后，它会将响应映射到，以便提供程序可以更新 Terraform 状态。`hashicups.Order``[]OrderItem`
5. **设置“上次更新时间”属性。**该方法将订单的“上次更新时间”属性设置为当前系统时间。
6. **使用更新的顺序设置地形的状态。**

打开文件。`internal/provider/order_resource.go`

将订单资源的方法替换为以下内容。`Update``order_resource.go`



内部/提供商/order_resource.go

复制

```go
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

生成并安装更新的提供程序。

```shell-session
$ go install .
```

复制

## 验证更新功能

导航到该目录。这包含 Terraform HashiCups 提供程序的示例 Terraform 配置。`examples/order`

```shell-session
$ cd examples/order
```

复制

替换 中的资源。此配置更改顺序中的饮料和数量。`hashicups_order.edu``examples/order/main.tf`



examples/order/main.tf

复制

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

规划配置。

```shell-session
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

复制

请注意，该属性显示的是计划差异，其中值为 从已知值变为未知值 （）。`id``(known after apply)`

```mdx-code-blocks_codeBlockMargin__TI7B4
      ~ id           = "1" -> (known after apply)
```

复制

在更新期间，此属性值预计不会更改。为了防止 从业者混淆，在下一节中，您将更新属性的 定义以在更新时保留现有状态值。`id`

## 增强计划输出

地形插件框架属性不可配置，应该 不显示来自现有状态值的更新应实现计划修饰符。`UseStateForUnknown()`

打开文件。`internal/provider/order_resource.go`

将方法中的属性定义替换为以下内容。`id``Schema`



内部/提供商/order_resource.go

复制

```go
            "id": schema.StringAttribute{
                Computed: true,
                PlanModifiers: []planmodifier.String{
                    stringplanmodifier.UseStateForUnknown(),
                },
            },
```

将该语句替换为以下内容。`import`



内部/提供商/order_resource.go

复制

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
```

在终端中，导航到该目录。`terraform-provider-hashicups-pf`

```shell-session
cd ../..
```

复制

生成并安装更新的提供程序。

```shell-session
go install .
```

复制

## 验证更新功能

导航回目录。`examples/order`

```shell-session
cd examples/order
```

复制

运行地形应用程序以更新您的订单。计划不会再将该属性标记为任何属性。您的提供商将更新您的订单并为该属性设置新值。`id``(known after apply)``last_updated`

```shell-session
$ terraform apply -auto-approve
##...

Apply complete! Resources: 0 added, 1 changed, 0 destroyed.

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
        "id" = 2
        "image" = "/packer.png"
        "name" = "Packer Spiced Latte"
        "price" = 350
        "teaser" = "Packed with goodness to spice up your images"
      }
      "quantity" = 3
    },
  ])
  "last_updated" = "Thursday, 09-Feb-23 11:39:35 EST"
}
```

复制

验证提供商是否通过调用桥杯 API 更新了您的订单。

```shell-session
$ curl -X GET -H "Authorization: ${HASHICUPS_TOKEN}" localhost:19090/orders/1
{"id":1,"items":[{"coffee":{"id":3,"name":"Vaulatte","teaser":"Nothing gives you a safe and secure feeling like a Vaulatte","collection":"Foundations","origin":"Spring 2015","color":"#FFD814","description":"","price":200,"image":"/vault.png","ingredients":[{"ingredient_id":1},{"ingredient_id":2}]},"quantity":2},{"coffee":{"id":2,"name":"Packer Spiced Latte","teaser":"Packed with goodness to spice up your images","collection":"Origins","origin":"Summer 2013","color":"#1FA7EE","description":"","price":350,"image":"/packer.png","ingredients":[{"ingredient_id":1},{"ingredient_id":2},{"ingredient_id":4}]},"quantity":3}]}%
```

复制

这与 Terraform 提供程序为更新您的 订单的状态。

导航回目录。`terraform-provider-hashicups-pf`

```shell-session
$ cd ../..
```

