/**
 * skylark-langx-paths - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./paths","./normalize"],function(n,e){return n.basename=function(t,l){if(void 0===l&&(l=""),""===t)return t;var r=(t=e(t)).split(n.sep),h=r[r.length-1];return""===h&&r.length>1?r[r.length-2]:l.length>0&&h.substr(h.length-l.length)===l?h.substr(0,h.length-l.length):h}});
//# sourceMappingURL=sourcemaps/basename.js.map
