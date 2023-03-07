export const navConfig = [
    { text: 'Home', link: '/' },
    {
        text: 'Back End',
        children: [
            {
                text: 'Java',
                children: [
                    { text: 'Basis', link: '/md/backEnd/java/basis/content' },
                    { text: 'MultiThread', link: '/md/backEnd/java/multiThread/multiThread' },
                    { text: 'JVM', link: '/md/backEnd/java/jvm/jvm' },
                    { text: 'IO', link: '/md/backEnd/java/io/io' },
                    { text: 'Spring', link: '/md/backEnd/java/spring/spring' },
                    { text: 'Spring MVC', link: '/md/backEnd/java/springMvc/springMvc' },
                    { text: 'Spring Boot', link: '/md/backEnd/java/springBoot/springBoot' },
                    { text: 'Spring Cloud', link: '/md/backEnd/java/springCloud/content' },
                ]
            }
        ]
    },
    {
        text: 'Database',
        children: [
            { text: 'Basis', link: '/md/database/basis/basis' },
            { text: 'MongoDB', link: '/md/database/mongoDB/mongoDB' },
            { text: 'MySQL', link: '/md/database/mysql/mysql' },
        ]
    },
    {
        text: 'Middleware',
        children: [
            {
                text: 'Cache', children: [
                    { text: 'Basis', link: '/md/middleware/cache/basis/basis' },
                    { text: 'Redis', link: '/md/middleware/cache/redis/redis' },
                ]
            },
            {
                text: 'Message', children: [
                    { text: 'Basis', link: '/md/middleware/message/basis/basis' },
                    { text: 'RabbitMQ', link: '/md/middleware/message/rabbitMQ/rabbitMQ' },
                    { text: 'Kafka', link: '/' },
                ]
            },
            {
                text: 'Search', children: [
                    { text: 'Elastic Search', link: '/md/middleware/search/es/es' }
                ]
            },
            {
                text: 'Storage', children: [
                    { text: 'Basis', link: '/md/middleware/storage/basis/basis' },
                    { text: 'FastDFS', link: '/md/middleware/storage/fastDfs/fastDfs' }
                ]
            }
        ]
    },
    {
        text: 'Other',
        children: [
            { text: 'Algorithm', link: '/md/other/algorithm/algorithm' },
            { text: 'Design Patterns', link: '/md/other/designPatterns/designPatterns' },
            { text: 'Data Structure', link: '/md/other/dataStructure/dataStructure' },
        ]
    },
]
