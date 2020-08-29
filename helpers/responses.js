function sendError(res, status, message) {
    return res.status(status).send({
        code: 'ERROR',
        message: message,
        results: {}
    });
}

function sendResponseOk(res, value, message) {
    if (value && value.docs) {
        return res.status(200).send({
            code: 'OK',
            message: message || '',
            results: {
                data: value.docs,
                totalPages: value.totalPages,
                totalDocs: value.totalDocs,
                currentPage: value.page - 1
            }
        });
    }

    return res.status(200).send({
        code: 'OK',
        message: message || '',
        results: {
            data: value
        }
    });
}

module.exports = {
    sendError,
    sendResponseOk
}