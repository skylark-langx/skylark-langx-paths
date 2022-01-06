/**
 * skylark-langx-paths - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./paths","./normalize"],function(n,r){return n.join=function(){for(var e=[],t=0;t<arguments.length;t++)e[t-0]=arguments[t];for(var o=[],i=0;i<e.length;i++){var f=e[i];if("string"!=typeof f)throw new TypeError("Invalid argument type to segs.join: "+typeof f);""!==f&&o.push(f)}return r(o.join(n.sep))}});
//# sourceMappingURL=sourcemaps/join.js.map
