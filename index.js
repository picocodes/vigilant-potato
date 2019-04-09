//Load dependencies
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const responseTime = require('koa-response-time');
const router = require('./routes/index');
const logger = require('koa-logger');
const fs = require('fs');
const config = require('./config.js');

//Initiate the environment
const app = new Koa();
var errhtml = 'Not Found';

fs.readFile('dist/404.html', 'utf8',
    function(err, data) {
        if (err) {
            console.log(err)
        } else {
            errhtml = data
        }
    });

//Catch any errors
app.use(async(ctx, next) => {
    try {
        await next()
        const status = ctx.status || 404
        if (status === 404) {
            ctx.throw(404)
        }
    } catch (err) {
        ctx.status = err.status || 500
        if (ctx.status === 404) {
            ctx.body = errhtml;
            ctx.status = 404;
        } else {
            console.log(err)
        }
    }
})

//X-Response-Time header
app.use(responseTime());

//Parse json and form body in the requests
app.use(bodyParser());

//Log the request
app.use(logger())

app
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(config.port, () => {
    console.log('Server running at ' + config.homepage)
})