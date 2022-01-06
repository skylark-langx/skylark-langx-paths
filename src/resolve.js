define([
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