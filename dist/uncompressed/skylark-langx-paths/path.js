define([
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
