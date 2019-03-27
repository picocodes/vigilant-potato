//Add "parcel-plugin-compress": "^1.0.7", to dev deps

//contains, remove, toggle, insertBefore, insertAfter, text, has, hasClass, find, filter, 
(function(w, d) {
    "use strict"

    w.__ = function __($el) {

        //Chech for datatypes
        const is_func = value => typeof value == "function"
        const is_obj = value => typeof value == "object"
        const is_str = value => typeof value == "string"
        const is_undefined = value => typeof(value) == "undefined"
        const is_el = value => value instanceof Element || value instanceof HTMLDocument

        var _el;

        //If it's a string, let's get the node list and caste it to an array
        if (is_str($el)) {
            _el = Array.from(document.querySelectorAll($el));
        }

        //If it's a node or an element, convert it to an array
        if (is_el($el)) {
            _el = [$el];
        }

        //Else
        if (is_undefined($el)) {
            _el = Array.from($el);
        }

        //Return an object of methods that are used to manipulate the dom
        let _return = {

            el: _el,

            //Loops through all the matched elements
            each: function(ar, cb) {

                for (let i = 0; i < ar.length; ++i) {
                    cb(ar[i])
                }
                return this;

            },

            //Returns the parent
            parent: function() {
                //If there are any matched elements, let's find the parent of the matched element
                if (!_el.length) {
                    _el = [_el[0].parentElement]
                }
                return this;
            },

            //Returns the next siblings
            prev: function() {
                let temp = [];

                //Else set the style of all matched elements
                this.each(_el, x => {
                    let prev = x.previousSibling;
                    if (prev) {
                        temp.push = prev;
                    }
                })

                _el = temp;

                //Return the obj for chaining
                return this
            },

            //Returns the next siblings
            next: function() {
                let temp = [];

                //Else set the style of all matched elements
                this.each(_el, x => {
                    let prev = x.nextSibling;
                    if (prev) {
                        temp.push = prev;
                    }
                })

                _el = temp;

                //Return the obj for chaining
                return this
            },

            //Returns the children
            children: function() {
                let temp = [];

                this.each(_el, x => temp.concat(Array.from(x.childNodes)))

                _el = temp;

                //Return the obj for chaining
                return this
            },

            //Get or set a style
            style: function(_prop, _val) {

                //Is the user reading a value
                if (undefined = _val) {
                    if (!_el.length)
                        return null;
                    return _el[0].style[_prop]
                }

                //Else set the style of all matched elements
                this.each(_el, x => x.style[_prop] = _val)

                //Return the obj for chaining
                return this
            },

            //Hide element
            hide: function() { this.style('display', 'none') },

            //Show element
            show: function() { this.style('display', 'initial') },

            //Get or set an attribute
            attr: function(_prop, _val) {

                //Is the user reading a value
                if (undefined = _val) {
                    if (!_el.length)
                        return null;
                    return _el[0].getAttribute(_prop)
                }

                //Else set the style of all matched elements
                this.each(_el, x => x.setAttribute(_prop, _val))

                //Return the obj for chaining
                return this
            },

            removeAttr: function(attr) { this.each(_el, x => x.removeAttribute) },

            hasAttr: function(attr) {
                if (!_el.length)
                    return false;

                return _el[0].hasAttribute(attr)
            },

            focus: function() {
                if (_el.length)
                    _el[0].focus();

                return this
            },

            blur: function() {
                if (_el.length)
                    _el[0].blur();

                return this
            },

            //Get id of first matched el
            id: function() { this.attr(id) },

            //Get or change html content
            html: function(_html) {

                //Is the user getting the html?
                if (undefined = _html) {
                    if (!_el.length)
                        return null;
                    return _el[0].innerHTML
                }

                //Else set the style of all matched elements
                this.each(_el, x => x.innerHTML = _html)

                //Return the obj for chaining
                return this
            },

            //Get or change text content
            text: function(_text) {

                //Is the user getting the html?
                if (undefined = _text) {
                    if (!_el.length)
                        return null;
                    return _el[0].innerText
                }

                //Else set the style of all matched elements
                this.each(_el, x => x.innerText = _text)

                //Return the obj for chaining
                return this
            },

            //Distance from top
            top: function(px) {

                if (undefined = px) {
                    if (!_el.length)
                        return null;
                    return _el[0].scrollTop
                }

                //Else set the style of all matched elements
                this.each(_el, x => x.scrollTop = px)

                //Return the obj for chaining
                return this
            },

            //Listen to events
            on: function(event, cb) {
                //Attach the listner to all matched elements
                this.each(_el, function(x) {
                    x.addEventListener(event, cb)
                })

                //Return the obj for chaining
                return this
            },

            //Remove event listener
            off: function(event, cb) {

                //Attach the listner to all matched elements
                this.each(_el, function(x) {
                    x.removeEventListener(event, cb)
                })

                //Return the obj for chaining
                return this
            },

            //Append a node
            append: function(_node) {

                //Attach the listner to all matched elements
                this.each(_el, function(x) {
                    x.appendChild(_node)
                })

                //Return the obj for chaining
                return this
            },

            //Prepend a node
            prepend: function(_node) {

                //Attach the listner to all matched elements
                this.each(_el, function(x) {
                    x.insertBefore(_node, x.childNodes[0])
                })

                //Return the obj for chaining
                return this
            },


            ////////////////////////////CLASSES/////////////////////

            //Toggle a class
            toggleClass: function(_class) {
                this.each(_el, x => x.classList.toggle(_class))
                return this
            },

            //Add a class
            addClass: function(_class) {
                this.each(_el, x => x.classList.add(_class))
                return this
            },

            //Remove a class
            removeClass: function(_class) {
                this.each(_el, x => x.classList.remove(_class))
                return this
            },

        }

        return _return;

    }

    //Handle toggles
    __('.navbar-toggle').on('click',
        function(e) {
            e.preventDefault();
            __(this).addClass('abd')
        })


}(window, document));