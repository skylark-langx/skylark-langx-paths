/**
 * skylark-langx-paths - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./paths"],function(n){return n.basename=function(e,t){if(void 0===t&&(t=""),""===e)return e;var l=(e=n.normalize(e)).split(n.sep),r=l[l.length-1];return""===r&&l.length>1?l[l.length-2]:t.length>0&&r.substr(r.length-t.length)===t?r.substr(0,r.length-t.length):r}});
//# sourceMappingURL=sourcemaps/basename.js.map
