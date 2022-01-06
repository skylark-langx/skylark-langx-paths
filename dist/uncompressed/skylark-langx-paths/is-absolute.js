define([
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