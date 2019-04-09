const request = require('request'); //An easy way to send HTTP Requests
let db = {}; // DB of posts and pages
let users = {}; // DB of published authors
const config = require('./config.js');


//Init the Search index
const index = require('elasticlunr')(function() {

    console.log('Attempting to init the search index');
    this.addField('slug');
    this.addField('title');
    this.addField('content');
    this.setRef('slug');
    this.saveDocument(false);
    console.log('Successfully init the search index');

});


/** Helper function to add data to the database
 * 
 */
let addRemoteData = (_data, type) => {

    _data.forEach(single => {

        single.type = type;

        //Add it to the index
        index.addDoc({
            "title": single.title.rendered,
            "slug": single.slug,
            "content": single.content.rendered,
        });

        //Add it to the database
        db[single.slug] = single;
    });

}

console.log('Attempting to fetch API Data');

//Posts
request(config.wordpressApi + 'posts', function(error, response, body) {
    if (!error) {

        let _posts = JSON.parse(body);
        console.log(_posts.length + ' posts fetched');
        addRemoteData(_posts, 'post');
        console.log('Successfully added posts to the index and the database');


    } else {
        console.log('Cant get posts error:', error);
    }
});

//Pages
request(config.wordpressApi + 'pages', function(error, response, body) {
    if (!error) {

        let _pages = JSON.parse(body);
        console.log(_pages.length + ' pages fetched');
        addRemoteData(_pages, 'page');
        console.log('Successfully added pages to the index and the database');


    } else {
        console.log('Cant get pages error:', error);
    }
});




//Load users
request(config.wordpressApi + 'authors', function(error, response, body) {
    if (!error) {

        let _users = JSON.parse(body);
        console.log(_users.length + ' users fetched');

        _users.forEach(user => {
            users[user.id] = user;
        });

        console.log('Successfully added users to the database');

    } else {
        console.log('Cant get users error:', error);
    }
});

module.exports = {
    db,
    users
}