/**
 * skylark-langx-paths - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./paths","./normalize"],function(n,r){return n.join=function(){for(var n=[],t=0;t<arguments.length;t++)n[t-0]=arguments[t];for(var e=[],o=0;o<n.length;o++){var i=n[o];if("string"!=typeof i)throw new TypeError("Invalid argument type to paths.join: "+typeof i);""!==i&&e.push(i)}return r(e.join(n.sep))}});
//# sourceMappingURL=sourcemaps/join.js.map
