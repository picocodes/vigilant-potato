//Load dependencies
const Router = require('koa-router');
const send = require('koa-send');
const handlebars = require('handlebars');
const fs = require('fs');
const loki = require('lokijs');
const request = require('request');

//Load the router
const router = new Router(); //router.get|put|post|patch|delete|del

//Load template files

//Blog list
var blog_template = e => e;
fs.readFile('dist/blog.html', 'utf8',
    function(err, data) {
        if (err) {
            console.log(err)
        } else {
            blog_template = handlebars.compile(data);
        }
    });

//Posts
var post_template = e => e;
fs.readFile('dist/post.html', 'utf8',
    function(err, data) {
        if (err) {
            console.log(err)
        } else {
            post_template = handlebars.compile(data);
        }
    });

//Pages
var page_template = e => e;
fs.readFile('dist/page.html', 'utf8',
    function(err, data) {
        if (err) {
            console.log(err)
        } else {
            page_template = handlebars.compile(data);
        }
    });

//Prepare the database
var db = new loki('example.db');

//Load posts
var posts = db.addCollection('posts', {
    unique: ['slug']
});
request('http://localhost/wordpress/wp-json/wp/v2/posts?per_page=100', function(error, response, body) {
    if (!error) {
        posts.insert(JSON.parse(body));
    } else {
        console.log('Cant get posts error:', error);
    }
});

//Load pages
var pages = db.addCollection('pages', {
    unique: ['slug']
});
request('http://localhost/wordpress/wp-json/wp/v2/pages?per_page=100', function(error, response, body) {
    if (!error) {
        pages.insert(JSON.parse(body));
    } else {
        console.log('Cant get pages error:', error);
    }
});

//Load authors
var authors = db.addCollection('authors', {
    unique: ['id']
});
request('http://localhost/wordpress/wp-json/wp/v2/users?per_page=100', function(error, response, body) {
    if (!error) {
        authors.insert(JSON.parse(body));
    } else {
        console.log('Cant get users error:', error);
    }
});


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

    //Posts
    let post = posts.by("slug", ctx.params.slug.toLowerCase());
    if (post) {
        let date = new Date(post.modified_gmt);
        let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        post.current_year = new Date().getFullYear();
        post.by = authors.by('id', post.author).name;
        post.modified_gmt = date.toLocaleDateString("en-US", options);
        ctx.body = post_template(post);
        return
    }

    //Pages
    let page = pages.by("slug", ctx.params.slug.toLowerCase());
    if (page) {
        page.current_year = new Date().getFullYear();
        ctx.body = page_template(page);
        return
    }

    //Nothing to do. Move on to the next handler
    next();
});

//Homepage
router.get('/', (ctx, next) => {
    ctx.body = blog_template({
        current_year: new Date().getFullYear(),
        posts: posts.find()
    });
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