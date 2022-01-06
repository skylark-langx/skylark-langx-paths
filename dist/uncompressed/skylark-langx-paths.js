/**
 * skylark-langx-paths - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
(function(factory,globals) {
  var define = globals.define,
      require = globals.require,
      isAmd = (typeof define === 'function' && define.amd),
      isCmd = (!isAmd && typeof exports !== 'undefined');

  if (!isAmd && !define) {
    var map = {};
    function absolute(relative, base) {
        if (relative[0]!==".") {
          return relative;
        }
        var stack = base.split("/"),
            parts = relative.split("/");
        stack.pop(); 
        for (var i=0; i<parts.length; i++) {
            if (parts[i] == ".")
                continue;
            if (parts[i] == "..")
                stack.pop();
            else
                stack.push(parts[i]);
        }
        return stack.join("/");
    }
    define = globals.define = function(id, deps, factory) {
        if (typeof factory == 'function') {
            map[id] = {
                factory: factory,
                deps: deps.map(function(dep){
                  return absolute(dep,id);
                }),
                resolved: false,
                exports: null
            };
            require(id);
        } else {
            map[id] = {
                factory : null,
                resolved : true,
                exports : factory
            };
        }
    };
    require = globals.require = function(id) {
        if (!map.hasOwnProperty(id)) {
            throw new Error('Module ' + id + ' has not been defined');
        }
        var module = map[id];
        if (!module.resolved) {
            var args = [];

            module.deps.forEach(function(dep){
                args.push(require(dep));
            })

            module.exports = module.factory.apply(globals, args) || null;
            module.resolved = true;
        }
        return module.exports;
    };
  }
  
  if (!define) {
     throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");
  }

  factory(define,require);

  if (!isAmd) {
    var skylarkjs = require("skylark-langx-ns");

    if (isCmd) {
      module.exports = skylarkjs;
    } else {
      globals.skylarkjs  = skylarkjs;
    }
  }

})(function(define,require) {

define('skylark-langx-paths/paths',[
	"skylark-langx-ns"
],function(skylark){
	var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;

	function posixSplitPath(filename) {
	    var out = splitPathRe.exec(filename);
	    out.shift();
	    return out;
	}
	/**
	 * Emulates Node's `path` module. This module contains utilities for handling and
	 * transforming file paths. **All** of these methods perform only string
	 * transformations. The file system is not consulted to check whether paths are
	 * valid.
	 * @see http://nodejs.org/api/path.html
	 * @class
	 */
	var paths = {};


    /**
     * Unknown. Undocumented.
     */
    paths._makeLong = function (p) {
        return p;
    };


    paths._removeDuplicateSeps = function (p) {
        p = p.replace(this._replaceRegex, this.sep);
        return p;
    };

    // The platform-specific file separator. BrowserFS uses `/`.
    paths.sep = '/';
    paths._replaceRegex = new RegExp("//+", 'g');
    // The platform-specific path delimiter. BrowserFS uses `:`.
    paths.delimiter = ':';
    paths.posix = paths;
    // XXX: Typing hack. We don't actually support win32.
    paths.win32 = paths;


	return skylark.attach("langx.paths",paths);
});
define('skylark-langx-paths/normalize',[
	"./paths"
],function(paths){
    /**
     * Normalize a string path, taking care of '..' and '.' parts.
     *
     * When multiple slashes are found, they're replaced by a single one; when the path contains a trailing slash, it is preserved. On Windows backslashes are used.
     * @example Usage example
     *   paths.normalize('/foo/bar//baz/asdf/quux/..')
     *   // returns
     *   '/foo/bar/baz/asdf'
     * @param [String] p The path to normalize.
     * @return [String]
     */
     function normalize(p) {
        // Special case: '' -> '.'
        if (p === '') {
            p = '.';
        }
        // It's very important to know if the path is relative or not, since it
        // changes how we process .. and reconstruct the split string.
        var absolute = p.charAt(0) === paths.sep;
        // Remove repeated //s
        p = paths._removeDuplicateSeps(p);
        // Try to remove as many '../' as possible, and remove '.' completely.
        var components = p.split(paths.sep);
        var goodComponents = [];
        for (var idx = 0; idx < components.length; idx++) {
            var c = components[idx];
            if (c === '.') {
                continue;
            }
            else if (c === '..' && (absolute || (!absolute && goodComponents.length > 0 && goodComponents[0] !== '..'))) {
                // In the absolute case: Path is relative to root, so we may pop even if
                // goodComponents is empty (e.g. /../ => /)
                // In the relative case: We're getting rid of a directory that preceded
                // it (e.g. /foo/../bar -> /bar)
                goodComponents.pop();
            }
            else {
                goodComponents.push(c);
            }
        }
        // Add in '.' when it's a relative path with no other nonempty components.
        // Possible results: '.' and './' (input: [''] or [])
        // @todo Can probably simplify this logic.
        if (!absolute && goodComponents.length < 2) {
            switch (goodComponents.length) {
                case 1:
                    if (goodComponents[0] === '') {
                        goodComponents.unshift('.');
                    }
                    break;
                default:
                    goodComponents.push('.');
            }
        }
        p = goodComponents.join(paths.sep);
        if (absolute && p.charAt(0) !== paths.sep) {
            p = paths.sep + p;
        }
        return p;
    }

    return paths.normalize = normalize;
});
define('skylark-langx-paths/basename',[
	"./paths",
    "./normalize"
],function(paths,normalize){
    /**
     * Return the last portion of a path. Similar to the Unix basename command.
     * @example Usage example
     *   paths.basename('/foo/bar/baz/asdf/quux.html')
     *   // returns
     *   'quux.html'
     *
     *   paths.basename('/foo/bar/baz/asdf/quux.html', '.html')
     *   // returns
     *   'quux'
     * @param [String] p
     * @param [String?] ext
     * @return [String]
     */
    function basename(p, ext) {
        if (ext === void 0) { ext = ""; }
        // Special case: Normalize will modify this to '.'
        if (p === '') {
            return p;
        }
        // Normalize the string first to remove any weirdness.
        p = normalize(p);
        // Get the last part of the string.
        var sections = p.split(paths.sep);
        var lastPart = sections[sections.length - 1];
        // Special case: If it's empty, then we have a string like so: foo/
        // Meaning, 'foo' is guaranteed to be a directory.
        if (lastPart === '' && sections.length > 1) {
            return sections[sections.length - 2];
        }
        // Remove the extension, if need be.
        if (ext.length > 0) {
            var lastPartExt = lastPart.substr(lastPart.length - ext.length);
            if (lastPartExt === ext) {
                return lastPart.substr(0, lastPart.length - ext.length);
            }
        }
        return lastPart;
    }

    return paths.basename = basename;
});
define('skylark-langx-paths/dirname',[
	"./paths"
],function(paths){
    /**
     * Return the directory name of a path. Similar to the Unix `dirname` command.
     *
     * Note that BrowserFS does not validate if the path is actually a valid
     * directory.
     * @example Usage example
     *   paths.dirname('/foo/bar/baz/asdf/quux')
     *   // returns
     *   '/foo/bar/baz/asdf'
     * @param [String] p The path to get the directory name of.
     * @return [String]
     */
    function dirname(p) {
        // We get rid of //, but we don't modify anything else (e.g. any extraneous .
        // and ../ are kept intact)
        p = paths._removeDuplicateSeps(p);
        var absolute = p.charAt(0) === paths.sep;
        var sections = p.split(paths.sep);
        // Do 1 if it's /foo/bar, 2 if it's /foo/bar/
        if (sections.pop() === '' && sections.length > 0) {
            sections.pop();
        }
        // # of sections needs to be > 1 if absolute, since the first section is '' for '/'.
        // If not absolute, the first section is the first part of the path, and is OK
        // to return.
        if (sections.length > 1 || (sections.length === 1 && !absolute)) {
            return sections.join(paths.sep);
        }
        else if (absolute) {
            return paths.sep;
        }
        else {
            return '.';
        }
    }

    return paths.dirname = dirname;
});
define('skylark-langx-paths/extname',[
	"./paths",
    "./normalize"
],function(paths,normalize){
    /**
     * Return the extension of the path, from the last '.' to end of string in the
     * last portion of the path. If there is no '.' in the last portion of the path
     * or the first character of it is '.', then it returns an empty string.
     * @example Usage example
     *   paths.extname('index.html')
     *   // returns
     *   '.html'
     *
     *   paths.extname('index.')
     *   // returns
     *   '.'
     *
     *   paths.extname('index')
     *   // returns
     *   ''
     * @param [String] p
     * @return [String]
     */
    function extname(p) {
        p = normalize(p);
        var sections = p.split(paths.sep);
        p = sections.pop();
        // Special case: foo/file.ext/ should return '.ext'
        if (p === '' && sections.length > 0) {
            p = sections.pop();
        }
        if (p === '..') {
            return '';
        }
        var i = p.lastIndexOf('.');
        if (i === -1 || i === 0) {
            return '';
        }
        return p.substr(i);
    }

    return paths.extname = extname;
});
define('skylark-langx-paths/format',[
	"./paths"
],function(paths){
    function format(pathObject) {
        if (pathObject === null || typeof pathObject !== 'object') {
            throw new TypeError("Parameter 'pathObject' must be an object, not " + typeof pathObject);
        }
        var root = pathObject.root || '';
        if (typeof root !== 'string') {
            throw new TypeError("'pathObject.root' must be a string or undefined, not " +
                typeof pathObject.root);
        }
        var dir = pathObject.dir ? pathObject.dir + paths.sep : '';
        var base = pathObject.base || '';
        return dir + base;
    }

    return paths.format = format;
});
define('skylark-langx-paths/is-absolute',[
	"./paths"
],function(paths){

    /**
     * Checks if the given path is an absolute path.
     *
     * Despite not being documented, this is a tested part of Node's path API.
     * @param [String] p
     * @return [Boolean] True if the path appears to be an absolute path.
     */
    function isAbsolute(p) {
        return p.length > 0 && p.charAt(0) === paths.sep;
    }

    return paths.isAbsolute = isAbsolute;

});
define('skylark-langx-paths/join',[
	"./paths",
    "./normalize"
],function(paths,normalize){
    /**
     * Join all arguments together and normalize the resulting path.
     *
     * Arguments must be strings.
     * @example Usage
     *   paths.join('/foo', 'bar', 'baz/asdf', 'quux', '..')
     *   // returns
     *   '/foo/bar/baz/asdf'
     *
     *   paths.join('foo', {}, 'bar')
     *   // throws exception
     *   TypeError: Arguments to paths.join must be strings
     * @param [String,...] segs Each component of the path
     * @return [String]
     */
    function join() {
        var segs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            segs[_i - 0] = arguments[_i];
        }
        // Required: Prune any non-strings from the path. I also prune empty segments
        // so we can do a simple join of the array.
        var processed = [];
        for (var i = 0; i < segs.length; i++) {
            var segment = segs[i];
            if (typeof segment !== 'string') {
                throw new TypeError("Invalid argument type to segs.join: " + (typeof segment));
            }
            else if (segment !== '') {
                processed.push(segment);
            }
        }
        return normalize(processed.join(paths.sep));
    }

    return paths.join = join;
});
define('skylark-langx-paths/path',[
    "skylark-langx-types",
    "skylark-langx-constructs",
    "./paths"
], function(types,constructs,paths) {

    /**
     * @class Path
     * @constructor
     */
    var Path =   constructs.klass({
        _construct : function() {
            var _ = this._ = {
                segments : null,
                hasLeading : false,
                hasTrailing : false
            };
            if (arguments.length == 1 && types.isString(arguments[0])) {
                  this._parse(arguments[0]);
            } else  if (types.isArray(arguments[0])){
                _.segments = arguments[0];
                _.hasLeading = arguments[1] || false;
                _.hasTrailing = arguments[2] || false;
                this._canonicalize();                
            }
        },

        _canonicalize: function() {
            var doIt;
            var segments = this._.segments;
            for (var i = 0; i < segments.length; i++) {
                if (segments[i] == "." || segments[i] == "..") {
                    doIt = true;
                    break;
                }
            }
            if (doIt) {
                var stack = [];
                for (var i = 0; i < segments.length; i++) {
                    if (segments[i] == "..") {
                        if (stack.length == 0) {
                            // if the stack is empty we are going out of our scope
                            // so we need to accumulate segments.  But only if the original
                            // path is relative.  If it is absolute then we can't go any higher than
                            // root so simply toss the .. references.
                            if (!this.hasLeading) {
                                stack.push(segments[i]); //stack push
                            }
                        } else {
                            // if the top is '..' then we are accumulating segments so don't pop
                            if (".." == stack[stack.length - 1]) {
                                stack.push("..");
                            } else {
                                stack.pop();
                            }
                        }
                        //collapse current references
                    } else if (segments[i] != "." || segments.length == 1) {
                        stack.push(segments[i]); //stack push
                    }
                }
                //if the number of segments hasn't changed, then no modification needed
                if (stack.length == segments.length) {
                    return;
                }
                this._.segments = stack;
            }
        },

        _length: function(anotherPath) {
            return this._.segments.length;
        },


        _parse : function( /*String*/ path) {
            if (!path) {
                path = ".";
            }
            var _ = this._,
                segments = path.split("/");

            if (path.charAt(0) == "/") {
                _.hasLeading = true;
                segments.shift();
            }
            if (path.charAt(path.length - 1) == "/") {
                _.hasTrailing = true;
                // If the path ends in '/', split() will create an array whose last element
                // is an empty string. Remove that here.
                segments.pop();
            }
            _.segments = segments;
            _.path = path;

            this._canonicalize()
        },

        /*
         *
         *@method append
         *@parameter {Path|String}tail
         *@return {Path}
         */
        append: /*Path*/ function( /*Path*/ tail) {
            if (types.isString(tail)) {
                return this.appendPathStr(tail);
            } else {
                return this.appendPath(tail);
            }
        },

        /*
         *
         *@method appendPath
         *@parameter {Path}tail
         *@return {Path}
         */
        appendPath: /*Path*/ function( /*Path*/ tail) {
            if (tail.isAbsolute()) {
                return tail;
            }
            var mySegments = this.segments,
                tailSegments = tail.segments,
                newSegments = mySegments.concat(tailSegments),
                result = new Path(newSegments, this.hasLeading, tail.hasTrailing);
            return result;
        },

        /*
         *
         *@method appendPathStr
         *@parameter {String}tail
         *@return {Path}
         */
        appendPathStr: function( /*String*/ tail) {
            tail = new Path(tail || "");
            return this.appendPath(tail);
        },

        /*
         *
         *@method clone
         *@return {Path}
         */
        "clone": function() {
            return new Path(this.segments, this.hasLeading, this.hasTrailing);
        },

        /*
         *Tests if this path ends with the given path.
         *@method endsWidth
         *@parameter {String}tail
         *@return {Boolean}
         */
        "endsWith": /*Boolean*/ function( /*String*/ tail) {
            var segments = this.segments;
            var tailSegments = (new Path(tail)).segments;
            while (tailSegments.length > 0 && segments.length > 0) {
                if (tailSegments.pop() != segments.pop()) {
                    return false;
                }
            }
            return true;
        },

        /*
         *Tests this path for equality with the given object.
         *@method equals
         *@parameter {Path}another
         *@return {Boolean}
         */
        "equals": /*Boolean*/ function( /*Path*/ another) {
            var segments = this._.segments,
                anotherSegments = another._.segments;
            if (segments.length != anotherSegments.length) {
                return false;
            }
            for (var i = 0; i < segments.length; i++) {
                if (anotherSegments[i] != segments[i]) {
                    return false;
                };
            }
            return true;
        },

        /*
         *
         *@method firstSegment
         *@parameter {Number}length
         *@return {String}
         */
        firstSegment: /*String*/ function( /*Number*/ length) {
            var segments = this._.segments;
            return segments[length || 0];
        },

        /*
         *
         *@method getExtension
         *@return {String}
         */
        getExtension: function() {
            var extension = this._.extension,
                path = this._.path;
            if (!textension) {
                extension = this._.extension = path.substr(path.lastIndexOf('.') + 1);
            }
            return extension;
        },

        /*
         *
         *@method getSegments
         *@return {Array}
         */
        getSegments: /*Array*/ function() {
            return this.segments;
        },

        /*
         *Returns the parent path, or null if this path does not have a parent.
         *@method getParentPath
         *@return {Path}
         */
        getParentPath: /*Path*/ function() {
            var parentPath = this._.parentPath;
            if (!parentPath) {
                var parentSegments = this.segments;
                parentSegments.pop();
                parentPath = this._.parentPath = new Path(parentSegments, this.hasLeading);
            }
            return parentPath;
        },


        /*
         *Returns the root component of this path as a Path object, or null if this path does not have a root component.
         *@method getRoot
         *@return {Path}
         */
        "getRoot": /*Path*/ function() {
            //TODO: will be implemented
        },

        /*
         *Tells whether or not this path is absolute.
         *@method isAbsolute
         *@return {Boolean}
         */
        isAbsolute: /*Boolean*/ function() {
            return this.hasLeading;
        },


        /*
         *
         *@method lastSegment
         *@ return {String}
         */
        lastSegment: /*String*/ function() {
            var segments = this._.segments;
            return segments[segments.length - 1];
        },

        /*
         *
         *@method matchingFirstSegments
         *@parameter {Path}another
         *@return {Number}
         */
        matchingFirstSegments: /*Number*/ function( /*Path*/ another) {
            var mySegments = this.segments;
            var pathSegments = another.segments;
            var max = Math.min(mySegments.length, pathSegments.length);
            var count = 0;
            for (var i = 0; i < max; i++) {
                if (mySegments[i] != pathSegments[i]) {
                    return count;
                }
                count++;
            }
            return count;
        },

        /*
         *Returns a path that is this path with redundant name elements eliminated.
         *@method normalize
         *@return {Path}
         */
        "normalize": /*Path*/ function() {
            //TODO: will be implemented
        },


        /*
         *
         *@method removeFirstSegments
         *@parameter {Number}count
         *@return {Path}
         */
        removeFirstSegments: /*Path*/ function( /*Number*/ count) {
            var segments = this._.segments,
                hasLeading = this._.hasLeading;
            hasTrailing = this._.hasTrailing;

            return new Path(segments.slice(count, segments.length), hasLeading, hasTrailing);
        },

        /*
         *
         *@method removeLastSegments
         *@parameter {Number}count
         *@return {Path}
         */
        removeLastSegments: /*Path*/ function( /*Number?*/ count) {
            var segments = this._.segments,
                hasLeading = this._.hasLeading;
            hasTrailing = this._.hasTrailing;

            if (!count) {
                count = 1;
            }

            return new Path(segments.slice(0, segments.length - count), hasLeading, hasTrailing);
        },

        /*
         *
         *@method removeMatchingFirstSegments
         *@parameter {Path}another
         *@return {Path}
         */
        removeMatchingFirstSegments: /*Path*/ function( /*Path*/ another) {
            var match = this.matchingFirstSegments(another);
            return this.removeFirstSegments(match);
        },

        /*
         *
         *@method removeMatchingLastSegments
         *@parameter {Path}another
         *@return {Path}
         */
        removeMatchingLastSegments: /*Path*/ function( /*Path*/ another) {
            var match = this.matchingFirstSegments(anotherPath);
            return this.removeLastSegments(match);
        },

        /*
         *
         *@method removeRelative
         *@return {Path}
         */
        removeRelative: function() {
            var segs = this.segments;
            if (segs.length > 0 && segs[1] == ".")
                return this.removeFirstSegments(1);
            return this;
        },

        /*
         *Constructs a relative path between this path and a given path.
         *@method relativeTo
         *@parameter {Path}base
         *@return {Path}
         */
        relativeTo: /*Path*/ function( /*Path|String*/ base, /*Boolean*/ ignoreFilename) {
            if (typeof base == 'string') {
                base = new Path(base);
            }
            var mySegments = this.segments;
            if (this.isAbsolute()) {
                return this;
            }
            var baseSegments = base.segments;
            var commonLength = this.matchingFirstSegments(base);
            var baseSegmentLength = baseSegments.length;
            if (ignoreFilename) {
                baseSegmentLength = baseSegmentLength - 1;
            }
            var differenceLength = baseSegmentLength - commonLength;
            var newSegmentLength = differenceLength + mySegments.length - commonLength;
            if (newSegmentLength == 0) {
                return Path.EMPTY;
            }
            var newSegments = [];
            for (var i = 0; i < differenceLength; i++) {
                newSegments.push('..');
            }
            for (var i = commonLength; i < mySegments.length; i++) {
                newSegments.push(mySegments[i]);
            }
            return new Path(newSegments, false, this.hasTrailing);
        },

        /*
         *
         *@method segment
         *@parameter {Number}index
         *@return {String}
         */
        segment: /*String*/ function( /*Number*/ index) {
            var segments = this._.segments;
            if (segments.length < index) return null;
            return segments[index];
        },

        /*
         *
         *@method startsWith
         *@parameter {Path}index
         *@return {Boolean}
         */
        startsWith: /*Boolean*/ function( /*Path*/ another) {
            var count = this.matchingFirstSegments(another);
            return another._length() == count;
        },

        /*
         *
         *@method toString
         *@return {String}
         */
        toString: function() {
            var result = [],
                segments = this._.segments;
            if (this.hasLeading) {
                result.push("/");
            }
            for (var i = 0; i < segments.length; i++) {
                if (i > 0) {
                    result.push("/");
                }
                result.push(segments[i]);
            }
            if (this.hasTrailing) {
                result.push("/");
            }
            return result.join("");
        },

        hasLeading : {
            get : function() {
                return this._.hasLeading
            }
        },

        hasTrailing : {
            get : function() {
                return this._.hasTrailing
            }
        }

    });


    Path.EMPTY = new Path("");

    return paths.Path = Path;
});

define('skylark-langx-paths/resolve',[
    "./paths",
    "./normalize"
],function(paths,normalize){
    /**
     * Resolves to to an absolute path.
     *
     * If to isn't already absolute from arguments are prepended in right to left
     * order, until an absolute path is found. If after using all from paths still
     * no absolute path is found, the current working directory is used as well.
     * The resulting path is normalized, and trailing slashes are removed unless
     * the path gets resolved to the root directory. Non-string arguments are
     * ignored.
     *
     * Another way to think of it is as a sequence of cd commands in a shell.
     *
     *     paths.resolve('foo/bar', '/tmp/file/', '..', 'a/../subfile')
     *
     * Is similar to:
     *
     *     cd foo/bar
     *     cd /tmp/file/
     *     cd ..
     *     cd a/../subfile
     *     pwd
     *
     * The difference is that the different paths don't need to exist and may also
     * be files.
     * @example Usage example
     *   paths.resolve('/foo/bar', './baz')
     *   // returns
     *   '/foo/bar/baz'
     *
     *   paths.resolve('/foo/bar', '/tmp/file/')
     *   // returns
     *   '/tmp/file'
     *
     *   paths.resolve('wwwroot', 'static_files/png/', '../gif/image.gif')
     *   // if currently in /home/myself/node, it returns
     *   '/home/myself/node/wwwroot/static_files/gif/image.gif'
     * @param [String,...] segs
     * @return [String]
     */
    function resolve() {
        var segs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            segs[_i - 0] = arguments[_i];
        }
        // Monitor for invalid segs, throw out empty segs, and look for the *last*
        // absolute path that we see.
        var processed = [];
        for (var i = 0; i < segs.length; i++) {
            var p = segs[i];
            if (typeof p !== 'string') {
                throw new TypeError("Invalid argument type to paths.join: " + (typeof p));
            }
            else if (p !== '') {
                // Remove anything that has occurred before this absolute path, as it
                // doesn't matter.
                if (p.charAt(0) === paths.sep) {
                    processed = [];
                }
                processed.push(p);
            }
        }
        // Special: Remove trailing slash unless it's the root
        var resolved = normalize(processed.join(paths.sep));
        if (resolved.length > 1 && resolved.charAt(resolved.length - 1) === paths.sep) {
            return resolved.substr(0, resolved.length - 1);
        }
        /*
        /// 
        // Special: If it doesn't start with '/', it's relative and we need to append
        // the current directory.
        if (resolved.charAt(0) !== paths.sep) {
            // Remove ./, since we're going to append the current directory.
            if (resolved.charAt(0) === '.' && (resolved.length === 1 || resolved.charAt(1) === paths.sep)) {
                resolved = resolved.length === 1 ? '' : resolved.substr(2);
            }
            // Append the current directory, which *must* be an absolute path.
            var cwd = process.cwd();
            if (resolved !== '') {
                // cwd will never end in a /... unless it's the root.
                resolved = normalize(cwd + (cwd !== '/' ? paths.sep : '') + resolved);
            }
            else {
                resolved = cwd;
            }
        }
        */
        return resolved;
    }

    return paths.resolve = resolve;
});
define('skylark-langx-paths/relative',[
	"./paths",
	"./resolve"
],function(paths,resolve){

    /**
     * Solve the relative path from from to to.
     *
     * At times we have two absolute paths, and we need to derive the relative path
     * from one to the other. This is actually the reverse transform of
     * paths.resolve, which means we see that:
     *
     *    paths.resolve(from, paths.relative(from, to)) == paths.resolve(to)
     *
     * @example Usage example
     *   paths.relative('C:\\orandea\\test\\aaa', 'C:\\orandea\\impl\\bbb')
     *   // returns
     *   '..\\..\\impl\\bbb'
     *
     *   paths.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb')
     *   // returns
     *   '../../impl/bbb'
     * @param [String] from
     * @param [String] to
     * @return [String]
     */
    function relative(from, to) {
        var i;
        // Alright. Let's resolve these two to absolute paths and remove any
        // weirdness.
        from = resolve(from);
        to = resolve(to);
        var fromSegs = from.split(paths.sep);
        var toSegs = to.split(paths.sep);
        // Remove the first segment on both, as it's '' (both are absolute paths)
        toSegs.shift();
        fromSegs.shift();
        // There are two segments to this path:
        // * Going *up* the directory hierarchy with '..'
        // * Going *down* the directory hierarchy with foo/baz/bat.
        var upCount = 0;
        var downSegs = [];
        // Figure out how many things in 'from' are shared with 'to'.
        for (i = 0; i < fromSegs.length; i++) {
            var seg = fromSegs[i];
            if (seg === toSegs[i]) {
                continue;
            }
            // The rest of 'from', including the current element, indicates how many
            // directories we need to go up.
            upCount = fromSegs.length - i;
            break;
        }
        // The rest of 'to' indicates where we need to change to. We place this
        // outside of the loop, as toSegs.length may be greater than fromSegs.length.
        downSegs = toSegs.slice(i);
        // Special case: If 'from' is '/'
        if (fromSegs.length === 1 && fromSegs[0] === '') {
            upCount = 0;
        }
        // upCount can't be greater than the number of fromSegs
        // (cd .. from / is still /)
        if (upCount > fromSegs.length) {
            upCount = fromSegs.length;
        }
        // Create the final string!
        var rv = '';
        for (i = 0; i < upCount; i++) {
            rv += '../';
        }
        rv += downSegs.join(paths.sep);
        // Special case: Remove trailing '/'. Happens if it's all up and no down.
        if (rv.length > 1 && rv.charAt(rv.length - 1) === paths.sep) {
            rv = rv.substr(0, rv.length - 1);
        }
        return rv;
    }

    return paths.relative =  relative;
});
define('skylark-langx-paths/main',[
	"./paths",
	"./basename",
	"./dirname",
	"./extname",
	"./format",
	"./is-absolute",
	"./join",
	"./normalize",
	"./path",
	"./relative",
	"./resolve"
],function(paths){
	return paths;
});
define('skylark-langx-paths', ['skylark-langx-paths/main'], function (main) { return main; });


},this);
//# sourceMappingURL=sourcemaps/skylark-langx-paths.js.map
