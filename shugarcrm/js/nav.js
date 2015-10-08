var Tree = (function () {
    function Tree() {
        this.data = null;
        this.status = 'closed';
        this.origin = '';
    }

    Tree.prototype.setData = function (tree) {
        this.data = tree;
        this.data.href = '/';  // root must be /
    };
    Tree.prototype.getParent = function (str) {
        var parts = str.split('/');
        var s = parts.pop();
        return parts.join('/');
    };
    Tree.prototype.getSelf = function (str) {
        return str.split('/').pop();
    };
    Tree.prototype.init = function (location) {
        var href = "root";
        var search = this.getId(href);
        var root = document.querySelector('#tree-navigation-content .widget-body');
        root.innerHTML = "";
        var ul = document.createElement('ul');
        ul.setAttribute('id', search);
        ul.childNodes = [];

        this.addChildren(ul, location, this.data);
        root.appendChild(ul);
    };
    Tree.prototype.addChildren = function (el, location, obj) {
        if (el && typeof el.childNodes !== 'undefined' && el.childNodes.length == 0){
            var children = obj.children || [];
            var clean = this.cleanLower(location);
            if (typeof obj.sort !== 'undefined') {
                if (obj.sort == 'a') {
                    // sort alpha
                    children.sort(function (a, b) {
                        if (a.href > b.href) return 1;
                        if (a.href < b.href) return -1;
                        return 0;
                    });
                }
                if (obj.sort == 'm') {
                    // sort order
                    children.sort(function (a, b) {
                        if (parseInt(a.order) > parseInt(b.order)) return 1;
                        if (parseInt(a.order) < parseInt(b.order)) return -1;
                        return 0;
                    });
                }
            }
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                var found = this.find(child, clean);
                if (found) {
                    this.status = 'open';
                    if (this.match(child, clean)) {
                        child = this.bold(child);
                    }
                    if (this.isChild(child, clean)) {
                        var c = this.append(el, child);
                        var ul = c.childNodes[2];
                        this.addChildren(ul, location, child);
                    }
                    else {
                        el = this.append(el, child);
                    }
                }
                else this.append(el, child);
            }
        }
    };
    Tree.prototype.bold = function (obj) {
        obj.name = "<b>" + obj.name + "</b>";
        return obj;
    };
    Tree.prototype.append = function (el, obj) {
        return el.appendChild(this.li(obj));
    };
    Tree.prototype.setHover = function () {
        $('#ul_root li a').hover(
            function(el){
                $('.link-del-hover').remove();
                var it = $(this);
                var p = it.offset();
                var t = it.clone();
                t.css({
                    'top': p.top,
                    'left': p.left
                });
                t.addClass('link-del-hover');
                t.has('b').addClass('page');
                t.hover(
                    function(){},
                    function(e){
                        $('.link-del-hover').remove();
                    }
                );
                $('body').append(t);
            },
            function(){}
        );
    };
    Tree.prototype.open = function (location) {
        var _id = "ul_" + this.cleanName(location);
        var ul = (_id.charAt(0) == '#') ? _id.substr(1, _id.length - 1) : _id;
        id = this.cleanLower(ul.substr(3, ul.length - 1)); // remove ul_
        id = (id.charAt(id.length - 1) == "_") ? id.substr(0, id.length - 1) : id;

        var found = this.find(this.data, id);
        if (found) {
            var ul = document.getElementById(ul);

            var chevron = ul.parentNode.firstChild;
            var down = "glyphicon-chevron-down";
            var right = "glyphicon-chevron-right";

            if (chevron.className.indexOf(down) >= 0) {
                chevron.className = chevron.className.replace(down, right);
            }
            else if (chevron.className.indexOf(right) >= 0) {
                chevron.className = chevron.className.replace(right, down);
            }
            this.addChildren(ul, location, found);
        }  // else report error...

        //this.setHover();
    };
    Tree.prototype.getPath = function (obj) {
        var path = this.cleanLower(obj.href);
        if (path.charAt(path.length - 1) == "_") path = path.substr(0, path.length - 1);
        return path;
    };
    Tree.prototype.isChild = function (obj, location) {
        var path = this.getPath(obj);
        return location.indexOf(path) >= 0;
    };
    Tree.prototype.match = function (obj, location) {
        var path = this.getPath(obj);
        return location == path;
    };
    Tree.prototype.find = function (obj, location) {
        // if matched, return it
        if (this.match(obj, location)) {
            return obj;
        }
        else if (this.isChild(obj, location) && typeof obj.children !== 'undefined') {
            var children = obj.children;
            for (var i = 0; i < children.length; i++) {
                var found = this.find(children[i], location);
                if (found) {
                    return found;
                }
            }
        }

        return false;
    };
    Tree.prototype.ul = function (id, status) {
        status = (status == 'down' || this.status == 'open') ? "in active" : "";
        var ul = document.createElement('ul');
        ul.setAttribute('class', 'collapse ' + status);
        ul.setAttribute('id', this.getId(id));
        return ul;
    };
    Tree.prototype.li = function (item) {
        var href = this.cleanName(item.href);
        var li = document.createElement('li');
        li.setAttribute('id', href);
        if (typeof item.children !== 'undefined' && item.children.length > 0) {
            li.setAttribute('class', 'hasChildren');
            this.getTitleHtml(li, item);
        }
        else {
            var a = document.createElement('a');
            a.setAttribute('href', NavTree.origin + item.href);
            a.innerHTML = item.name;
            li.appendChild(a);
        }
        return li;
    };
    Tree.prototype.getId = function (id) {
        return "ul_" + this.cleanName(id);
    };
    Tree.prototype.cleanName = function (name) {
        return name.replace(/[^a-z0-9_]/g, function (s) {
            var c = s.charCodeAt(0);
            // number
            if (c > 47 && c < 58) return s.toLowerCase();
            // uppercase letter
            if (c > 64 && c < 91) return s.toLowerCase();
            // lowercase letter
            if (c > 96 && c < 123) return s;
            return '_';
        });
    };
    Tree.prototype.cleanLower = function (name) {
        return this.cleanName(name).toLowerCase();
    };
    Tree.prototype.getTitleHtml = function (li, item) {
        var status;
        if (this.status == 'open') {
            status = 'down';
            this.status = 'closed';
        }
        else status = 'right';
        var root = this.cleanName(item.href);
        var ulid = this.getId(root);
        var span = document.createElement('span');
        span.setAttribute('class', 'glyphicon glyphicon-chevron-' + status + ' pointer');
        span.setAttribute('data-toggle', 'collapse');
        span.setAttribute('href', '#' + ulid);
        span.setAttribute('onclick', "javascript:NavTree.open('" + item.href + "');");

        var a = document.createElement('a');
        a.setAttribute('href', NavTree.origin + item.href);
        a.innerHTML = item.name;

        var ul = this.ul(root, status);

        li.appendChild(span);
        li.appendChild(a);
        li.appendChild(ul);
    };

    return Tree;
})();

NavTree = new Tree();

(function () {
    $(document).ready(function () {
        // Add to widgets
        var widgets = document.getElementById('navmenu');

        var getUrl = function (url) {
            var URL = url.replace("http://", "").replace("https://", "");
            URL = URL.substr(URL.search(/\//), 1000);
            // disregard hash
            URL = (URL.lastIndexOf("#") > 0) ? URL.substr(0, URL.lastIndexOf("#")) : URL;
            // remove index.html
            URL = URL.replace('index.html', '');
            // remove trailing slash
            URL = (URL.slice(-1) === "/") ? URL.substr(0, URL.length - 1) : URL;
            // remove leading /.*/cache/preview/, etc directories
            var reg = /^\/*(\S+)\/cache\/preview\/support\.sugarcrm\.com/g;
            var loc = reg.exec(URL);
            if (loc) {
                NavTree.origin = loc[0];
                return URL.replace(loc[0], '');
            }
            return URL;
        };

        if (widgets) {
            var nav = document.createElement('div');
            nav.setAttribute('id', 'tree-navigation');
            nav.innerHTML = '' + '<div class="widget" id="tree-navigation-content">' +
            '    <div class="widget-body">' +
            '        <p>Loading...</p>' +
            '    </div>' +
            '</div>';
            widgets.insertBefore(nav, widgets.firstChild);

            var root = getUrl(window.location.href);
            NavTree.setData(tree);
            var content = document.querySelector('#tree-navigation-content .widget-body');
            NavTree.init(root);
            //NavTree.setHover();

            // query sitemap.js
            /*$.ajax({
                url: '/assets/js/scripts/sitemap.js',
                dataType: "jsonp",
                jsonp: false,
                jsonpCallback: 'sitemap'
            }).done(function (tree) {
                var root = getUrl(window.location.href);
                NavTree.setData(tree);
                var content = document.querySelector('#tree-navigation-content .widget-body');
                NavTree.init(root);
                NavTree.setHover();
            });*/
        }
    });
})();