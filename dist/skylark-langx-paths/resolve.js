/**
 * skylark-langx-paths - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./paths","./normalize"],function(e,r){return e.resolve=function(){for(var t=[],n=0;n<arguments.length;n++)t[n-0]=arguments[n];for(var o=[],a=0;a<t.length;a++){var h=t[a];if("string"!=typeof h)throw new TypeError("Invalid argument type to paths.join: "+typeof h);""!==h&&(h.charAt(0)===e.sep&&(o=[]),o.push(h))}var p=r(o.join(e.sep));return p.length>1&&p.charAt(p.length-1)===e.sep?p.substr(0,p.length-1):p}});
//# sourceMappingURL=sourcemaps/resolve.js.map
