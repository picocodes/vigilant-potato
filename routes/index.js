//Load dependencies
const Router = require('koa-router');
const send = require('koa-send');
const handlebars = require('handlebars');
const fs = require('fs');
const loki = require('lokijs');

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

//Prepare the database
var db = new loki('example.db');
var posts = db.addCollection('posts', {
    unique: ['slug']
});

posts.insert([{
        'slug': 'a',
        'title': 'Post A Title',
        'content': '<p>This is just example content. More advanced data will be loaded soon so stay tuned.</p>',
        'author': 'Post A Author',
        'tags': 'Post A Tags',
        'date': 'Post A Date',
        'modified': 'Post A Modified',
    },
    {
        'slug': 'b',
        'title': 'Post b Title',
        'content': '<p>A complete list (and brief description) of every tag in the HTML, including the latest ... Click through to view details, code samples and more for each tag. Be sure</p>',
        'author': 'Post b Author',
        'tags': 'Post b Tags',
        'date': 'Post b Date',
        'modified': 'Post b Modified',
    },
]);

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

//Search results
router.get('/search', (ctx, next) => {

    ctx.body = ctx.query.q;

});

//Blog post or page
router.get('/:slug', (ctx, next) => {

    let post = posts.by("slug", ctx.params.slug.toLowerCase());
    if (null == post) {
        next();
        return;
    }
    post.current_year = new Date().getFullYear();
    ctx.body = post_template(post);

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