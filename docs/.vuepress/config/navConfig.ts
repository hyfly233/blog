export const navConfig = [
    { text: 'Home', link: '/' },
    {
        text: '基础',
        children: [
            {
                text: 'Java',
                children: [
                    { text: 'Java基础', link: '/md/基础/Java基础.md' },
                    { text: '面向对象', link: '/md/基础/面向对象.md' },
                    { text: 'Java进阶', link: '/md/基础/Java进阶.md' },
                    { text: 'Java反射', link: '/md/基础/反射.md' },
                    { text: 'Java调优', link: '/md/基础/Java调优.md' },
                    { text: '集合', link: '/md/基础/集合.md' },
                    { text: '多线程', link: '/md/基础/多线程.md' },
                    { text: '线程池', link: '/md/基础/线程池.md' },
                    { text: '锁', link: '/md/基础/锁.md' },
                ]
            }
        ]
    },
    {
        text: '数据库',
        children: [
            { text: '数据库索引', link: '/md/数据库/SQL.md' },
            { text: '数据库锁与事务', link: '/md/数据库/数据库索引.md' },
            { text: '数据库优化', link: '/md/数据库/数据库优化.md' },
        ]
    },
    {
        text: 'Spring',
        children: [
            { text: 'Spring', link: '/md/Spring/Spring.md' },
            { text: 'Spring MVC', link: '/md/Spring/SpringMvc.md' },
            { text: 'Spring Boot', link: '/md/Spring/SpringBoot.md' },
        ]
    },
    {
        text: '微服务',
        children: [
            {
                text: 'Spring Cloud', children: [
                    { text: 'Spring Cloud', link: '/md/微服务/SpringCloud.md' },
                    { text: 'Spring Cloud Alibaba', link: '/md/微服务/SpringCloudAlibaba.md' },
                    { text: 'Spring Cloud Netflix', link: '/md/微服务/SpringCloudNetflix.md' },
                ]
            },
            {
                text: 'Zookeeper', children: [
                    { text: 'Zookeeper', link: '/md/微服务/Zookeeper.md' },
                ]
            },
            {
                text: '分布式锁', children: [
                    { text: '分布式锁', link: '/md/微服务/分布式锁.md' },
                ]
            },
            {
                text: '分布式事务', children: [
                    { text: '分布式事务', link: '/md/微服务/分布式事务.md' },
                ]
            }
        ]
    }
]
