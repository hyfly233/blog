const head = require('./config/head')
const plugins = require('./config/plugins')
const navConfig = require('./config/navConfig')

module.exports = {
    base: '/blog/',
    title: '尘世闲游',
    description: '河边共指星为客  花里空瞻月是卿',
    head: head,
    themeConfig: {
        activeHeaderLinks: true,
        search: true,
        searchMaxSuggestions: 10,
        logo: '/assets/img/favicon.ico',
        lastUpdated: "最后更新时间 ",
        nextLinks: true,
        prevLinks: true,
        nav: navConfig,
        sidebar: 'auto',
    },
    port: 8090,
    cache: true,
    plugins: plugins,
}
