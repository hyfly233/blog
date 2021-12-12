const moment = require('moment')
moment.locale("zh-cn")

module.exports = {
    '@vuepress/search': {
        searchMaxSuggestions: 10
    },
    '@vuepress/last-updated': {
        transformer: (timestamp) => {
            return moment(timestamp).format("LLLL")
        }
    },
    '@vuepress/back-to-top': true,
}
