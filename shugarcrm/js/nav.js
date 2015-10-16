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
    Tree.prototype.getData = function () {
        return this.data;        
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
        ul.setAttribute('class', 'nav');
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
    Tree.prototype.findKey = function(keyObj, data){
        var p, key, val, tRet;
        for (p in keyObj) {
            if (keyObj.hasOwnProperty(p)) {
                key = p;
                val = keyObj[p];
            }
        }

        if (data[key] == val) {
            return data;
        } else if (data.hasOwnProperty("children")) {
            var children = data.children;
            for (var i = 0; i < children.length; i++) {
                var found = this.findKey(keyObj, children[i]);
                if (found) {
                    return found;
                }
            }
        }
    };
    Tree.prototype.addToc = function(data, path, tocChildren){
        if (data["href"] == path){
            data.children = tocChildren;
        }else if(data.hasOwnProperty("children")) {
            var children = data.children;
            for (var i = 0; i < children.length; i++) {
                this.addToc(children[i], path, tocChildren);
            }
        }
    };
    Tree.prototype.createSiblingList = function(children, title){
        var div = document.createElement('div'); 
        var span = document.createElement('p');
        span.setAttribute('class', 'title');
        span.setAttribute('onClick', 'NavTree.showSiblings()');
        span.setAttribute('data-toggle', 'collapse');
        span.setAttribute('data-target', '#sibling');
        div.appendChild(span);
        var ul = document.createElement('ul');
        ul.setAttribute('class', 'collapse');
        div.appendChild(ul);
        ul.setAttribute('id','sibling')
        for(var i=0; i<children.length; i++){
            var a = document.createElement('a');            
            a.innerHTML = children[i].name;
            if(children[i].name == title){
                a.setAttribute('class', 'title');
                span.appendChild(a);
                // li.setAttribute('class', 'title');
                a.setAttribute('data-toggle', 'collapse');
                a.setAttribute('data-target', '#sibling');
                
            }else{
                var li = document.createElement('li');
                a.setAttribute('href', children[i].href);
                li.setAttribute('aria-expanded', false);
                li.appendChild(a);
                ul.appendChild(li);
            }
            
        }
        return div;
    };
    Tree.prototype.showSiblings = function(){
        $('#tree-title p').toggleClass("open");
        $('#tree-title').toggleClass("open");
    };
    Tree.prototype.getPathUntilDepth = function(path, depth){
        var result = "";
        var i = 0;
        while(path[i] != undefined && path[i].length > 0){
            result += "/" + path[i];
            i++;
            if(i == depth)
                break;
        }
        return result;
    };
    Tree.prototype.getHeaderTags = function(){
        var order = 0;
        var tags = [];
        $('.content-body h2').each(function() {
            var node = { 
                children : [],
                href : "#" + $(this).attr('id'), 
                name : $(this).text(),
                order: order,
                sort : "m"
            };
            order++;
            tags.push(node);
        });
        return tags;
    };
    Tree.prototype.setTreeTitle = function(title){

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
            '    <div class="widget-body" id="toc-body">' +
            '        <p>Loading...</p>' +
            '    </div>' +
            '</div>';
            widgets.insertBefore(nav, widgets.firstChild);


            //Add page title widget
            var navTitle = document.createElement('div');
            navTitle.setAttribute('id', 'tree-title');
            // navTitle.setAttribute('class', 'strong');
            // navTitle.innerHTML = "Page title";
            widgets.insertBefore(navTitle, widgets.firstChild);    

            // var root = getUrl(window.location.href);
            // NavTree.setData(tree);
            // var content = document.querySelector('#tree-navigation-content .widget-body');
            // NavTree.init(root);
            //NavTree.setHover();

            // query sitemap.js
            $.ajax({
                // url: '/assets/js/scripts/sitemap.js',
                url: 'http://support.sugarcrm.com/assets/js/scripts/sitemap.js',
                dataType: "jsonp",
                jsonp: false,
                jsonpCallback: 'sitemap'
            }).done(function (tree) {

                var url = getUrl(window.location.href);
                var path = url.replace(/^https?:\/\/[^\/]+\//i, "").replace(/\/$/, "");
                if(path.indexOf("/") == 0)
                    path = path.substring(1);
                var pathArr = path.split("/");

                var searchPath = "";
                // https://support.sugarcrm.com/Documentation/Sugar_Versions/7.6/Ent/Application_Guide/Getting_Started
                if(pathArr[0] == "Get Started"){

                }else if(pathArr[0] == "Documentation"){
                    if(pathArr[1] == "Sugar_Versions"){
                        searchPath = NavTree.getPathUntilDepth(pathArr, 5);
                    }else if(pathArr[1] == "Mobile_Solutions"){

                    }else if(pathArr[1] == "Plug_ins"){

                    }else if(pathArr[1] == "Installable_Connectors"){

                    }else if(pathArr[1] == "Sugar_Developer"){

                    }
                }else if(pathArr[0] == "Knowledge_Base"){

                }

                if(window.location.href.indexOf("http")>-1)
                    searchPath = "/"+path;
                else
                    searchPath = "";

                var treeData = tree;
                //This will go into the Tree if on live site
                // if(treeData == null)
                    // treeData = NavTree.getData();
                
                var branch = NavTree.findKey({ "href" : searchPath }, treeData);

                //Get top-level sibling nodes
                var searchPathParent = searchPath.substring(0, searchPath.lastIndexOf("/"));
                var branchParent = NavTree.findKey({ "href" : searchPathParent }, treeData);
                var siblingList = NavTree.createSiblingList(branchParent.children, branch.name);

                
                if(branch){
                    NavTree.addToc(branch, "/"+path, NavTree.getHeaderTags());
                    // NavTree.setTreeTitle(branch.name);
                    NavTree.setData(branch);
                    var content = document.querySelector('#tree-navigation-content .widget-body');
                    NavTree.init(url);
                    NavTree.setHover();

                    $('#tree-title').html("");
                    $('#tree-title').append(siblingList);

                    $('body').scrollspy({ target: '#toc-body' });
                    $('[data-spy="scroll"]').each(function () {
                      var $spy = $(this).scrollspy('refresh')
                    })
                }


                // var root = getUrl(window.location.href);
                // NavTree.setData(tree);
                // var content = document.querySelector('#tree-navigation-content .widget-body');
                // NavTree.init(root);
                // NavTree.setHover();
            });
        }
    });
})();