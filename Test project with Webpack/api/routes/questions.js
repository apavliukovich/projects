const express = require('express'),
    router = express.Router(),
    config = require('config'),
    fs = require('file-system');

router.get('/api/questions', (req, res) => {
    res.send(fs.readFileSync(config.get('jsonTasks'), 'utf8'));
});

module.exports = router;