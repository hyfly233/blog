export const navConfig = [
    {text: 'Home', link: '/'},
    {
        text: '知识点',
        children: [
            {
                text: "JVM",
                children: [
                    {text: 'JVM', link: '/md/article/jvm/JVM.md'},
                    {text: 'JVM 内存模型', link: '/md/article/jvm/JVM内存模型.md'},
                    {text: '垃圾回收', link: '/md/article/jvm/垃圾回收.md'},
                ]
            },
            {
                text: "K8s",
                children: [
                    {text: '环境搭建', link: '/md/article/k8s/环境搭建.md'}
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
