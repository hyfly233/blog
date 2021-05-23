const moment = require('moment')
moment.locale("zh-cn")

module.exports = {
    base: '/blog/',
    title: '尘世闲游',
    description: '河边共指星为客  花里空瞻月是卿',
    head: [
        ['link', {rel: 'icon', href: '/assets/img/CowFace.ico'}],
        ['meta', {name: 'author', content: 'hyfly233'}],
        ['meta', {name: 'keywords', content: '通过 vuepress 构建的博客'}],
        ['link', {rel: 'manifest', href: '/manifest.json'}],
        ['meta', {name: 'theme-color', content: '#3eaf7c'}],
        ['meta', {name: 'apple-mobile-web-app-capable', content: 'yes'}],
        ['meta', {name: 'apple-mobile-web-app-status-bar-style', content: 'black'}],
        ['link', {rel: 'apple-touch-icon', href: '/icons/icon-152x152.png'}],
        ['link', {rel: 'mask-icon', href: '/icons/safari-pinned-tab.svg', color: '#3eaf7c'}],
        ['meta', {name: 'msapplication-TileImage', content: '/icons/icon-144x144.png'}],
        ['meta', {name: 'msapplication-TileColor', content: '#000000'}]
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
    plugins: {
        '@vuepress/pwa': {
            serviceWorker: true,
            updatePopup: {
                '/': {
                    message: "New content is available.",
                    buttonText: "Refresh"
                },
                '/zh/': {
                    message: "侦测到在途核打击",
                    buttonText: "确认"
                }
            }
        },
        '@vuepress/back-to-top': {},
        '@vuepress/last-updated': {
            transformer: (timestamp) => {
                return moment(timestamp).format("LLLL")
            }
        },
        '@vuepress/google-analytics': {
            'ga': 'UA-197638551-1'
        },
        '@vssue/vuepress-plugin-vssue': {
            platform: 'github-v4',

            // 其他的 Vssue 配置
            owner: 'hyfly233',
            repo: 'blog',
            clientId: '469f0075926a31403108',
            clientSecret: 'c12a84f9f77476ceefc245a90e3256bc2beef841',
            autoCreateIssue: true
        }
    },
}
