module.exports = [
    { text: 'Home', link: '/' },
    {
        text: 'Back End',
        items: [
            // {
            //     text: 'Go', items: [
            //         {text: 'Basis', link: '/md/backEnd/go/basis/basis'},
            //         {text: 'Gin', link: '/md/backEnd/go/gin/gin'}
            //     ]
            // },
            {
                text: 'Java',
                items: [
                    { text: 'Basis', link: '/md/backEnd/java/basis/basis' },
                    { text: 'MultiThread', link: '/md/backEnd/java/multiThread/multiThread' },
                    { text: 'JVM', link: '/md/backEnd/java/jvm/jvm' },
                    { text: 'IO', link: '/md/backEnd/java/io/io' },
                    { text: 'Spring', link: '/md/backEnd/java/spring/spring' },
                    { text: 'Spring MVC', link: '/md/backEnd/java/springMvc/springMvc' },
                    { text: 'Spring Boot', link: '/md/backEnd/java/springBoot/springBoot' },
                    { text: 'Spring Cloud', link: '/md/backEnd/java/springCloud/springCloud' },
                ]
            }
        ]
    },
    {
        text: 'Front End',
        items: [
            { text: 'Web', link: '/md/frontEnd/web/web' },
            { text: 'Vue', link: '/md/frontEnd/vue/vue' },
            { text: 'Uni-App', link: '/about/' }
        ]
    },
    {
        text: 'Database',
        items: [
            { text: 'Basis', link: '/md/database/basis/basis' },
            { text: 'MongoDB', link: '/md/database/mongoDB/mongoDB' },
            { text: 'MySQL', link: '/md/database/mysql/mysql' },
        ]
    },
    {
        text: 'Middleware',
        items: [
            {
                text: 'Cache', items: [
                    { text: 'Basis', link: '/md/middleware/cache/basis/basis' },
                    { text: 'Redis', link: '/md/middleware/cache/redis/redis' },
                ]
            },
            {
                text: 'Message', items: [
                    { text: 'Basis', link: '/md/middleware/message/basis/basis' },
                    { text: 'RabbitMQ', link: '/md/middleware/message/rabbitMQ/rabbitMQ' },
                    { text: 'Kafka', link: '/' },
                ]
            },
            {
                text: 'Search', items: [
                    { text: 'Elastic Search', link: '/md/middleware/search/es/es' }
                ]
            },
            {
                text: 'Storage', items: [
                    { text: 'Basis', link: '/md/middleware/storage/basis/basis' },
                    { text: 'FastDFS', link: '/md/middleware/storage/fastDfs/fastDfs' }
                ]
            }
        ]
    },
    {
        text: 'Other',
        items: [
            { text: 'Algorithm', link: '/md/other/algorithm/algorithm' },
            { text: 'Design Patterns', link: '/md/other/designPatterns/designPatterns' },
            { text: 'Data Structure', link: '/md/other/dataStructure/dataStructure' },
        ]
    },
    { text: 'About', link: '/about/' },
]
