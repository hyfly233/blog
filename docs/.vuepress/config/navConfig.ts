export const navConfig = [
    {text: 'Home', link: '/'},
    {
        text: '知识点',
        children: [
            {
                text: "JVM",
                children: [
                    {text: 'JVM', link: '/md/知识点/jvm/JVM.md'},
                    {text: 'JVM 内存模型', link: '/md/知识点/jvm/JVM内存模型.md'},
                    {text: '垃圾回收', link: '/md/知识点/jvm/垃圾回收.md'},
                ]
            }
        ]
    },
    {
        text: '八股文',
        children: [
            {
                text: 'Spring Cloud', children: [
                    {text: 'Spring Cloud', link: '/md/微服务/SpringCloud.md'},
                    {text: 'Spring Cloud Alibaba', link: '/md/微服务/SpringCloudAlibaba.md'},
                    {text: 'Spring Cloud Netflix', link: '/md/微服务/SpringCloudNetflix.md'},
                ]
            },
            {
                text: 'Zookeeper', children: [
                    {text: 'Zookeeper', link: '/md/微服务/Zookeeper.md'},
                ]
            },
            {
                text: '分布式锁', children: [
                    {text: '分布式锁', link: '/md/微服务/分布式锁.md'},
                ]
            },
            {
                text: '分布式事务', children: [
                    {text: '分布式事务', link: '/md/微服务/分布式事务.md'},
                ]
            }
        ]
    },

]
