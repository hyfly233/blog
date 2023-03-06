##  Elasticsearch 关键概念 

### 节点

它指的是Elasticsearch的单个运行实例。单个物理和虚拟服务器可容纳多个节点，这取决于它们的物理资源（如RAM、存储和处理能力）的能力。

### 群集

它是一个或多个节点的集合。群集为所有数据提供了跨所有节点的集体索引和搜索功能。

### 索引

它是不同类型的文档及其属性的集合。索引还使用分片的概念来提高性能。例如，一组文档包含社交网络应用程序的数据。

### 文档

它是以JSON格式定义的特定方式的字段集合。每个文档都属于一种类型，并且位于索引内。每个文档都与一个称为UID的唯一标识符相关联。

### 碎片

索引在水平方向上细分为碎片。这意味着每个分片都包含文档的所有属性，但所包含的JSON对象的数量要少于索引。水平分隔使分片成为一个独立的节点，可以将其存储在任何节点中。主分片是索引的原始水平部分，然后将这些主分片复制到副本分片中。

### 副本

Elasticsearch允许用户创建索引和碎片的副本。复制不仅有助于在发生故障时提高数据的可用性，而且还通过在这些副本中执行并行搜索操作来提高搜索性能。

### 优势

- Elasticsearch是在Java上开发的，这使得它在几乎所有平台上都兼容。
- Elasticsearch是实时的，一秒钟后添加的文档就可以在这个引擎中搜索了
- Elasticsearch是分布式的，因此可以轻松地在任何大型组织中进行扩展和集成。
- 使用 gateway 的概念创建完整的备份非常简单，这个概念在 Elasticsearch 很常见。
- 与Apache Solr相比，在Elasticsearch中处理多租户非常容易。
- Elasticsearch使用JSON对象作为响应，这使得可以使用大量不同的编程语言来调用Elasticsearch服务器。
- 除了不支持文本渲染的文档类型外，Elasticsearch支持几乎所有文档类型。

### 缺点

- 在处理请求和响应数据方面，Elasticsearch不提供多语言支持（仅在JSON中可用），与Apache Solr不同，后者可以CSV，XML和JSON格式。



## Elasticsearch 填充

### 创建索引

您可以使用以下命令创建索引-

```
PUT school
```

响应

如果创建了索引，则可以看到以下输出-

```
{"acknowledged": true}
```

### 添加数据

Elasticsearch将存储添加到索引中的文档。给文档提供了一些ID，用于识别文档。

请求正文

```
POST school/_doc/10
{
   "name":"Saint Paul School", "description":"ICSE Afiliation",
   "street":"Dawarka", "city":"Delhi", "state":"Delhi", "zip":"110075",
   "location":[28.5733056, 77.0122136], "fees":5000,
   "tags":["Good Faculty", "Great Sports"], "rating":"4.5"
}
```

响应

```
{
   "_index" : "school",
   "_type" : "_doc",
   "_id" : "10",
   "_version" : 1,
   "result" : "created",
   "_shards" : {
      "total" : 2,
      "successful" : 1,
      "failed" : 0
   },
   "_seq_no" : 2,
   "_primary_term" : 1
}
```

在这里，添加另一个类似的文档。

```
POST school/_doc/16
{
   "name":"Crescent School", "description":"State Board Affiliation",
   "street":"Tonk Road",
   "city":"Jaipur", "state":"RJ", "zip":"176114","location":[26.8535922,75.7923988],
   "fees":2500, "tags":["Well equipped labs"], "rating":"4.5"
}
```

响应

```
{
   "_index" : "school",
   "_type" : "_doc",
   "_id" : "16",
   "_version" : 1,
   "result" : "created",
   "_shards" : {
      "total" : 2,
      "successful" : 1,
      "failed" : 0
   },
   "_seq_no" : 9,
   "_primary_term" : 7
}
```



## Elasticsearch API约定

### 多个索引

API中的大多数操作，主要是搜索和其他操作，都是针对一个或多个索引的。这有助于用户只需执行一次查询，就可以在多个位置或所有可用数据中进行搜索。许多不同的符号用于在多个索引中执行操作。我们将在本章中讨论其中的一些。

逗号分隔符号

```
POST /index1,index2,index3/_search
```

请求正文

```
{
   "query":{
      "query_string":{
         "query":"any_string"
      }
   }
}
```

响应

来自index1, index2, index3的JSON对象中包含any_string



### _all 所有索引的关键字

```
POST /_all/_search
```

请求正文

```
{
   "query":{
      "query_string":{
         "query":"any_string"
      }
   }
}
```

响应

来自所有索引的JSON对象，其中包含any_string



### 通配符（*，+，–）

```
POST /school*/_search
```

请求正文

```
{
   "query":{
      "query_string":{
         "query":"CBSE"
      }
   }
}
```

响应

来自所有索引的JSON对象，这些索引始于其中包含CBSE的学校。

另外，您也可以使用以下代码-

```
POST /school*,-schools_gov /_search
```

请求正文

```
{
   "query":{
      "query_string":{
         "query":"CBSE"
      }
   }
}
```

响应

JSON对象来自所有以“ school”开头的索引，但不是来自school_gov并包含CBSE的索引。

还有一些URL查询字符串参数-

- **ignore_unavailable**−如果index(es)URL中不存在一个或多个，则不会发生错误或将停止任何操作。例如，school索引存在，但book_shops不存在。

```
POST /school*,book_shops/_search
```

请求正文

```
{
   "query":{
      "query_string":{
         "query":"CBSE"
      }
   }
}
```

请求正文

```
{
   "error":{
      "root_cause":[{
         "type":"index_not_found_exception", "reason":"no such index",
         "resource.type":"index_or_alias", "resource.id":"book_shops",
         "index":"book_shops"
      }],
      "type":"index_not_found_exception", "reason":"no such index",
      "resource.type":"index_or_alias", "resource.id":"book_shops",
      "index":"book_shops"
   },"status":404
}
```

考虑以下代码-

```
POST /school*,book_shops/_search?ignore_unavailable = true
```

请求正文

```
{
   "query":{
      "query_string":{
         "query":"CBSE"
      }
   }
}
```

响应（无错误）

来自所有索引的JSON对象，这些索引始于其中包含CBSE的学校。



### allow_no_indices

**true**如果带有通配符的URL没有索引，则此参数的值将防止错误。例如，没有以schools_pri开头的索引-

```
POST /schools_pri*/_search?allow_no_indices = true
```

请求正文

```
{
   "query":{
      "match_all":{}
   }
}
```

响应（无错误）

```
{
   "took":1,"timed_out": false, "_shards":{"total":0, "successful":0, "failed":0},
   "hits":{"total":0, "max_score":0.0, "hits":[]}
}
```



### expand_wildcards

此参数决定通配符是否需要扩展为开放索引或封闭索引，或同时执行这两者。此参数的值可以是打开和关闭的，也可以是没有。

例如，封闭索引学校-

```
POST /schools/_close
```

响应

```
{"acknowledged":true}
```

考虑以下代码-

```
POST /school*/_search?expand_wildcards = closed
```

请求正文

```
{
   "query":{
      "match_all":{}
   }
}
```

响应

```
{
   "error":{
      "root_cause":[{
         "type":"index_closed_exception", "reason":"closed", "index":"schools"
      }],
      "type":"index_closed_exception", "reason":"closed", "index":"schools"
   }, "status":403
}
```



### 索引名称中的日期数学支持

Elasticsearch提供了根据日期和时间搜索索引的功能。我们需要以特定格式指定日期和时间。例如，accountdetail-2015.12.30，索引将存储2015年12月30日的银行帐户详细信息。可以执行数学运算以获取特定日期或日期和时间范围的详细信息。

日期数学索引名称的格式-

```
<static_name{date_math_expr{date_format|time_zone}}>
/<accountdetail-{now-2d{YYYY.MM.dd|utc}}>/_search
```

static_name是表达式的一部分，在每个日期的数学索引（如客户明细）中都保持不变。date_math_expr包含数学表达式，该数学表达式像now-2d一样动态确定日期和时间。date_format包含将日期写入诸如YYYY.MM.dd之类的索引中的格式。如果今天是2015年12月30日，则<accountdetail- {now-2d {YYYY.MM.dd}}>将返回accountdetail-2015.12.28。

| 表达                           | 解析为                   |
| :----------------------------- | :----------------------- |
| <accountdetail-{now-d}>        | accountdetail-2015.12.29 |
| <accountdetail-{now-M}>        | accountdetail-2015.11.30 |
| <accountdetail-{now{YYYY.MM}}> | accountdetail-2015.12    |

现在，我们将看到Elasticsearch中提供的一些常用选项，这些选项可用于获取指定格式的响应。



### 美化的结果

我们可以通过添加URL查询参数（即pretty = true）来在格式良好的JSON对象中获得响应。

```
POST /schools/_search?pretty = true
```

请求正文

```
{
   "query":{
      "match_all":{}
   }
}
```

响应

```
……………………..
{
   "_index" : "schools", "_type" : "school", "_id" : "1", "_score" : 1.0,
   "_source":{
      "name":"Central School", "description":"CBSE Affiliation",
      "street":"Nagan", "city":"paprola", "state":"HP", "zip":"176115",
      "location": [31.8955385, 76.8380405], "fees":2000,
      "tags":["Senior Secondary", "beautiful campus"], "rating":"3.5"
   }
}
………………….
```



### 人类可读的输出

此选项可以将统计响应更改为人类可读形式（如果human = true）或计算机可读形式（如果human = false）。例如，如果human = true，则distance_kilometer = 20KM；如果human = false，则distance_meter = 20000，此时需要其他计算机程序使用响应。

响应过滤

通过将它们添加到field_path参数中，我们可以过滤对较少字段的响应。例如，

```
POST /schools/_search?filter_path = hits.total
```

请求正文

```
{
   "query":{
      "match_all":{}
   }
}
```

响应

```
{"hits":{"total":3}}
```



## Elasticsearch 文档API

Elasticsearch提供了单文档API和多文档API，其中API调用分别针对单个文档和多个文档。

### 索引API

当对具有特定映射的相应索引进行请求时，它有助于在索引中添加或更新JSON文档。例如，以下请求会将JSON对象添加到索引学校和学校映射下-

```
PUT schools/_doc/5
{
   name":"City School", "description":"ICSE", "street":"West End",
   "city":"Meerut",
   "state":"UP", "zip":"250002", "location":[28.9926174, 77.692485],
   "fees":3500,
   "tags":["fully computerized"], "rating":"4.5"
}
```

在运行上面的代码时，我们得到以下结果-

```
{
   "_index" : "schools",
   "_type" : "_doc",
   "_id" : "5",
   "_version" : 1,
   "result" : "created",
   "_shards" : {
      "total" : 2,
      "successful" : 1,
      "failed" : 0
   },
   "_seq_no" : 2,
   "_primary_term" : 1
}
```

### 自动索引创建

当请求将JSON对象添加到特定索引时，如果该索引不存在，则此API会自动创建该索引以及该特定JSON对象的基础映射。可以通过将elasticsearch.yml文件中存在的以下参数的值更改为false来禁用此功能。

```
action.auto_create_index:false
index.mapper.dynamic:false
```

您还可以限制索引的自动创建，通过更改以下参数的值，只允许使用具有特定模式的索引名称-

```
action.auto_create_index:+acc*,-bank*
```

**注意**：此处 + 表示允许，而 – 表示不允许。

### 版本控制

Elasticsearch还提供了版本控制工具。我们可以使用版本查询参数来指定特定文档的版本。

```
PUT schools/_doc/5?version=7&version_type=external
{
   "name":"Central School", "description":"CBSE Affiliation", "street":"Nagan",
   "city":"paprola", "state":"HP", "zip":"176115", "location":[31.8955385, 76.8380405],
   "fees":2200, "tags":["Senior Secondary", "beautiful campus"], "rating":"3.3"
}
```

在运行上面的代码时，我们得到以下结果-

```
{
   "_index" : "schools",
   "_type" : "_doc",
   "_id" : "5",
   "_version" : 7,
   "result" : "updated",
   "_shards" : {
      "total" : 2,
      "successful" : 1,
      "failed" : 0
   },
   "_seq_no" : 3,
   "_primary_term" : 1
}
```

版本控制是一个实时过程，不受实时搜索操作的影响。

有两种最重要的版本控制类型-

### 内部版本控制

内部版本控制是默认版本，从1开始，并随着每次更新（包括删除）而递增。

### 外部版本控制

当文档的版本控制存储在外部系统（如第三方版本控制系统）中时，将使用此功能。要启用此功能，我们需要将version_type设置为external。在这里，Elasticsearch将存储外部系统指定的版本号，并且不会自动对其进行递增。

### 操作类型

操作类型用于强制执行创建操作。这有助于避免覆盖现有文档。

```
PUT chapter/_doc/1?op_type=create
{
   "Text":"this is chapter one"
}
```

在运行上面的代码时，我们得到以下结果-

```
{
   "_index" : "chapter",
   "_type" : "_doc",
   "_id" : "1",
   "_version" : 1,
   "result" : "created",
   "_shards" : {
      "total" : 2,
      "successful" : 1,
      "failed" : 0
   },
   "_seq_no" : 0,
   "_primary_term" : 1
}
```

### 自动ID生成

如果在索引操作中未指定ID，则Elasticsearch会自动为该文档生成ID。

```
POST chapter/_doc/
{
   "user" : "tpoint",
   "post_date" : "2018-12-25T14:12:12",
   "message" : "Elasticsearch Tutorial"
}
```

在运行上面的代码时，我们得到以下结果-

```
{
   "_index" : "chapter",
   "_type" : "_doc",
   "_id" : "PVghWGoB7LiDTeV6LSGu",
   "_version" : 1,
   "result" : "created",
   "_shards" : {
      "total" : 2,
      "successful" : 1,
      "failed" : 0
   },
   "_seq_no" : 1,
   "_primary_term" : 1
}
```

### 获取API

API通过对特定文档执行get请求来帮助提取类型JSON对象。

```
pre class="prettyprint notranslate" > GET schools/_doc/5
```

在运行上面的代码时，我们得到以下结果-

```
{
   "_index" : "schools",
   "_type" : "_doc",
   "_id" : "5",
   "_version" : 7,
   "_seq_no" : 3,
   "_primary_term" : 1,
   "found" : true,
   "_source" : {
      "name" : "Central School",
      "description" : "CBSE Affiliation",
      "street" : "Nagan",
      "city" : "paprola",
      "state" : "HP",
      "zip" : "176115",
      "location" : [
         31.8955385,
         76.8380405
      ],
      "fees" : 2200,
      "tags" : [
         "Senior Secondary",
         "beautiful campus"
      ],
      "rating" : "3.3"
   }
}
```

- 此操作是实时的，不受索引刷新率的影响。
- 您还可以指定版本，然后Elasticsearch将仅获取该文档的版本。
- 您还可以在请求中指定_all，以便Elasticsearch可以按每种类型搜索该文档ID，它将返回第一个匹配的文档。
- 您还可以在特定文档的结果中指定所需的字段。

```
GET schools/_doc/5?_source_includes=name,fees
```

在运行上面的代码时，我们得到以下结果-

```
{
   "_index" : "schools",
   "_type" : "_doc",
   "_id" : "5",
   "_version" : 7,
   "_seq_no" : 3,
   "_primary_term" : 1,
   "found" : true,
   "_source" : {
      "fees" : 2200,
      "name" : "Central School"
   }
}
```

您还可以通过在get请求中添加_source部分来获取结果中的源部分。

```
GET schools/_doc/5?_source
```

在运行上面的代码时，我们得到以下结果-

```
{
   "_index" : "schools",
   "_type" : "_doc",
   "_id" : "5",
   "_version" : 7,
   "_seq_no" : 3,
   "_primary_term" : 1,
   "found" : true,
   "_source" : {
      "name" : "Central School",
      "description" : "CBSE Affiliation",
      "street" : "Nagan",
      "city" : "paprola",
      "state" : "HP",
      "zip" : "176115",
      "location" : [
         31.8955385,
         76.8380405
      ],
      "fees" : 2200,
      "tags" : [
         "Senior Secondary",
         "beautiful campus"
      ],
      "rating" : "3.3"
   }
}
```

您还可以通过将refresh参数设置为true来刷新分片，然后再执行get操作。

### 删除API

您可以通过向Elasticsearch发送HTTP DELETE请求来删除特定的索引，映射或文档。

```
DELETE schools/_doc/4
```

在运行上面的代码时，我们得到以下结果-

```
{
   "found":true, "_index":"schools", "_type":"school", "_id":"4", "_version":2,
   "_shards":{"total":2, "successful":1, "failed":0}
}
```

可以指定文档的版本以删除该特定版本。可以指定路由参数以从特定用户删除文档，并且如果文档不属于该特定用户，则操作将失败。在此操作中，您可以像GET API一样指定刷新和超时选项。

### 更新API

脚本用于执行此操作，版本控制用于确保在获取和重新编制索引期间未发生任何更新。例如，您可以使用脚本更新学费-

```
POST schools/_update/4
{
   "script" : {
      "source": "ctx._source.name = params.sname",
      "lang": "painless",
      "params" : {
         "sname" : "City Wise School"
      }
   }
 }
```

在运行上面的代码时，我们得到以下结果-

```
{
   "_index" : "schools",
   "_type" : "_doc",
   "_id" : "4",
   "_version" : 3,
   "result" : "updated",
   "_shards" : {
      "total" : 2,
      "successful" : 1,
      "failed" : 0
   },
   "_seq_no" : 4,
   "_primary_term" : 2
}
```



## Elasticsearch 搜索API

该API用于在Elasticsearch中搜索内容。用户可以通过发送带有查询字符串作为参数的get请求进行搜索，或者可以在发布请求的消息正文中发布查询。搜索 api 主要是多索引、多类型的。

### 多索引

Elasticsearch允许我们搜索所有索引或某些特定索引中存在的文档。例如，如果我们需要搜索名称包含“ central”的所有文档，则可以执行以下操作：

```
GET /_all/_search?q=city:paprola
```

在运行上面的代码时，我们得到以下响应-

```
{
   "took" : 33,
   "timed_out" : false,
   "_shards" : {
      "total" : 7,
      "successful" : 7,
      "skipped" : 0,
      "failed" : 0
   },
   "hits" : {
      "total" : {
         "value" : 1,
         "relation" : "eq"
      },
      "max_score" : 0.9808292,
      "hits" : [
         {
            "_index" : "schools",
            "_type" : "school",
            "_id" : "5",
            "_score" : 0.9808292,
            "_source" : {
               "name" : "Central School",
               "description" : "CBSE Affiliation",
               "street" : "Nagan",
               "city" : "paprola",
               "state" : "HP",
               "zip" : "176115",
               "location" : [
                  31.8955385,
                  76.8380405
               ],
               "fees" : 2200,
               "tags" : [
                  "Senior Secondary",
                  "beautiful campus"
               ],
               "rating" : "3.3"
            }
         }
      ]
   }
}
```

### URI搜索

可以使用统一资源标识符在搜索操作中传递许多参数-

| 序号 | 参数及说明                                                   |
| :--- | :----------------------------------------------------------- |
| 1    | **Q**此参数用于指定查询字符串                                |
| 2    | **lenient**此参数用于指定查询字符串。只要将此参数设置为 true，就可以忽略基于 Formatbased 的错误。默认情况下它是假的。 |
| 3    | **fields**此参数用于指定查询字符串                           |
| 4    | **sort**我们可以通过使用这个参数得到排序的结果，这个参数的可能值是fieldName, fieldName:asc/ fieldName:desc |
| 5    | **timeout**我们可以通过使用这个参数来限制搜索时间，并且响应只包含指定时间内的命中。默认情况下，没有超时 |
| 6    | **terminate_after**们可以将响应限制为每个碎片的指定数量的文档，到达该分片时，查询将提前终止。默认情况下，没有 termin_after. |
| 7    | **from**要返回的命中数的起始索引。默认为0。                  |
| 8    | **size**它表示要返回的命中数，默认值为10。                   |

### 请求正文搜索

可以在请求正文中使用查询DSL来指定查询

```
POST /schools/_search
{
   "query":{
      "query_string":{
         "query":"up"
      }
   }
}
```

在运行上面的代码时，我们得到以下响应-

```
{
   "took" : 11,
   "timed_out" : false,
   "_shards" : {
      "total" : 1,
      "successful" : 1,
      "skipped" : 0,
      "failed" : 0
   },
   "hits" : {
      "total" : {
         "value" : 1,
         "relation" : "eq"
      },
      "max_score" : 0.47000363,
      "hits" : [
         {
            "_index" : "schools",
            "_type" : "school",
            "_id" : "4",
            "_score" : 0.47000363,
            "_source" : {
               "name" : "City Best School",
               "description" : "ICSE",
               "street" : "West End",
               "city" : "Meerut",
               "state" : "UP",
               "zip" : "250002",
               "location" : [
                  28.9926174,
                  77.692485
               ],
               "fees" : 3500,
               "tags" : [
                  "fully computerized"
               ],
               "rating" : "4.5"
            }
         }
      ]
   }
}
```





## Elasticsearch 聚合

聚合框架收集搜索查询选择的所有数据，并由许多构建块组成，这有助于构建数据的复杂摘要。聚合的基本结构如下所示-

```
"aggregations" : {
   "" : {
      "" : {

      }
 
      [,"meta" : { [] } ]?
      [,"aggregations" : { []+ } ]?
   }
   [,"" : { ... } ]*
}
```

聚合有不同的类型，每种类型都有自己的目的。本章将详细讨论这些问题。

### 指标聚合

这些聚合有助于根据聚合文档的字段值计算矩阵，有时还可以从脚本生成一些值。

数值矩阵既可以是单值（如平均聚合），也可以是多值（如统计数据）。

### 平均聚合

此聚合用于获取聚合文档中存在的任何数字字段的平均值。例如，

```
POST /schools/_search
{
   "aggs":{
      "avg_fees":{"avg":{"field":"fees"}}
   }
}
```

在运行上面的代码时，我们得到以下结果-

```
{
   "took" : 41,
   "timed_out" : false,
   "_shards" : {
      "total" : 1,
      "successful" : 1,
      "skipped" : 0,
      "failed" : 0
   },
   "hits" : {
      "total" : {
         "value" : 2,
         "relation" : "eq"
      },
      "max_score" : 1.0,
      "hits" : [
         {
            "_index" : "schools",
            "_type" : "school",
            "_id" : "5",
            "_score" : 1.0,
            "_source" : {
               "name" : "Central School",
               "description" : "CBSE Affiliation",
               "street" : "Nagan",
               "city" : "paprola",
               "state" : "HP",
               "zip" : "176115",
               "location" : [
                  31.8955385,
                  76.8380405
               ],
            "fees" : 2200,
            "tags" : [
               "Senior Secondary",
               "beautiful campus"
            ],
            "rating" : "3.3"
         }
      },
      {
         "_index" : "schools",
         "_type" : "school",
         "_id" : "4",
         "_score" : 1.0,
         "_source" : {
            "name" : "City Best School",
            "description" : "ICSE",
            "street" : "West End",
            "city" : "Meerut",
            "state" : "UP",
            "zip" : "250002",
            "location" : [
               28.9926174,
               77.692485
            ],
            "fees" : 3500,
            "tags" : [
               "fully computerized"
            ],
            "rating" : "4.5"
         }
      }
   ]
 },
   "aggregations" : {
      "avg_fees" : {
         "value" : 2850.0
      }
   }
}
```

### 基数聚合

此聚合提供了特定字段的不同值的计数。

```
POST /schools/_search?size=0
{
   "aggs":{
      "distinct_name_count":{"cardinality":{"field":"fees"}}
   }
}
```

在运行上面的代码时，我们得到以下结果-

```
{
   "took" : 2,
   "timed_out" : false,
   "_shards" : {
      "total" : 1,
      "successful" : 1,
      "skipped" : 0,
      "failed" : 0
   },
   "hits" : {
      "total" : {
         "value" : 2,
         "relation" : "eq"
      },
      "max_score" : null,
      "hits" : [ ]
   },
   "aggregations" : {
      "distinct_name_count" : {
         "value" : 2
      }
   }
}
```

**Note** −基数的值为2，因为费用有两个不同的值。

### 扩展统计数据聚合

此聚合将生成有关聚合文档中特定数字字段的所有统计信息。

```
POST /schools/_search?size=0
{
   "aggs" : {
      "fees_stats" : { "extended_stats" : { "field" : "fees" } }
   }
}
```

在运行上面的代码时，我们得到以下结果-

```
{
   "took" : 8,
   "timed_out" : false,
   "_shards" : {
      "total" : 1,
      "successful" : 1,
      "skipped" : 0,
      "failed" : 0
   },
   "hits" : {
      "total" : {
         "value" : 2,
         "relation" : "eq"
      },
      "max_score" : null,
      "hits" : [ ]
   },
   "aggregations" : {
      "fees_stats" : {
         "count" : 2,
         "min" : 2200.0,
         "max" : 3500.0,
         "avg" : 2850.0,
         "sum" : 5700.0,
         "sum_of_squares" : 1.709E7,
         "variance" : 422500.0,
         "std_deviation" : 650.0,
         "std_deviation_bounds" : {
            "upper" : 4150.0,
            "lower" : 1550.0
         }
      }
   }
}
```

### 最大聚集

此聚合查找聚合文档中特定数字字段的最大值。

```
POST /schools/_search?size=0
{
   "aggs" : {
   "max_fees" : { "max" : { "field" : "fees" } }
   }
}
```

在运行上面的代码时，我们得到以下结果-

```
{
   "took" : 16,
   "timed_out" : false,
   "_shards" : {
      "total" : 1,
      "successful" : 1,
      "skipped" : 0,
      "failed" : 0
   },
  "hits" : {
      "total" : {
         "value" : 2,
         "relation" : "eq"
      },
      "max_score" : null,
      "hits" : [ ]
   },
   "aggregations" : {
      "max_fees" : {
         "value" : 3500.0
      }
   }
}
```

### 最小聚合

此聚合在聚合的文档中查找特定数字字段的最小值。

```
POST /schools/_search?size=0
{
   "aggs" : {
      "min_fees" : { "min" : { "field" : "fees" } }
   }
}
```

在运行上面的代码时，我们得到以下结果-

```
{
   "took" : 2,
   "timed_out" : false,
   "_shards" : {
      "total" : 1,
      "successful" : 1,
      "skipped" : 0,
      "failed" : 0
   },
   "hits" : {
      "total" : {
         "value" : 2,
         "relation" : "eq"
      },
      "max_score" : null,
      "hits" : [ ]
   },
  "aggregations" : {
      "min_fees" : {
         "value" : 2200.0
      }
   }
}
```

### 聚合总和

此聚合计算聚合文档中特定数值字段的和。

```
POST /schools/_search?size=0
{
   "aggs" : {
      "total_fees" : { "sum" : { "field" : "fees" } }
   }
}
```

在运行上面的代码时，我们得到以下结果-

```
{
   "took" : 8,
   "timed_out" : false,
   "_shards" : {
      "total" : 1,
      "successful" : 1,
      "skipped" : 0,
      "failed" : 0
   },
   "hits" : {
      "total" : {
         "value" : 2,
         "relation" : "eq"
      },
      "max_score" : null,
      "hits" : [ ]
   },
   "aggregations" : {
      "total_fees" : {
         "value" : 5700.0
      }
   }
}
```

在特殊情况下还有其他一些度量标准聚合，例如地理边界聚合和地理质心聚合，以实现地理位置。

### 统计聚合

一种多值度量标准聚合，可根据从聚合文档中提取的数值来计算统计信息。

```
POST /schools/_search?size=0
{
   "aggs" : {
      "grades_stats" : { "stats" : { "field" : "fees" } }
   }
}
```

在运行上面的代码时，我们得到以下结果-

```
{
   "took" : 2,
   "timed_out" : false,
   "_shards" : {
      "total" : 1,
      "successful" : 1,
      "skipped" : 0,
      "failed" : 0
   },
   "hits" : {
      "total" : {
         "value" : 2,
         "relation" : "eq"
      },
      "max_score" : null,
      "hits" : [ ]
   },
   "aggregations" : {
      "grades_stats" : {
         "count" : 2,
         "min" : 2200.0,
         "max" : 3500.0,
         "avg" : 2850.0,
         "sum" : 5700.0
      }
   }
}
```

### 聚合元数据

您可以在请求时使用meta标记添加一些有关聚合的数据，并作为响应获取。

```
POST /schools/_search?size=0
{
   "aggs" : {
      "min_fees" : { "avg" : { "field" : "fees" } ,
         "meta" :{
            "dsc" :"Lowest Fees This Year"
         }
      }
   }
}
```

在运行上面的代码时，我们得到以下结果-

```
{
   "took" : 0,
   "timed_out" : false,
   "_shards" : {
      "total" : 1,
      "successful" : 1,
      "skipped" : 0,
      "failed" : 0
   },
   "hits" : {
      "total" : {
         "value" : 2,
         "relation" : "eq"
      },
      "max_score" : null,
      "hits" : [ ]
   },
   "aggregations" : {
      "min_fees" : {
         "meta" : {
            "dsc" : "Lowest Fees This Year"
         },
         "value" : 2850.0
      }
   }
}
```



## Elasticsearch 索引API

这些API负责管理索引的所有方面，例如设置，别名，映射，索引模板。

### 创建索引

该API可帮助您创建索引。当用户将JSON对象传递给任何索引时，可以自动创建索引，也可以在此之前创建索引。要创建索引，您只需要发送带有设置，映射和别名的PUT请求，或者仅发送不带正文的简单请求。

```
PUT colleges
```

运行上面的代码后，我们得到如下所示的输出-

```
{
   "acknowledged" : true,
   "shards_acknowledged" : true,
   "index" : "colleges"
}
```

我们也可以在上面的命令中添加一些设置-

```
PUT colleges
{
  "settings" : {
      "index" : {
         "number_of_shards" : 3,
         "number_of_replicas" : 2
      }
   }
}
```

运行上面的代码后，我们得到如下所示的输出-

```
{
   "acknowledged" : true,
   "shards_acknowledged" : true,
   "index" : "colleges"
}
```

### 删除索引

此API可帮助您删除任何索引。您只需要传递带有该特定索引名称的删除请求即可。

```
DELETE /colleges
```

您可以仅使用_all或*删除所有索引。

### 获取索引

可以通过仅将get请求发送到一个或多个索引来调用此API。这将返回有关索引的信息。

```
GET colleges
```

运行上面的代码后，我们得到如下所示的输出-

```
{
   "colleges" : {
      "aliases" : {
         "alias_1" : { },
         "alias_2" : {
            "filter" : {
               "term" : {
                  "user" : "pkay"
               }
            },
            "index_routing" : "pkay",
            "search_routing" : "pkay"
         }
      },
      "mappings" : { },
      "settings" : {
         "index" : {
            "creation_date" : "1556245406616",
            "number_of_shards" : "1",
            "number_of_replicas" : "1",
            "uuid" : "3ExJbdl2R1qDLssIkwDAug",
            "version" : {
               "created" : "7000099"
            },
            "provided_name" : "colleges"
         }
      }
   }
}
```

您可以使用_all或*获取所有索引的信息。

### 索引存在

索引的存在可以通过仅向该索引发送get请求来确定。如果HTTP响应是200，则存在。如果是404，则不存在。

```
HEAD colleges
```

运行上面的代码后，我们得到如下所示的输出-

```
200-OK
```

### 索引设置

您只需在网址末尾附加_settings关键字即可获取索引设置。

```
GET /colleges/_settings
```

运行上面的代码后，我们得到如下所示的输出-

```
{
   "colleges" : {
      "settings" : {
         "index" : {
            "creation_date" : "1556245406616",
            "number_of_shards" : "1",
            "number_of_replicas" : "1",
            "uuid" : "3ExJbdl2R1qDLssIkwDAug",
            "version" : {
               "created" : "7000099"
            },
            "provided_name" : "colleges"
         }
      }
   }
}
```

### 索引统计

该API可帮助您提取有关特定索引的统计信息。您只需要在末尾发送带有索引URL和_stats关键字的get请求。

```
GET /_stats
```

运行上面的代码后，我们得到如下所示的输出-

```
………………………………………………
},
   "request_cache" : {
      "memory_size_in_bytes" : 849,
      "evictions" : 0,
      "hit_count" : 1171,
      "miss_count" : 4
   },
   "recovery" : {
      "current_as_source" : 0,
      "current_as_target" : 0,
      "throttle_time_in_millis" : 0
   }
} ………………………………………………
```

### 冲洗(Flush) 

索引的刷新过程可确保当前仅保留在事务日志中的所有数据也将永久保留在Lucene中。这减少了恢复时间，因为在打开Lucene索引之后，不需要从事务日志中重新索引数据。

```
POST colleges/_flush
```

运行上面的代码后，我们得到如下所示的输出-

```
{
   "_shards" : {
      "total" : 2,
      "successful" : 1,
      "failed" : 0
   } 
}
```





## Elasticsearch Cat API

通常，来自各种Elasticsearch API的结果以JSON格式显示。但是，JSON并非总是易于阅读。因此，Elasticsearch中提供了cat APIs功能，有助于使结果的打印格式更易于阅读和理解。cat API中使用了各种参数，这些参数具有不同的用途，例如-术语V使输出变得冗长。

让我们在本章中更详细地了解cat API。

### 详细

详细的输出可以很好地显示cat命令的结果。在下面给出的示例中，我们获得了集群中存在的各种索引的详细信息。

```
GET /_cat/indices?v
```

运行上面的代码后，我们得到如下所示的响应：

```
health status index uuid pri repdocs.countdocs.deletedstore.sizepri.store.size
yellow open schools RkMyEn2SQ4yUgzT6EQYuAA 1 1 2 1 21.6kb 21.6kb
yellow open index_4_analysis zVmZdM1sTV61YJYrNXf1gg 1 1 0 0 283b 283b
yellow open sensor-2018-01-01 KIrrHwABRB-ilGqTu3OaVQ 1 1 1 0 4.2kb 4.2kb
yellow open colleges 3ExJbdl2R1qDLssIkwDAug 1 1 0 0 283b 283b
```

### 标头

h参数（也称为标头）仅用于显示命令中提到的那些列。

```
GET /_cat/nodes?h=ip,port
```

运行上面的代码后，我们得到如下所示的响应：

```
127.0.0.1 9300
```

### Sort - 排序

sort命令接受查询字符串，该字符串可以按查询中的指定列对表进行排序。默认排序是升序的，但是可以通过在列中添加：desc来更改。

下面的示例给出了按字段索引模式的降序排列的模板的结果。

```
GET _cat/templates?v&s=order:desc,index_patterns
```

运行上面的代码后，我们得到如下所示的响应：

```
name index_patterns order version
.triggered_watches [.triggered_watches*] 2147483647
.watch-history-9 [.watcher-history-9*] 2147483647
.watches [.watches*] 2147483647
.kibana_task_manager [.kibana_task_manager] 0 7000099
```

### 计数 - Count

count参数提供整个集群中文档总数的计数。

```
GET /_cat/count?v
```

运行上面的代码后，我们得到如下所示的响应：

```
epoch timestamp count
1557633536 03:58:56 17809
```





## Elasticsearch 集群API

群集API用于获取有关群集及其节点的信息并在其中进行更改。要调用此API，我们需要指定节点名称，地址或_local。

```
GET /_nodes/_local
```

运行上面的代码后，我们得到如下所示的响应：

```
………………………………………………
cluster_name" : "elasticsearch",
   "nodes" : {
      "FKH-5blYTJmff2rJ_lQOCg" : {
         "name" : "ubuntu",
         "transport_address" : "127.0.0.1:9300",
         "host" : "127.0.0.1",
         "ip" : "127.0.0.1",
         "version" : "7.0.0",
         "build_flavor" : "default",
         "build_type" : "tar",
         "build_hash" : "b7e28a7",
         "total_indexing_buffer" : 106502553,
         "roles" : [
            "master",
            "data",
            "ingest"
         ],
         "attributes" : {
………………………………………………
```

### 集群运行状况

API用于通过附加'health'关键字来获取集群运行状况的状态。

```
GET /_cluster/health
```

运行上面的代码后，我们得到如下所示的响应：

```
{
   "cluster_name" : "elasticsearch",
   "status" : "yellow",
   "timed_out" : false,
   "number_of_nodes" : 1,
   "number_of_data_nodes" : 1,
   "active_primary_shards" : 7,
   "active_shards" : 7,
   "relocating_shards" : 0,
   "initializing_shards" : 0,
   "unassigned_shards" : 4,
   "delayed_unassigned_shards" : 0,
   "number_of_pending_tasks" : 0,
   "number_of_in_flight_fetch" : 0,
   "task_max_waiting_in_queue_millis" : 0,
   "active_shards_percent_as_number" : 63.63636363636363
}
```

### 集群状态

该API用于通过附加'state'关键字URL来获取有关集群的状态信息。状态信息包含版本，主节点，其他节点，路由表，元数据和块。

```
GET /_cluster/state
```

运行上面的代码后，我们得到如下所示的响应：

```
………………………………………………
{
   "cluster_name" : "elasticsearch",
   "cluster_uuid" : "IzKu0OoVTQ6LxqONJnN2eQ",
   "version" : 89,
   "state_uuid" : "y3BlwvspR1eUQBTo0aBjig",
   "master_node" : "FKH-5blYTJmff2rJ_lQOCg",
   "blocks" : { },
   "nodes" : {
      "FKH-5blYTJmff2rJ_lQOCg" : {
      "name" : "ubuntu",
      "ephemeral_id" : "426kTGpITGixhEzaM-5Qyg",
      "transport
   }
………………………………………………
```

### 集群统计

该API通过使用'stats'关键字来帮助检索有关群集的统计信息。该API返回分片号，存储大小，内存使用率，节点数，角色，操作系统和文件系统。

```
GET /_cluster/stats
```

运行上面的代码后，我们得到如下所示的响应：

```
………………………………………….
"cluster_name" : "elasticsearch",
"cluster_uuid" : "IzKu0OoVTQ6LxqONJnN2eQ",
"timestamp" : 1556435464704,
"status" : "yellow",
"indices" : {
   "count" : 7,
   "shards" : {
      "total" : 7,
      "primaries" : 7,
      "replication" : 0.0,
      "index" : {
         "shards" : {
         "min" : 1,
         "max" : 1,
         "avg" : 1.0
      },
      "primaries" : {
         "min" : 1,
         "max" : 1,
         "avg" : 1.0
      },
      "replication" : {
         "min" : 0.0,
         "max" : 0.0,
         "avg" : 0.0
      }
………………………………………….
```

### 群集更新设置

使用此API，您可以使用“设置”关键字来更新集群的设置。有两种类型的设置-持久性（在重新启动中应用）和瞬态（在完整的集群重新启动后无法生存）。

### 节点统计

该API用于检索集群中另外一个节点的统计信息。节点统计信息与集群几乎相同。

```
GET /_nodes/stats
```

运行上面的代码后，我们得到如下所示的响应：

```
{
   "_nodes" : {
      "total" : 1,
      "successful" : 1,
      "failed" : 0
   },
   "cluster_name" : "elasticsearch",
   "nodes" : {
      "FKH-5blYTJmff2rJ_lQOCg" : {
         "timestamp" : 1556437348653,
         "name" : "ubuntu",
         "transport_address" : "127.0.0.1:9300",
         "host" : "127.0.0.1",
         "ip" : "127.0.0.1:9300",
         "roles" : [
            "master",
            "data",
            "ingest"
         ],
         "attributes" : {
            "ml.machine_memory" : "4112797696",
            "xpack.installed" : "true",
            "ml.max_open_jobs" : "20"
         },
………………………………………………………….
```

### 节点hot_threads

该API可帮助您检索有关群集中每个节点上的当前热线程的信息。

```
GET /_nodes/hot_threads
```

运行上面的代码后，我们得到如下所示的响应：

```
:::{ubuntu}{FKH-5blYTJmff2rJ_lQOCg}{426kTGpITGixhEzaM5Qyg}{127.0.0.1}{127.0.0.1:9300}{ml.machine_memory=4112797696,
xpack.installed=true, ml.max_open_jobs=20}
 Hot threads at 2019-04-28T07:43:58.265Z, interval=500ms, busiestThreads=3,
ignoreIdleThreads=true:
```





# Elasticsearch 查询DSL

在Elasticsearch中，搜索是通过使用基于JSON的查询来进行的。查询由两个子句组成-

- 叶子查询子句——这些子句是匹配的、术语或范围，它们在特定字段中查找特定的值。
- 复合查询子句—这些查询是叶查询子句和其他复合查询的组合，用于提取所需的信息。

Elasticsearch支持大量查询。查询以查询关键字开头，然后以JSON对象的形式包含条件和过滤器。下面描述了不同类型的查询。

## 匹配所有查询

这是最基本的查询；它返回所有内容，每个对象的得分为1.0。

```
POST /schools/_search
{
   "query":{
      "match_all":{}
   }
}
```

在运行上面的代码时，我们得到以下结果-

```
{
   "took" : 7,
   "timed_out" : false,
   "_shards" : {
      "total" : 1,
      "successful" : 1,
      "skipped" : 0,
      "failed" : 0
   },
   "hits" : {
      "total" : {
         "value" : 2,
         "relation" : "eq"
      },
      "max_score" : 1.0,
      "hits" : [
         {
            "_index" : "schools",
            "_type" : "school",
            "_id" : "5",
            "_score" : 1.0,
            "_source" : {
               "name" : "Central School",
               "description" : "CBSE Affiliation",
               "street" : "Nagan",
               "city" : "paprola",
               "state" : "HP",
               "zip" : "176115",
               "location" : [
                  31.8955385,
                  76.8380405
               ],
               "fees" : 2200,
               "tags" : [
                  "Senior Secondary",
                  "beautiful campus"
               ],
               "rating" : "3.3"
            }
         },
         {
            "_index" : "schools",
            "_type" : "school",
            "_id" : "4",
            "_score" : 1.0,
            "_source" : {
               "name" : "City Best School",
               "description" : "ICSE",
               "street" : "West End",
               "city" : "Meerut",
               "state" : "UP",
               "zip" : "250002",
               "location" : [
                  28.9926174,
                  77.692485
               ],
               "fees" : 3500,
               "tags" : [
                  "fully computerized"
               ],
               "rating" : "4.5"
            }
         }
      ]
   }
}
```

## 全文查询

这些查询用于搜索全文，例如章节或新闻文章。该查询根据与该特定索引或文档相关联的分析器工作。在本节中，我们将讨论全文查询的不同类型。

## 匹配查询

此查询将文本或短语与一个或多个字段的值匹配。

```
POST /schools*/_search
{
   "query":{
      "match" : {
         "rating":"4.5"
      }
   }
}
```

运行上面的代码后，我们得到如下所示的响应：

```
{
   "took" : 44,
   "timed_out" : false,
   "_shards" : {
      "total" : 1,
      "successful" : 1,
      "skipped" : 0,
      "failed" : 0
   },
   "hits" : {
      "total" : {
         "value" : 1,
         "relation" : "eq"
      },
      "max_score" : 0.47000363,
      "hits" : [
         {
            "_index" : "schools",
            "_type" : "school",
            "_id" : "4",
            "_score" : 0.47000363,
            "_source" : {
               "name" : "City Best School",
               "description" : "ICSE",
               "street" : "West End",
               "city" : "Meerut",
               "state" : "UP",
               "zip" : "250002",
               "location" : [
                  28.9926174,
                  77.692485
               ],
               "fees" : 3500,
               "tags" : [
                  "fully computerized"
               ],
               "rating" : "4.5"
            }
         }
      ]
   }
}
```

## 多重比对查询

此查询将一个或多个字段匹配的文本或短语匹配。

```
POST /schools*/_search
{
   "query":{
      "multi_match" : {
         "query": "paprola",
         "fields": [ "city", "state" ]
      }
   }
}
```

运行上面的代码后，我们得到如下所示的响应：

```
{
   "took" : 12,
   "timed_out" : false,
   "_shards" : {
      "total" : 1,
      "successful" : 1,
      "skipped" : 0,
      "failed" : 0
   },
   "hits" : {
      "total" : {
         "value" : 1,
         "relation" : "eq"
      },
      "max_score" : 0.9808292,
      "hits" : [
         {
            "_index" : "schools",
            "_type" : "school",
            "_id" : "5",
            "_score" : 0.9808292,
            "_source" : {
               "name" : "Central School",
               "description" : "CBSE Affiliation",
               "street" : "Nagan",
               "city" : "paprola",
               "state" : "HP",
               "zip" : "176115",
               "location" : [
                  31.8955385,
                  76.8380405
               ],
               "fees" : 2200,
               "tags" : [
                  "Senior Secondary",
                  "beautiful campus"
               ],
               "rating" : "3.3"
            }
         }
      ]
   }
}
```

## 查询字符串查询

该查询使用查询解析器和query_string关键字。

```
POST /schools*/_search
{
   "query":{
      "query_string":{
         "query":"beautiful"
      }
   }
}
```

运行上面的代码后，我们得到如下所示的响应：

```
{
   "took" : 60,
   "timed_out" : false,
   "_shards" : {
      "total" : 1,
      "successful" : 1,
      "skipped" : 0,
      "failed" : 0
   },
   "hits" : {
      "total" : {
      "value" : 1,
      "relation" : "eq"
   },
………………………………….
```

## 词级查询

这些查询主要处理结构化数据，例如数字，日期和枚举。

```
POST /schools*/_search
{
   "query":{
      "term":{"zip":"176115"}
   }
}
```

运行上面的代码后，我们得到如下所示的响应：

```
……………………………..
hits" : [
   {
      "_index" : "schools",
      "_type" : "school",
      "_id" : "5",
      "_score" : 0.9808292,
      "_source" : {
         "name" : "Central School",
         "description" : "CBSE Affiliation",
         "street" : "Nagan",
         "city" : "paprola",
         "state" : "HP",
         "zip" : "176115",
         "location" : [
            31.8955385,
            76.8380405
         ],
      }
   }
]   
…………………………………………..
```

## 范围查询

该查询用于查找具有给定值范围之间的值的对象。为此，我们需要使用运算符，例如-

- **gte** −大于等于
- **gt** −大于
- **lte** −小于等于
- **lt** −小于

例如，观察下面给出的代码-

```
POST /schools*/_search
{
   "query":{
      "range":{
         "rating":{
            "gte":3.5
         }
      }
   }
}
```

运行上面的代码后，我们得到如下所示的响应：

```
{
   "took" : 24,
   "timed_out" : false,
   "_shards" : {
      "total" : 1,
      "successful" : 1,
      "skipped" : 0,
      "failed" : 0
   },
   "hits" : {
      "total" : {
         "value" : 1,
         "relation" : "eq"
      },
      "max_score" : 1.0,
      "hits" : [
         {
            "_index" : "schools",
            "_type" : "school",
            "_id" : "4",
            "_score" : 1.0,
            "_source" : {
               "name" : "City Best School",
               "description" : "ICSE",
               "street" : "West End",
               "city" : "Meerut",
               "state" : "UP",
               "zip" : "250002",
               "location" : [
                  28.9926174,
                  77.692485
               ],
               "fees" : 3500,
               "tags" : [
                  "fully computerized"
               ],
               "rating" : "4.5"
            }
         }
      ]
   }
}
```

还存在其他类型的术语级别查询，例如-

- **存在查询** −如果某个字段的值为非空值。
- **缺少查询** −这与存在查询完全相反，该查询搜索没有特定字段或值为空的对象。
- **通配符或regexp查询** −此查询使用正则表达式在对象中查找模式。

## 复合查询

这些查询是不同查询的集合，这些查询通过使用布尔运算符（例如和/或，或不）或针对不同的索引或具有函数调用等彼此合并。

```
POST /schools/_search
{
   "query": {
      "bool" : {
         "must" : {
            "term" : { "state" : "UP" }
         },
         "filter": {
            "term" : { "fees" : "2200" }
         },
         "minimum_should_match" : 1,
         "boost" : 1.0
      }
   }
}
```

运行上面的代码后，我们得到如下所示的响应：

```
{
   "took" : 6,
   "timed_out" : false,
   "_shards" : {
      "total" : 1,
      "successful" : 1,
      "skipped" : 0,
      "failed" : 0
   },
   "hits" : {
      "total" : {
         "value" : 0,
         "relation" : "eq"
      },
      "max_score" : null,
      "hits" : [ ]
   }
}
```

## 地理查询

这些查询处理地理位置和地理位置。这些查询有助于找出学校或任何其他地理位置附近的地理对象。您需要使用地理位置数据类型。

```
PUT /geo_example
{
   "mappings": {
      "properties": {
         "location": {
            "type": "geo_shape"
         }
      }
   }
}
```

运行上面的代码后，我们得到如下所示的响应：

```
{  "acknowledged" : true,
   "shards_acknowledged" : true,
   "index" : "geo_example"
}
```

现在，我们将数据发布到上面创建的索引中。

```
POST /geo_example/_doc?refresh
{
   "name": "Chapter One, London, UK",
   "location": {
      "type": "point",
      "coordinates": [11.660544, 57.800286]
   }
}
```

运行上面的代码后，我们得到如下所示的响应：

```
{
   "took" : 1,
   "timed_out" : false,
   "_shards" : {
      "total" : 1,
      "successful" : 1,
      "skipped" : 0,
      "failed" : 0
   },
   "hits" : {
      "total" : {
         "value" : 2,
         "relation" : "eq"
      },
      "max_score" : 1.0,
      "hits" : [
         "_index" : "geo_example",
         "_type" : "_doc",
         "_id" : "hASWZ2oBbkdGzVfiXHKD",
         "_score" : 1.0,
         "_source" : {
            "name" : "Chapter One, London, UK",
            "location" : {
               "type" : "point",
               "coordinates" : [
                  11.660544,
                  57.800286
               ]
            }
         }
      }
   }
```







# Elasticsearch 映射

映射是存储在索引中的文档的轮廓。它定义了数据类型，如geo_point或字符串，以及文档中显示的字段的格式和规则，以控制动态添加字段的映射。

```
PUT bankaccountdetails
{
   "mappings":{
      "properties":{
         "name": { "type":"text"}, "date":{ "type":"date"},
         "balance":{ "type":"double"}, "liability":{ "type":"double"}
      }
   }
 }
```

当我们运行上面的代码时，我们得到如下所示的响应-

```
{
   "acknowledged" : true,
   "shards_acknowledged" : true,
   "index" : "bankaccountdetails"
}
```

## 字段数据类型

Elasticsearch为文档中的字段支持多种不同的数据类型。这里详细讨论了用于在Elasticsearch中存储字段的数据类型。

## 核心数据类型

这些是基本数据类型，例如文本，关键字，日期，长整型，双精度型，布尔型或ip，几乎所有系统都支持。

## 复杂数据类型

这些数据类型是核心数据类型的组合。这些包括数组，JSON对象和嵌套数据类型。嵌套数据类型的示例如下所示＆minus

```
POST /tabletennis/_doc/1
{
   "group" : "players",
   "user" : [
      {
         "first" : "dave", "last" : "jones"
      },
      {
         "first" : "kevin", "last" : "morris"
      }
   ]
}
```

当我们运行上面的代码时，我们得到如下所示的响应-

```
{
   "_index" : "tabletennis",
   "_type" : "_doc",
   "_id" : "1",
   _version" : 2,
   "result" : "updated",
   "_shards" : {
      "total" : 2,
      "successful" : 1,
      "failed" : 0
   },
   "_seq_no" : 1,
   "_primary_term" : 1
}
```

另一个示例代码如下所示-

```
POST /accountdetails/_doc/1
{
   "from_acc":"7056443341", "to_acc":"7032460534",
   "date":"11/1/2016", "amount":10000
}
```

当我们运行上面的代码时，我们得到如下所示的响应-

```
{  "_index" : "accountdetails",
   "_type" : "_doc",
   "_id" : "1",
   "_version" : 1,
   "result" : "created",
   "_shards" : {
      "total" : 2,
      "successful" : 1,
      "failed" : 0
   },
   "_seq_no" : 1,
   "_primary_term" : 1
}
```

我们可以使用以下命令检查以上文档-

```
GET /accountdetails/_mappings?include_type_name=false
```

## 删除映射类型

在Elasticsearch 7.0.0或更高版本中创建的索引不再接受_default_映射。中创建的索引6.x将继续在Elasticsearch 6.x中像以前一样起作用。在7.0中的API中已弃用类型。







# Elasticsearch 分析

当在搜索操作期间处理查询时，分析模块会分析任何索引中的内容。该模块由分析器，令牌生成器，令牌过滤器和字符过滤器组成。如果未定义分析器，则默认情况下，内置分析器，令牌，过滤器和令牌生成器会在分析模块中注册。

在下面的示例中，我们使用一个标准分析器，该分析器在没有指定其他分析器时使用。它将根据语法对句子进行分析，并生成句子中使用的单词。

```
POST _analyze
{
   "analyzer": "standard",
   "text": "Today's weather is beautiful"
}
```

运行上面的代码后，我们得到如下所示的响应：

```
{
   "tokens" : [
      {
         "token" : "today's",
         "start_offset" : 0,
         "end_offset" : 7,
         "type" : "",
         "position" : 0
      },
      {
         "token" : "weather",
         "start_offset" : 8,
         "end_offset" : 15,
         "type" : "",
         "position" : 1
      },
      {
         "token" : "is",
         "start_offset" : 16,
         "end_offset" : 18,
         "type" : "",
         "position" : 2
      },
      {
         "token" : "beautiful",
         "start_offset" : 19,
         "end_offset" : 28,
         "type" : "",
         "position" : 3
      }
   ]
}
```

## 配置标准分析器

我们可以使用各种参数配置标准分析器，以获取我们的自定义要求。

在以下示例中，我们将标准分析器配置为max_token_length为5。

为此，我们首先使用具有max_length_token参数的分析器创建索引。

```
PUT index_4_analysis
{
   "settings": {
      "analysis": {
         "analyzer": {
            "my_english_analyzer": {
               "type": "standard",
               "max_token_length": 5,
               "stopwords": "_english_"
            }
         }
      }
   }
}
```

接下来，我们用如下所示的文本应用分析器。请注意令牌是如何不显示的，因为它在开头有两个空格，在结尾有两个空格。对于“ is”这个词，它的开头有一个空格，结尾有一个空格。把它们全部取出来，就变成了4个带空格的字母，这并不意味着它就是一个单词。至少在开头或结尾应该有一个非空格字符，使它成为一个要计数的单词。

```
POST index_4_analysis/_analyze
{
   "analyzer": "my_english_analyzer",
   "text": "Today's weather is beautiful"
}
```

运行上面的代码后，我们得到如下所示的响应：

```
{
   "tokens" : [
      {
         "token" : "today",
         "start_offset" : 0,
         "end_offset" : 5,
         "type" : "",
         "position" : 0
      },
      {
         "token" : "s",
         "start_offset" : 6,
         "end_offset" : 7,
         "type" : "",
         "position" : 1
      },
      {
         "token" : "weath",
         "start_offset" : 8,
         "end_offset" : 13,
         "type" : "",
         "position" : 2
      },
      {
         "token" : "er",
         "start_offset" : 13,
         "end_offset" : 15,
         "type" : "",
         "position" : 3
      },
      {
         "token" : "beaut",
         "start_offset" : 19,
         "end_offset" : 24,
         "type" : "",
         "position" : 5
      },
      {
         "token" : "iful",
         "start_offset" : 24,
         "end_offset" : 28,
         "type" : "",
         "position" : 6
      }
   ]
}
```

下表列出了各种分析仪的列表及其说明-

| 序号 | 分析器和说明                                                 |
| :--- | :----------------------------------------------------------- |
| 1    | 标准分析器(**standard**)stopwords和max_token_length设置可以为这个分析器设置。默认情况下，stopwords列表为空，max_token_length为255。 |
| 2    | 简单分析器(**simple**)该分析器由小写的 tokenizer 组成。      |
| 3    | **空白分析器 (whitespace)**该分析器由空格标记器组成          |
| 4    | **停止分析器 (stop)**可以配置stopwords和stopwords_path。默认情况下，stopwords初始化为英文停止词，stopwords_path包含包含停止词的文本文件的路径 |

## 分词器

令牌生成器用于从Elasticsearch中的文本生成令牌。通过将空格或其他标点符号考虑在内，可以将文本分解为标记。Elasticsearch有很多内置的标记器，可以在自定义分析器中使用。

下面显示了一个分词器的示例，该分词器在遇到非字母的字符时将文本分解为多个词，但也会将所有词都小写，如下所示-

```
POST _analyze
{
   "tokenizer": "lowercase",
   "text": "It Was a Beautiful Weather 5 Days ago."
}
```

运行上面的代码后，我们得到如下所示的响应：

```
{
   "tokens" : [
      {
         "token" : "it",
         "start_offset" : 0,
         "end_offset" : 2,
         "type" : "word",
         "position" : 0
      },
      {
         "token" : "was",
         "start_offset" : 3,
         "end_offset" : 6,
         "type" : "word",
         "position" : 1
      },
      {
         "token" : "a",
         "start_offset" : 7,
         "end_offset" : 8,
         "type" : "word",
         "position" : 2
      },
      {
         "token" : "beautiful",
         "start_offset" : 9,
         "end_offset" : 18,
         "type" : "word",
         "position" : 3
      },
      {
         "token" : "weather",
         "start_offset" : 19,
         "end_offset" : 26,
         "type" : "word",
         "position" : 4
      },
      {
         "token" : "days",
         "start_offset" : 29,
         "end_offset" : 33,
         "type" : "word",
         "position" : 5
      },
      {
         "token" : "ago",
         "start_offset" : 34,
         "end_offset" : 37,
         "type" : "word",
         "position" : 6
      }
   ]
}
```

令牌生成器的列表及其说明如下表所示：

| 序号 | 分词器和说明                                                 |
| :--- | :----------------------------------------------------------- |
| 1    | **标准标记器 (standard)**这是基于基于语法的标记器构建的，max_token_length可以为这个标记器配置。 |
| 2    | **边缘 NGram 标记器****(edgeNGram)** 像min_gram, max_gram, token_chars这样的设置可以为这个标记器设置。 |
| 3    | **关键字标记器 (keyword)**这将生成整个输入作为输出，buffer_size可以为此设置。 |
| 4    | **字母标记器(letter)**这将捕获整个单词，直到遇到一个非字母。 |



# Elasticsearch 模块

Elasticsearch由许多模块组成，这些模块负责其功能。这些模块具有两种类型的设置，如下所示：

- **静态设置**−在启动Elasticsearch之前，需要在config(elasticsearch.yml)文件中配置这些设置。您需要更新集群中的所有关注节点，以反映这些设置的更改。
- **动态设置** −这些设置可以在实时Elasticsearch上进行设置。

我们将在本章以下各节中讨论Elasticsearch的不同模块。

## 集群级路由和分片分配

集群级设置决定将碎片分配给不同的节点，并重新分配碎片以重新平衡集群。以下是控制碎片分配的设置。

## 集群级别碎片分配

|                             设置                             |                  可能的值                  |                             描述                             |
| :----------------------------------------------------------: | :----------------------------------------: | :----------------------------------------------------------: |
|              cluster.routing.allocation.enable               |                                            |                                                              |
|                             all                              |   此默认值允许为所有类型的碎片分配碎片。   |                                                              |
|                          primaries                           |         这只允许为主碎片分配碎片。         |                                                              |
|                        new_primaries                         |     这只允许为新索引的主碎片分配碎片。     |                                                              |
|                             none                             |           这不允许任何碎片分配。           |                                                              |
|    cluster.routing.allocation .node_concurrent_recoveries    |              数值(默认值为2)               |                 这限制了并发碎片恢复的数量。                 |
| cluster.routing.allocation .node_initial_primaries_recoveries |              数值（默认为4）               |                这限制了并行初始主恢复的数量。                |
|         cluster.routing.allocation .same_shard.host          |           布尔值（默认为false）            |       这限制了在同一物理节点中分配同一分片的多个副本。       |
|              index.recovery.concurrent _streams              |              数值（默认为3）               |    这控制从对等碎片恢复碎片时每个节点打开的网络流的数量。    |
|        index.recovery.concurrent _small_file_streams         |              数值（默认为2）               | 这可以控制碎片恢复时大小小于5mb的小文件在每个节点上打开的流的数量。 |
|               cluster.routing.rebalance.enable               |                                            |                                                              |
|                             all                              |      此默认值允许平衡所有类型的碎片。      |                                                              |
|                          primaries                           |        这只允许主碎片进行碎片平衡。        |                                                              |
|                           replicas                           |      这只允许对副本碎片进行碎片平衡。      |                                                              |
|                             none                             |        这不允许任何形式的碎片平衡。        |                                                              |
|         cluster.routing.allocation .allow_rebalance          |                                            |                                                              |
|                            always                            |         此默认值始终允许重新平衡。         |                                                              |
|                   indexs_primaries_active                    | 这允许在分配集群中的所有主碎片时重新平衡。 |                                                              |
|                      Indices_all_active                      | 这允许在分配所有主碎片和副本碎片时重新平衡 |                                                              |
|   cluster.routing.allocation.cluster _concurrent_rebalance   |              数值（默认为2）               |              这限制了集群中并发分片平衡的数量。              |
|          cluster.routing.allocation .balance.shard           |           浮点值（默认为0.45f）            |           这定义了分配给每个节点的碎片的权重因子。           |
|          cluster.routing.allocation .balance.index           |           浮点值（默认为0.55f）            |      这定义了在特定节点上分配的每个索引的碎片数的比率。      |
|        cluster.routing.allocation .balance.threshold         |          非负浮点值（默认为1.0f）          |               这是应该执行的操作的最小优化值。               |

## 基于磁盘的分片分配

|                        设置                         |         可能的值          |                             描述                             |
| :-------------------------------------------------: | :-----------------------: | :----------------------------------------------------------: |
|  cluster.routing.allocation.disk.threshold_enabled  |   布尔值（默认为true）    |               这将启用和禁用磁盘分配决策程序。               |
|    cluster.routing.allocation.disk.watermark.low    |   字符串值（默认为85%）   | 这表示磁盘的最大使用率；此后，将无法将其他分片分配给该磁盘。 |
|   cluster.routing.allocation.disk.watermark.high    |    字符串值(默认为90%)    | 这表示分配时的最大使用量；如果在分配时达到了这一点，那么Elasticsearch会将那个分片分配给另一个磁盘。 |
|            cluster.info.update.interval             |    字符串值（默认30s）    |             这是两次磁盘使用情况检查之间的间隔。             |
| cluster.routing.allocation.disk.include_relocations | 布尔值(默认情况下为 true) |      这决定了在计算磁盘使用率时是否考虑当前分配的分片。      |

## 发现

这个模块帮助集群发现并维护集群中所有节点的状态。当从集群中添加或删除节点时，集群的状态会发生变化。集群名称设置用于创建不同集群之间的逻辑差异。有一些模块可以帮助您使用云供应商提供的API，如下所示-

- Azure发现
- EC2发现
- Google计算引擎发现
- 禅Zen发现

## 网关

该模块在整个集群重新启动时维护集群状态和分片数据。以下是该模块的静态设置-

|                         设置                         |       可能的值       |                             描述                             |
| :--------------------------------------------------: | :------------------: | :----------------------------------------------------------: |
|                gateway.expected_nodes                |   数值（默认为0）    |               群集中用于恢复本地分片的节点数。               |
|            gateway.expected_master_nodes             |   数值（默认为0）    |            开始恢复之前，预期在群集中的主节点数。            |
|             gateway.expected_data_nodes              |   数值（默认为0）    |            开始恢复之前，群集中预期的数据节点数。            |
|              gateway.recover_after_time              | 字符串值（默认为5m） |             这是两次磁盘使用情况检查之间的间隔。             |
| cluster.routing.allocation. disk.include_relocations | 布尔值（默认为true） | 这指定了恢复过程将等待开始的时间，而不管群集中加入的节点数量如何。gateway.recover_ after_nodes gateway.recover_after_master_nodes gateway.recover_after_data_nodes |

## HTTP

该模块管理HTTP客户端和Elasticsearch API之间的通信。可以通过将值更改http.enabled为false来禁用此模块。

以下是用于控制此模块的设置（在elasticsearch.yml中配置）-

| 序号 | 设定与说明                                                   |
| :--- | :----------------------------------------------------------- |
| 1    | **http.port**这是访问Elasticsearch的端口，范围为9200-9300。  |
| 2    | **http.publish_port**此端口用于http客户端，在防火墙的情况下也很有用。 |
| 3    | **http.bind_host**这是 http 服务的主机地址。                 |
| 4    | **http.publish_host**这是http客户机的主机地址。              |
| 5    | **http.max_content_length**这是http请求中内容的最大大小。它的默认值是100mb。 |
| 6    | **http.max_initial_line_length**这是URL的最大大小，其默认值为4kb。 |
| 7    | **http.max_header_size**这是 http 头的最大大小，默认值为8kb。 |
| 8    | **http.compression**这将启用或禁用对压缩的支持，其默认值为false。 |
| 9    | **http.pipelinig**这将启用或禁用 HTTP 管道。                 |
| 10   | **http.pipelining.max_events**这限制了在关闭HTTP请求之前要排队的事件数。 |

## 索引

此模块维护为每个索引全局设置的设置。以下设置主要与内存使用有关-

## 断路器

这用于防止操作引起OutOfMemroyError。该设置主要限制JVM堆大小。例如，indexs.breaker.total.limit设置，默认为JVM堆的70％。

## 现场数据缓存

主要用于在字段上聚合时使用。建议有足够的内存来分配它。可以使用index.fielddata.cache.size设置来控制用于字段数据缓存的内存量。

## 节点查询缓存

该内存用于缓存查询结果。该缓存使用最近最少使用(LRU)驱逐策略。Indices.queries.cahce.size设置控制此缓存的内存大小。

## 索引缓冲区

该缓冲区将新创建的文档存储在索引中，并在缓冲区已满时刷新它们。像indexs.memory.index_buffer_size这样的设置控制为此缓冲区分配的堆数量。

## 分片请求缓存

该缓存用于存储每个分片的本地搜索数据。可以在创建索引期间启用缓存，也可以通过发送URL参数来禁用缓存。

```
Disable cache - ?request_cache = true
Enable cache "index.requests.cache.enable": true
```

## 索引恢复

它在恢复过程中控制资源。以下是设置-

| 设置                                           | 默认值 |
| :--------------------------------------------- | :----- |
| indices.recovery.concurrent_streams            | 3      |
| indices.recovery.concurrent_small_file_streams | 2      |
| indices.recovery.file_chunk_size               | 512kb  |
| indices.recovery.translog_ops                  | 1000   |
| indices.recovery.translog_size                 | 512kb  |
| indices.recovery.compress                      | true   |
| indices.recovery.max_bytes_per_sec             | 40mb   |

## TTL间隔

生存时间(TTL)间隔定义了文档的时间，之后该文档将被删除。以下是用于控制此过程的动态设置-

| 设置                  | 默认值 |
| :-------------------- | :----- |
| indices.ttl.interval  | 60s    |
| indices.ttl.bulk_size | 1000   |

## 节点

每个节点都可以选择是否为数据节点。可以通过更改 node.data 设置来更改此属性。将该值设置为 false 将定义该节点不是数据节点。



# lasticsearch 索引模块

这些是为每个索引创建的模块，用于控制索引的设置和行为。例如，索引可以使用多少个分片或该索引的主分片可以具有的副本数等。索引设置有两种类型-

- **静态**−这些只能在创建索引时或在关闭的索引上进行设置。
- **动态** −这些可以在实时索引上更改。

## 静态索引设置

下表显示了静态索引设置的列表-

| 设置                                    | 可能的值                  | 描述                                 |
| :-------------------------------------- | :------------------------ | :----------------------------------- |
| index.number_of_shards                  | 默认值为5，最大值为1024   | 索引应该具有的主碎片的数量。         |
| index.shard.check_on_startup            | 默认为 false。可以为 True | 在打开之前是否应该检查碎片是否损坏。 |
| index.codec                             | LZ4压缩。                 | 用于存储数据的压缩类型。             |
| index.routing_partition_size            | 1                         | 自定义路由值可以转到的碎片数。       |
| index.load_fixed_bitset_filters_eagerly | false                     | 指示是否为嵌套查询预先加载缓存筛选器 |

## 动态索引设置

下表显示了动态索引设置的列表-

| 设置                       | 可能的值                      | 描述                                                         |
| :------------------------- | :---------------------------- | :----------------------------------------------------------- |
| index.number_of_replicas   | 默认为1                       | 每个主分片具有的副本数。                                     |
| index.auto_expand_replicas | 由下限和上限(0-5)分隔的破折号 | 根据群集中数据节点的数量自动扩展副本的数量。                 |
| index.search.idle.after    | 30seconds                     | 在被认为是搜索空闲之前，碎片不能接收搜索或获取请求的时间。   |
| index.refresh_interval     | 1 second                      | 执行刷新操作的频率，刷新操作使最近对索引的更改可见以供搜索。 |



# Elasticsearch Ingest节点

| index.blocks.read_only | 1 true/false | 设置为true将使索引和索引元数据为只读，设置为false将允许写入和元数据更改。 |
| ---------------------- | ------------ | ------------------------------------------------------------ |
|                        |              |                                                              |

有时我们需要在转换文档之前对其进行索引。例如，我们要从文档中删除一个字段或重命名一个字段，然后对其进行索引。这由Ingest节点处理。

群集中的每个节点都具有提取功能，但也可以对其进行自定义以仅由特定节点进行处理。

## 步骤

摄取节点的工作涉及两个步骤-

- 创建管道
- 建立文件

## 创建管道

首先创建一个包含处理器的管道，然后执行该管道，如下所示-

```
PUT _ingest/pipeline/int-converter
{
   "description": "converts the content of the seq field to an integer",
   "processors" : [
      {
         "convert" : {
            "field" : "seq",
            "type": "integer"
         }
      }
   ]
}
```

在运行上面的代码时，我们得到以下结果-

```
{
   "acknowledged" : true
}
```

## 建立文件

接下来，我们使用管道转换器创建一个文档。

```
PUT /logs/_doc/1?pipeline=int-converter
{
   "seq":"21",
   "name":"nhooo",
   "Addrs":"Hyderabad"
}
```

运行上面的代码后，我们得到如下所示的响应：

```
{
   "_index" : "logs",
   "_type" : "_doc",
   "_id" : "1",
   "_version" : 1,
   "result" : "created",
   "_shards" : {
      "total" : 2,
      "successful" : 1,
      "failed" : 0
   },
   "_seq_no" : 0,
   "_primary_term" : 1
}
```

接下来，我们使用GET命令搜索上面创建的文档，如下所示-

```
GET /logs/_doc/1
```

在运行上面的代码时，我们得到以下结果-

```
{
   "_index" : "logs",
   "_type" : "_doc",
   "_id" : "1",
   "_version" : 1,
   "_seq_no" : 0,
   "_primary_term" : 1,
   "found" : true,
   "_source" : {
      "Addrs" : "Hyderabad",
      "name" : "nhooo",
      "seq" : 21
   }
}
```

您可以在上方看到21变为整数。

## 无管道

现在，我们无需使用管道即可创建文档。

```
PUT /logs/_doc/2
{
   "seq":"11",
   "name":"Tutorix",
   "Addrs":"Secunderabad"
}
GET /logs/_doc/2
```

在运行上面的代码时，我们得到以下结果-

```
{
   "_index" : "logs",
   "_type" : "_doc",
   "_id" : "2",
   "_version" : 1,
   "_seq_no" : 1,
   "_primary_term" : 1,
   "found" : true,
   "_source" : {
      "seq" : "11",
      "name" : "Tutorix",
      "Addrs" : "Secunderabad"
   }
}
```

您可以在上面看到11是一个不使用管道的字符串。





# Elasticsearch 管理索引生命周期

管理索引生命周期涉及基于分片大小和性能要求等因素执行管理操作。索引生命周期管理(ILM)API使您能够随着时间自动管理索引。

本章列出了ILM API及其用法。

## 策略管理API

| API名称            | 作用                                                         | 实例                            |
| :----------------- | :----------------------------------------------------------- | :------------------------------ |
| 创建生命周期策略。 | 创建生命周期策略。如果指定的策略存在，则替换该策略，并增加策略版本。 | PUT_ilm / policy / policy_id    |
| 获取生命周期策略。 | 返回指定的策略定义。包括策略版本和上次修改日期。如果未指定任何策略，则返回所有已定义的策略。 | GET_ilm / policy / policy_id    |
| 删除生命周期策略   | 删除指定的生命周期策略定义。您无法删除当前正在使用的策略。如果该策略用于管理任何索引，则请求将失败并返回错误。 | DELETE_ilm / policy / policy_id |

## 索引管理API

| API名称                   | 作用                                                         | 实例                   |
| :------------------------ | :----------------------------------------------------------- | :--------------------- |
| 转移到生命周期步骤 API。  | 手动将索引移至指定步骤并执行该步骤。                         | POST_ilm/move/index    |
| 重试策略。                | 将策略设置回发生错误的步骤并执行该步骤。                     | POST index/_ilm/retry  |
| 从索引API编辑中删除策略。 | 删除分配的生命周期策略，并停止管理指定的索引。如果指定了索引模式，则从所有匹配的索引中删除分配的策略。 | POST index/_ilm/remove |

## 操作管理API

| API名称                       | 作用                                                         | 实例                   |
| :---------------------------- | :----------------------------------------------------------- | :--------------------- |
| 获取索引生命周期管理状态API。 | 返回ILM插件的状态。响应中的operation_mode字段显示以下三种状态之一：STARTED，STOPPING或STOPPED。 | GET /_ilm/status       |
| 启动索引生命周期管理API。     | 如果当前已停止，则启动ILM插件。形成集群后，会自动启动ILM。   | POST /_ilm/start       |
| 停止索引生命周期管理API。     | 停止所有生命周期管理操作并停止ILM插件。当您在群集上执行维护并且需要防止ILM对索引执行任何操作时，此功能很有用。 | POST /_ilm/stop        |
| 解释生命周期API。             | 检索有关索引的当前生命周期状态的信息，例如当前正在执行的阶段，操作和步骤。显示索引何时输入每个索引，运行阶段的定义以及有关任何失败的信息。 | GET index/_ilm/explain |





# Elasticsearch SQL访问

它是一个组件，允许对 Elasticsearch 实时执行类似 sql 的查询。您可以将 Elasticsearch SQL 看作是一个翻译器，它同时理解 SQL 和 Elasticsearch，并且通过 Elasticsearch 功能，可以方便地实时读取和处理数据。

## Elasticsearch SQL的优点

- **它具有本地集成** −根据底层存储，对相关节点高效地执行每个查询。
- **没有外部部件** −不需要额外的硬件、进程、运行时或库来查询Elasticsearch。
- **轻量级和高效率** −它包含并公开了SQL，以便实时进行适当的全文本搜索。

## 实例

```
PUT /schoollist/_bulk?refresh
   {"index":{"_id": "CBSE"}}
   {"name": "GleanDale", "Address": "JR. Court Lane", "start_date": "2011-06-02",
   "student_count": 561}
   {"index":{"_id": "ICSE"}}
   {"name": "Top-Notch", "Address": "Gachibowli Main Road", "start_date": "1989-
   05-26", "student_count": 482}
   {"index":{"_id": "State Board"}}
   {"name": "Sunshine", "Address": "Main Street", "start_date": "1965-06-01",
   "student_count": 604}
```

运行上面的代码后，我们得到如下所示的响应：

```
{
   "took" : 277,
   "errors" : false,
   "items" : [
      {
         "index" : {
            "_index" : "schoollist",
            "_type" : "_doc",
            "_id" : "CBSE",
            "_version" : 1,
            "result" : "created",
            "forced_refresh" : true,
            "_shards" : {
               "total" : 2,
               "successful" : 1,
               "failed" : 0
            },
            "_seq_no" : 0,
            "_primary_term" : 1,
            "status" : 201
         }
      },
      {
         "index" : {
            "_index" : "schoollist",
            "_type" : "_doc",
            "_id" : "ICSE",
            "_version" : 1,
            "result" : "created",
            "forced_refresh" : true,
            "_shards" : {
               "total" : 2,
               "successful" : 1,
               "failed" : 0
            },
            "_seq_no" : 1,
            "_primary_term" : 1,
            "status" : 201
         }
      },
      {
         "index" : {
            "_index" : "schoollist",
            "_type" : "_doc",
            "_id" : "State Board",
            "_version" : 1,
            "result" : "created",
            "forced_refresh" : true,
            "_shards" : {
               "total" : 2,
               "successful" : 1,
               "failed" : 0
            },
            "_seq_no" : 2,
            "_primary_term" : 1,
            "status" : 201
         }
      }
   ]
}
```

## SQL查询

以下示例显示了如何构建SQL查询-

```
POST /_sql?format=txt
{
   "query": "SELECT * FROM schoollist WHERE start_date < '2000-01-01'"
}
```

运行上面的代码后，我们得到如下所示的响应：

```
Address             | name          | start_date             | student_count
--------------------+---------------+------------------------+---------------
Gachibowli Main Road|Top-Notch      |1989-05-26T00:00:00.000Z|482
Main Street         |Sunshine       |1965-06-01T00:00:00.000Z|604
```

**Note** −通过更改上面的SQL查询，您可以获得不同的结果集。





# Elasticsearch 监视

为了监视集群的运行状况，监视功能从每个节点收集度量并将它们存储在Elasticsearch索引中。与Elasticsearch中的监视相关的所有设置必须在elasticsearch.yml 每个节点的文件，或者在可能的情况下，在动态集群设置中。

为了开始监视，我们需要检查集群设置，可以通过以下方式完成：

```
GET _cluster/settings
{
   "persistent" : { },
   "transient" : { }
}
```

堆栈中的每个组件负责监视自身，然后将这些文档转发到Elasticsearch生产集群以进行路由和索引编制（存储）。Elasticsearch中的路由和索引过程由所谓的收集器和导出器处理。

## 收集器

收集器在每个收集间隔运行一次，以从它选择监视的Elasticsearch中的公共API获取数据。数据收集完成后，数据将批量交给导出器，并发送到监控集群。

每种数据类型仅收集一个收集器。每个收集器可以创建零个或多个监视文档。

## 导出器

导出器将从任何Elastic Stack源收集的数据路由到监视集群。可以配置多个导出器，但是常规设置和默认设置是使用一个导出器。导出器可以在节点级别和群集级别进行配置。

Elasticsearch中有两种类型的导出器-

- **local** −此导出器将数据路由回同一群集
- **http** −首选的导出器，可用于将数据路由到可通过HTTP访问的任何受支持的Elasticsearch集群中。

在导出程序可以路由监控数据之前，它们必须设置一定的Elasticsearch资源。这些资源包括模板和摄取管道



# Elasticsearch 汇总数据

汇总作业是一项周期性任务，它汇总索引模式指定的索引中的数据，并将其汇总到新索引中。在下面的示例中，我们创建了一个名为sensor的索引，该索引具有不同的日期时间戳。然后我们创建一个rollup作业，使用cron job周期性地从这些索引中汇总数据。

```
PUT /sensor/_doc/1
{
   "timestamp": 1516729294000,
   "temperature": 200,
   "voltage": 5.2,
   "node": "a"
}
```

在运行上面的代码时，我们得到以下结果-

```
{
   "_index" : "sensor",
   "_type" : "_doc",
   "_id" : "1",
   "_version" : 1,
   "result" : "created",
   "_shards" : {
      "total" : 2,
      "successful" : 1,
      "failed" : 0
   },
   "_seq_no" : 0,
   "_primary_term" : 1
}
```

现在，为其他文档添加第二个文档，依此类推。

```
PUT /sensor-2018-01-01/_doc/2
{
   "timestamp": 1413729294000,
   "temperature": 201,
   "voltage": 5.9,
   "node": "a"
}
```

## 创建汇总作业

```
PUT _rollup/job/sensor
{
   "index_pattern": "sensor-*",
   "rollup_index": "sensor_rollup",
   "cron": "*/30 * * * * ?",
   "page_size" :1000,
   "groups" : {
      "date_histogram": {
         "field": "timestamp",
         "interval": "60m"
      },
      "terms": {
         "fields": ["node"]
      }
   },
   "metrics": [
      {
         "field": "temperature",
         "metrics": ["min", "max", "sum"]
      },
      {
         "field": "voltage",
         "metrics": ["avg"]
      }
   ]
}
```

cron参数控制作业的激活时间和激活频率。当汇总作业的cron计划触发时，它将从上次激活后从上次中断的地方开始汇总

在作业运行并处理了一些数据之后，我们可以使用DSL查询进行一些搜索。

```
GET /sensor_rollup/_rollup_search
{
   "size": 0,
   "aggregations": {
      "max_temperature": {
         "max": {
            "field": "temperature"
         }
      }
   }
}
```



# Elasticsearch 冻结索引

频繁搜索的索引保存在内存中，因为重建索引和帮助进行高效搜索需要时间。另一方面，可能有我们很少访问的索引。这些索引不需要占用内存，可以在需要时重新构建。这类指数被称为冻结索引。

每当搜索分片时，Elasticsearch都会构建冻结索引的每个分片的瞬态数据结构，并在搜索完成后立即丢弃这些数据结构。由于Elasticsearch不会在内存中维护这些临时数据结构，因此冻结索引消耗的堆要比普通索引少得多。与其他方式相比，这允许更高的磁盘与堆的比率。

## 冻结和解冻示例

以下示例冻结和解冻索引-

```
POST /index_name/_freeze
POST /index_name/_unfreeze
```

预期对冻结索引的搜索将缓慢执行。冻结索引不适用于较高的搜索负载。即使对未冻结的索引进行的搜索在几毫秒内完成，对冻结索引的搜索也可能需要数秒或数分钟才能完成。

## 搜索冻结索引

每个节点的并发加载的冻结索引数受search_throttled线程池中的线程数限制，默认情况下为1。要包含冻结索引，必须使用查询参数− *ignore_throttled = false*来执行搜索请求*。*

```
GET /index_name/_search?q=user:tpoint&ignore_throttled=false
```

## 监视冻结的索引

冻结索引是使用搜索限制和内存有效分片实现的普通索引。

```
GET /_cat/indices/index_name?v&h=i,sth
```



# Elasticsearch 测试

Elasticsearch提供了一个jar文件，可以将其添加到任何Java IDE中，并可以用于测试与Elasticsearch相关的代码。使用Elasticsearch提供的框架可以执行一系列测试。在本章中，我们将详细讨论这些测试-

- 单元测试
- 整合测试
- 随机测试

## 先决条件

要开始测试，您需要将Elasticsearch测试依赖项添加到您的程序中。您可以将maven用于此目的，并可以在pom.xml中添加以下内容。

```
<dependency>
   <groupId>org.elasticsearch</groupId>
   <artifactId>elasticsearch</artifactId>
   <version>2.1.0</version>
</dependency>
```

EsSetup已被初始化，以启动和停止Elasticsearch节点并创建索引。

```
EsSetup esSetup = new EsSetup();
```

esSetup.execute() 带有createIndex的函数将创建索引，您需要指定设置，类型和数据。

## 单元测试

单元测试是通过使用JUnit和Elasticsearch测试框架进行的。可以使用Elasticsearch类创建节点和索引，并且可以使用test方法执行测试。ESTestCase和ESTokenStreamTestCase类用于此测试。

## 整合测试

集成测试使用群集中的多个节点。ESIntegTestCase类用于此测试。有多种方法可以简化准备测试用例的工作。

| 序号 | 方法与说明                                          |
| :--- | :-------------------------------------------------- |
| 1    | **refresh()**将刷新群集中的所有索引                 |
| 2    | **ensureGreen()**确保绿色健康集群状态               |
| 3    | **ensureYellow()**确保黄色运行状况群集状态          |
| 4    | **createIndex(name)**使用传递给此方法的名称创建索引 |
| 5    | **flush()**将刷新群集中的所有索引                   |
| 6    | **flushAndRefresh()**flush() 和 refresh()           |
| 7    | **indexExists(name)**验证指定索引是否存在           |
| 8    | **clusterService()**返回集群服务 java 类            |
| 9    | **cluster()**返回测试群集类                         |

## 测试集群方法

| 序号 | 方法与说明                                                   |
| :--- | :----------------------------------------------------------- |
| 1    | **ensureAtLeastNumNodes(n)**确保群集中最多的最小节点数大于或等于指定的数目 |
| 2    | **ensureAtMostNumNodes(n)**确保群集中最多的节点数小于或等于指定的数目 |
| 3    | **stopRandomNode()**停止群集中的随机节点                     |
| 4    | **stopCurrentMasterNode()**停止主节点                        |
| 5    | **stopRandomNonMaster()**停止群集中不是主节点的随机节点      |
| 6    | **buildNode()**创建新节点                                    |
| 7    | **startNode(settings)**启动新节点                            |
| 8    | **nodeSettings()**重写此方法以更改节点设置                   |

## 访问客户端

客户机用于访问集群中的不同节点并执行某些操作。ESIntegTestCase.client()方法用于获取随机客户端。Elasticsearch还提供了访问客户端的其他方法，这些方法可以使用ESIntegTestCase.internalCluster()方法。

| 序号 | 方法与说明                                                   |
| :--- | :----------------------------------------------------------- |
| 1    | **iterator()**这有助于您访问所有可用的客户端                 |
| 2    | **masterClient()**这将返回一个与主节点通信的客户机           |
| 3    | **nonMasterClient()**这将返回一个客户端，该客户端不与主节点通信 |
| 4    | **clientNodeClient()**这将返回当前处于客户端节点上的客户端   |

## 随机测试

此测试用于测试用户代码与所有可能的数据，以便将来不会出现任何类型的数据失败。随机数据是执行此测试的最佳选择。

## 生成随机数据

在此测试中，Random类由RandomizedTest提供的实例实例化，并提供了许多用于获取不同类型数据的方法。

| 方法             | 返回值                    |
| :--------------- | :------------------------ |
| getRandom()      | Instance of random class  |
| randomBoolean()  | Random boolean            |
| randomByte()     | Random byte               |
| randomShort()    | Random short              |
| randomInt()      | Random integer            |
| randomLong()     | Random long               |
| randomFloat()    | Random float              |
| randomDouble()   | Random double             |
| randomLocale()   | Random locale             |
| randomTimeZone() | Random time zone          |
| randomFrom()     | Random element from array |

## 断言

ElasticsearchAssertions和ElasticsearchGeoAssertions类包含断言，这些断言用于在测试时执行一些常规检查。例如，观察此处给出的代码-

```
SearchResponse seearchResponse = client().prepareSearch();
assertHitCount(searchResponse, 6);
assertFirstHit(searchResponse, hasId("6"));
assertSearchHits(searchResponse, "1", "2", "3", "4",”5”,”6”);
```



















## 面试

### 1、倒排索引深入骨髓

- #### 倒排索引的原理以及它是用来解决哪些问题（谈谈你对倒排索引的理解）

- #### 倒排索引底层数据结构（倒排索引的数据结构）

- #### 倒排表的压缩算法（底层算法）

- #### Trie字典树（Prefix Trees）原理（类似题目：B-Trees/B+Trees/红黑树等）

- #### FST原理（FST的构建过程以及FST在Lucene中的应用原理）

- #### 索引文件的内部结构（.tip和.tim文件内部数据结构）

- #### FST在Lucene的读写过程（Lucene源码实现）

### 2、Elasticsearch的写入原理

### 3、读写性能调优

#### 	写入性能调优：

- 增加flush时间间隔，目的是减小数据写入磁盘的频率，减小磁盘IO

- 增加refresh_interval的参数值，目的是减少segment文件的创建，减少segment的merge次数，merge是发生在jvm中的，有可能导致full GC，增加refresh会降低搜索的实时性。

- 增加Buffer大小，本质也是减小refresh的时间间隔，因为导致segment文件创建的原因不仅有时间阈值，还有buffer空间大小，写满了也会创建。         默认最小值 48MB< 默认值 堆空间的10% < 默认最大无限制

- 大批量的数据写入尽量控制在低检索请求的时间段，大批量的写入请求越集中越好。

  - 第一是减小读写之间的资源抢占，读写分离
  - 第二，当检索请求数量很少的时候，可以减少甚至完全删除副本分片，关闭segment的自动创建以达到高效利用内存的目的，因为副本的存在会导致主从之间频繁的进行数据同步，大大增加服务器的资源占用。

- Lucene的数据的fsync是发生在OS cache的，要给OS cache预留足够的内从大小，详见JVM调优。

- 通用最小化算法，能用更小的字段类型就用更小的，keyword类型比int更快，

- ignore_above：字段保留的长度，越小越好

- 调整_source字段，通过include和exclude过滤

- store：开辟另一块存储空间，可以节省带宽

  ***\*注意：_\*******\*sourse\*******\*：\*******\*设置为false\*******\*，\*******\*则不存储元数据\*******\*，\*******\*可以节省磁盘\*******\*，\*******\*并且不影响搜索\*******\*。但是禁用_\*******\*source必须三思而后行\*******\*：\****

  \1. [update](https://www.elastic.co/guide/en/elasticsearch/reference/7.9/docs-update.html)，[update_by_query](https://www.elastic.co/guide/en/elasticsearch/reference/7.9/docs-update-by-query.html)和[reindex](https://www.elastic.co/guide/en/elasticsearch/reference/7.9/docs-reindex.html)不可用。

  \2. 高亮失效

  \3. reindex失效，原本可以修改的mapping部分参数将无法修改，并且无法升级索引

  \4. 无法查看元数据和聚合搜索

  影响索引的容灾能力

- 禁用_all字段：_all字段的包含所有字段分词后的Term，作用是可以在搜索时不指定特定字段，从所有字段中检索，ES 6.0之前需要手动关闭

- 关闭Norms字段：计算评分用的，如果你确定当前字段将来不需要计算评分，设置false可以节省大量的磁盘空间，有助于提升性能。常见的比如filter和agg字段，都可以设为关闭。

- 关闭index_options（谨慎使用，高端操作）：词设置用于在index time过程中哪些内容会被添加到倒排索引的文件中，例如TF，docCount、postion、offsets等，减少option的选项可以减少在创建索引时的CPU占用率，不过在实际场景中很难确定业务是否会用到这些信息，除非是在一开始就非常确定用不到，否则不建议删除

  ### 搜索速度调优

- 禁用swap

- 使用filter代替query

- 避免深度分页，避免单页数据过大，可以参考百度或者淘宝的做法。es提供两种解决方案scroll search和search after

- 注意关于index type的使用

- 避免使用稀疏数据

- 避免单索引业务重耦合

- 命名规范

- 冷热分离的架构设计

- fielddata：搜索时正排索引，doc_value为index time正排索引。

- enabled：是否创建倒排索引

- doc_values：正排索引，对于不需要聚合的字段，关闭正排索引可节省资源，提高查询速度

- 开启自适应副本选择（ARS），6.1版本支持，7.0默认开启，

### 4、ES的节点类型

- master：候选节点
- data：数据节点
- data_content：数据内容节点
- data_hot：热节点
- data_warm：索引不再定期更新，但仍可查询
- data_code：冷节点，只读索引
- Ingest：预处理节点，作用类似于Logstash中的Filter
- ml：机器学习节点
- remote_cluster_client：候选客户端节点
- transform：转换节点
- voting_only：仅投票节点

### 5、Mater选举过程

- #### 	设计思路：所有分布式系统都需要解决数据的一致性问题，处理这类问题一般采取两种策略：

  - #### 避免数据不一致情况的发生

  - #### 定义数据不一致后的处理策略

- #### 主从模式和无主模式

  - #### ES为什么使用主从模式？

    - 在相对稳定的对等网络中节，点的数量远小于单个节点可以维护的节点数，并且网络环境不必经常处理节点的加入和离开。

- #### ES的选举算法

  - Bully和Paxos

- #### 脑裂是什么以及如何避免

### 6、Elasticsearch调优

- #### 通用法则

  - 通用最小化算法：对于搜索引擎级的大数据检索，每个bit尤为珍贵。
  - 业务分离：聚合和搜索分离

- #### 数据结构 学员案例

- #### 硬件优化

  ​		es的默认配置是一个非常合理的默认配置，绝大多数情况下是不需要修改的，如果不理解某项配置的含义，没有经过验证就贸然修改默认配置，可能造成严重的后果。比如max_result_window这个设置，默认值是1W，这个设置是分页数据每页最大返回的数据量，冒然修改为较大值会导致OOM。ES没有银弹，不可能通过修改某个配置从而大幅提升ES的性能，通常出厂配置里大部分设置已经是最优配置，只有少数和具体的业务相关的设置，事先无法给出最好的默认配置，这些可能是需要我们手动去设置的。关于配置文件，如果你做不到彻底明白配置的含义，不要随意修改。

  ​		jvm heap分配：7.6版本默认1GB，这个值太小，很容易导致OOM。Jvm heap大小不要超过物理内存的50%，最大也不要超过32GB（compressed oop），它可用于其内部缓存的内存就越多，但可供操作系统用于文件系统缓存的内存就越少，heap过大会导致GC时间过长

  - 节点：

    根据业务量不同，内存的需求也不同，一般生产建议不要少于16G。ES是比较依赖内存的，并且对内存的消耗也很大，内存对ES的重要性甚至是高于CPU的，所以即使是数据量不大的业务，为了保证服务的稳定性，在满足业务需求的前提下，我们仍需考虑留有不少于20%的冗余性能。一般来说，按照百万级、千万级、亿级数据的索引，我们为每个节点分配的内存为16G/32G/64G就足够了，太大的内存，性价比就不是那么高了。

  - 内存：

    根据业务量不同，内存的需求也不同，一般生产建议不要少于16G。ES是比较依赖内存的，并且对内存的消耗也很大，内存对ES的重要性甚至是高于CPU的，所以即使是数据量不大的业务，为了保证服务的稳定性，在满足业务需求的前提下，我们仍需考虑留有不少于20%的冗余性能。一般来说，按照百万级、千万级、亿级数据的索引，我们为每个节点分配的内存为16G/32G/64G就足够了，太大的内存，性价比就不是那么高了。

  - 磁盘：

    对于ES来说，磁盘可能是最重要的了，因为数据都是存储在磁盘上的，当然这里说的磁盘指的是磁盘的性能。磁盘性能往往是硬件性能的瓶颈，木桶效应中的最短板。ES应用可能要面临不间断的大量的数据读取和写入。生产环境可以考虑把节点冷热分离，“热节点”使用SSD做存储，可以大幅提高系统性能；冷数据存储在机械硬盘中，降低成本。另外，关于磁盘阵列，可以使用raid 0。

  - CPU：

    CPU对计算机而言可谓是最重要的硬件，但对于ES来说，可能不是他最依赖的配置，因为提升CPU配置可能不会像提升磁盘或者内存配置带来的性能收益更直接、显著。当然也不是说CPU的性能就不重要，只不过是说，在硬件成本预算一定的前提下，应该把更多的预算花在磁盘以及内存上面。通常来说单节点cpu 4核起步，不同角色的节点对CPU的要求也不同。服务器的CPU不需要太高的单核性能，更多的核心数和线程数意味着更高的并发处理能力。现在PC的配置8核都已经普及了，更不用说服务器了。

  - 网络： 

    ES是天生自带分布式属性的，并且ES的分布式系统是基于对等网络的，节点与节点之间的通信十分的频繁，延迟对于ES的用户体验是致命的，所以对于ES来说，低延迟的网络是非常有必要的。因此，使用扩地域的多个数据中心的方案是非常不可取的，ES可以容忍集群夸多个机房，可以有多个内网环境，支持跨AZ部署，但是不能接受多个机房跨地域构建集群，一旦发生了网络故障，集群可能直接GG，即使能够保证服务正常运行，维护这样（跨地域单个集群）的集群带来的额外成本可能远小于它带来的额外收益。

  - 集群规划：没有最好的配置，只有最合适的配置。

  - 在集群搭建之前，首先你要搞清楚，你ES cluster的使用目的是什么？主要应用于哪些场景，比如是用来存储事务日志，或者是站内搜索，或者是用于数据的聚合分析。针对不同的应用场景，应该指定不同的优化方案。

  - 集群需要多少种配置（内存型/IO型/运算型），每种配置需要多少数量，通常需要和产品运营和运维测试商定，是业务量和服务器的承载能力而定，并留有一定的余量。

  - 一个合理的ES集群配置应不少于5台服务器，避免脑裂时无法选举出新的Master节点的情况，另外可能还需要一些其他的单独的节点，比如ELK系统中的Kibana、Logstash等。

- #### 架构优化:

  - #### 合理的分配角色和每个节点的配置，在部署集群的时候，应该根据多方面的情况去评估集群需要多大规模去支撑业务。这个是需要根据在你当前的硬件环境下测试数据的写入和搜索性能，然后根据你目前的业务参数来动态评估的，比如：

    - 业务数据的总量、每天的增量
    - 查询的并发以及QPS
    - 峰值的请求量

  - #### 节点并非越多越好，会增加主节点的压力

  - #### 分片并非越多越好，从deep pageing 的角度来说，分片越多，JVM开销越大，负载均衡（协调）节点的转发压力也越大，查询速度也越慢。单个分片也并非越大越好，一般来说单个分片大小控制在30-50GB。

  - 

- #### Mpping优化：

  - #### 优化字段的类型，关闭对业务无用的字段

  - #### 尽量不要使用dynamic mapping分片大小

- #### Developer调优：修炼内功，提升修养

### 7、索引备份还原

​		snapshot，

### 8、数据同步方案

- #### 数据一致性问题

- #### 基于Canal+binlog同步MySql

- #### 基于packetbeat监听9200端口

### 9、搜索引擎和ES（搜索引擎的原理、ES的认识或理解）

- #### 概念：大数据检索（区分搜索）、大数据分析、大数据存储

- #### 性能：PB级数据秒查（NRT Near Real Time）

  - 高效的压缩算法
  - 快速的编码和解码算法
  - 合理的数据结构
  - 通用最小化算法

- #### 场景：搜索引擎、垂直搜索、BI、GIthub、ELKB




