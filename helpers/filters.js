function buildFilters(req) {
    
    var page = 1;
    var limit = 10;
    var ascending = 'true';
    var sort = '_id';

    if (req.query.page)
        page = parseInt(req.query.page) + 1;
    if (req.query.limit)
        limit = req.query.limit;
    if (req.query.ascending)
        ascending = req.query.ascending;
    if (req.query.sort)
        sort = req.query.sort;

    if (ascending === 'false') {
        sort = '-' + sort;
    }

    return {
        page, limit, sort
    };
}

module.exports = {
    buildFilters
}