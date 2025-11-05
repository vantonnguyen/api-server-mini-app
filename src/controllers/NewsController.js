class NewsController {
    index(req, res) {
        res.send('NEWS')
    }

    show(req, res) {
        res.send('SHOW NEWS DETAIL')
    }
}
module.exports = new NewsController();
