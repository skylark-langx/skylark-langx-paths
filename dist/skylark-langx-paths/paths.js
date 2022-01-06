/**
 * skylark-langx-paths - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-ns"],function(e){var n={_makeLong:function(e){return e},_removeDuplicateSeps:function(e){return e=e.replace(this._replaceRegex,this.sep)},sep:"/"};return n._replaceRegex=new RegExp("//+","g"),n.delimiter=":",n.posix=n,n.win32=n,e.attach("langx.paths",n)});
//# sourceMappingURL=sourcemaps/paths.js.map
