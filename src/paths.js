define([
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