//Load dependencies
const Router = require('koa-router');
const send = require('koa-send');
const { db, users } = require('../db.js');
const users = {}; // DB of users
const request = require('request');
const templates = require('./templates.js');
const config = require('../config.js');

//Init the router
const router = new Router(); //router.get|put|post|patch|delete|del

//Serve bundled js and css files
router.get('/main.(.*)', async ctx => {
    await send(ctx, ctx.path, {
        root: 'dist',
        immutable: true,
        maxage: 60 * 24 * 365 * 1000 //Cache for a year
    })
});

//Serve The Favicon
router.get('/favicon.ico', async ctx => await send(ctx, ctx.path, {
    root: __dirname,
    maxAge: 60 * 24 * 1000, //Cache for a day
}));

//Serve The Search results page
router.get('/search', async(ctx, next) => {

    let results = index.search(ctx.query.q, {
        fields: {
            slug: { boost: 3 },
            title: { boost: 2 },
            content: { boost: 1 }
        }
    });

    ctx.body = templates.search({
        current_year: new Date().getFullYear(),
        query: ctx.query.q,
        config,
        posts: results.map(result => {
            return {
                post: db[result.ref],
                score: result.score
            }
        })
    });

});

//Blog post or page
router.get('/:slug', (ctx, next) => {

    let slug = ctx.params.slug.toLowerCase();
    let content = db[slug];

    if (typeof(content) == "undefined") {
        next()
        return
    }
    content.current_year = new Date().getFullYear();
    content.config = config;

    //Posts
    if (content.type == "post") {

        let date = new Date(content.modified);
        let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        content.by = users[content.author].name;
        content.modified = date.toLocaleDateString("en-US", options);
        ctx.body = templates.post(content);
        return

    }

    //Pages
    if (content.type == "page") {
        ctx.body = templates.page(content);
        return
    }

    //Nothing to do. Move on to the next handler
    next();
});

//Homepage
router.get('/', (ctx, next) => {
    let _posts = []
    Object.values(db).forEach(post => {
        let { author, categories, comment_status, content, date_gmt, excerpt, id, modified_gmt, slug, status, tags, title } = post
        if (post.type == "post") {
            _posts.push({
                author: users[author].name,
                categories,
                comment_status,
                content,
                date,
                excerpt,
                id,
                modified,
                slug,
                title
            })
        }
    })

    ctx.body = templates.blog({
        current_year: new Date().getFullYear(),
        config,
        posts: _posts
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

//Newsletter signup
router.post('/newsletter-api-signup', (ctx, next) => {

    //Verify that the email is correct
    let validateEmail = email => {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    //Add the email to mailchimp

    //Send a success response to the server
    ctx.body = ctx.body;
});
module.exports = router