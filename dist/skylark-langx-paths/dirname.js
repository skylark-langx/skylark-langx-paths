/**
 * skylark-langx-paths - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./paths"],function(e){return e.dirname=function(n){var p=(n=e._removeDuplicateSeps(n)).charAt(0)===e.sep,t=n.split(e.sep);return""===t.pop()&&t.length>0&&t.pop(),t.length>1||1===t.length&&!p?t.join(e.sep):p?e.sep:"."}});
//# sourceMappingURL=sourcemaps/dirname.js.map
