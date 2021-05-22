const moment = require('moment')
moment.locale("zh-cn")

module.exports = {
    base: '/blog/',
    title: '尘世闲游',
    description: '河边共指星为客  花里空瞻月是卿',
    head:[
        ['link', {rel: 'icon', href: '/assets/img/CowFace.ico'}],
        ['meta', {name: 'author', content: 'hyfly233'}],
        ['meta', {name: 'keywords', content: '通过 vuepress 构建的博客'}]
    ],
    themeConfig: {
        activeHeaderLinks: true,
        search: true,
        searchMaxSuggestions: 10,
        logo: '/assets/img/favicon.ico',
        lastUpdated: "最后更新时间 ",
        nextLinks: true,
        prevLinks: true,
        nav: [
            {text: 'Home', link: '/'},
            {text: 'About', link: '/about/'},
            {
                text: '下拉',
                ariaLabel: 'Language Menu',
                items: [
                    {text: 'Home', link: '/'},
                    {text: 'About', link: '/about/'},
                ]
            }
        ],
        sidebar: 'auto',

      },
    port: 8090,
    cache: true,
    plugins: [
        [
            '@vuepress/back-to-top',
            '@vuepress/last-updated',
            '@vuepress/google-analytics',
            {
                transformer: (timestamp) => {
                    return moment(timestamp).format("LLLL")
                },
                'ga': 'G-T3CEQ49QFR'
            }
        ]
    ]
}
