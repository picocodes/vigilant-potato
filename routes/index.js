//Load dependencies
const Router = require('koa-router');
const send = require('koa-send');
const handlebars = require('handlebars');
const fs = require('fs');

//Load the router
const router = new Router(); //router.get|put|post|patch|delete|del

//Load template files
var post_template = e => e;
fs.readFile('dist/post.html', 'utf8',
    function(err, data) {
        if (err) {
            console.log(err)
        } else {
            post_template = handlebars.compile(data);
        }
    });

var posts = {
    'a': {
        'title': 'Post A Title',
        'content': 'Post A Content',
        'author': 'Post A Author',
        'tags': 'Post A Tags',
        'date': 'Post A Date',
        'modified': 'Post A Modified',
    },
    'b': {
        'title': 'Post B Title',
        'content': 'Post B Content',
        'author': 'Post B Author',
        'tags': 'Post B Tags',
        'date': 'Post B Date',
        'modified': 'Post B Modified',
    },
    'c': {
        'title': 'Post C Title',
        'content': 'Post C Content',
        'author': 'Post C Author',
        'tags': 'Post C Tags',
        'date': 'Post c Date',
        'modified': 'Post C Modified',
    },
    'd': {
        'title': 'Post D Title',
        'content': 'Post D Content',
        'author': 'Post D Author',
        'tags': 'Post D Tags',
        'date': 'Post D Date',
        'modified': 'Post D Modified',
    },
};
//Load Templates


//Bundled js and css files
router.get('/main.(.*)', async ctx => {
    await send(ctx, ctx.path, {
        root: 'dist',
        immutable: true,
        maxage: 60 * 24 * 365 * 1000 //Cache for a year
    })
});

//Favicon
router.get('/favicon.ico', async ctx => await send(ctx, ctx.path, {
    root: __dirname,
    maxAge: 60 * 24 * 1000, //Cache for a day
}));

//Blog post or page
router.get('/:slug', (ctx, next) => {

    if (undefined == posts[ctx.params.slug.toLowerCase()]) {
        next();
        return;
    }

    ctx.body = post_template(posts[ctx.params.slug.toLowerCase()]);

});

//Homepage
router.get('/', (ctx, next) => {
    // the parsed body will store in ctx.request.body
    // if nothing was parsed, body will be an empty object {}
    //ctx.body = ctx.request.body;
    ctx.body = 'This is the homepage';
});

//Compare, Specs
router
    .get('/compare/:cameras', (ctx, next) => {
        ctx.body = 'Comparing cameras';
    })
    .get('/specs/:camera', (ctx, next) => {
        ctx.body = 'View camera specs';
    });

module.exports = router