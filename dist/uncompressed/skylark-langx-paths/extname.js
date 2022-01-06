define([
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