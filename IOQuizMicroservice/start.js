const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const createError = require('http-errors');

const ServerError = require('./errors/ServerError.js');

require('express-async-errors');
require('log-timestamp');

const routes = require('./routes.js');

const app = express();

app.use(helmet());
app.use(morgan(':remote-addr - :remote-user [:date[web]] ":method :url HTTP/:http-version" :status :res[content-length]'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', routes);

app.use((err, req, res, next) => {
    console.error(err);
    let status = err.get;
    let message = 'Something Bad Happened';

    if (err instanceof ServerError) {
        message = err.Message;
        status = err.StatusCode;
    }

    return next(createError(status, message));
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`App is listening on ${port}`);
});