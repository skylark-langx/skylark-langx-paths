define([
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