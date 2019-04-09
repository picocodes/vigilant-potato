const handlebars = require('handlebars');
const fs = require('fs');

//All template files
let _files = [
    'blog', //Blog listing
    'page', //Single page
    'post', //Single post
    'search' //Search page
];

//Init the template object
let template = {};

//Compile all template files
_files.forEach(_file => {
    fs.readFile('dist/' + _file + '.html', 'utf8',
        function(err, data) {
            if (err) {
                console.log(err)
            } else {
                template[_file] = handlebars.compile(data);
            }
        });
})

module.exports = template