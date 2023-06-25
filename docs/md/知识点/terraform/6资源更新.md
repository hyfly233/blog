# 实施资源更新

1. 验证 schema 和 model
2. 实现 resource update
3. 使用 plan modifier 增强 plan output
4. 验证 update 功能



## 验证 schema 和 model

验证 Schema 方法包含名为 last_updated 的属性

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

验证 `orderResourceModel` 是否包含 `last_updated` 字段

```go
type orderResourceModel struct {
    ID          types.String     `tfsdk:"id"`
    Items       []orderItemModel `tfsdk:"items"`
    LastUpdated types.String     `tfsdk:"last_updated"`
}
```



## 实现 update

Provider 使用 Update 方法基于 schema 数据更新现有 resource，Update 方法遵循以下步骤：

1. 从 plan 中检索值
2. 从 plan 值生成 API 请求体
3. 更新订单
4. 将 response 正文映射到 resource schema 属性
5. 设置 `LastUpdated` 属性
6. 使用更新后的订单设置 Terraform state

编辑 `internal/provider/order_resource.go`

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

更新 provider

```shell
$ go install .
```



## 验证 update 功能

导航到目录 `examples/order`

```shell
$ cd examples/order
```

编辑 `examples/order/main.tf`

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

执行 terraform plan

```shell
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



## 增强 plan output

可配置的 Terraform Plugin Framework 属性不应该显示现有状态值的更新，应该使用 `UseStateForUnknown()` plan 修饰符

编辑 `internal/provider/order_resource.go`

```go
"id": schema.StringAttribute{
    Computed: true,
    PlanModifiers: []planmodifier.String{
        stringplanmodifier.UseStateForUnknown(),
    },
},
```


