/**
 * skylark-langx-paths - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./paths","./normalize"],function(r,e){return r.resolve=function(){for(var r=[],t=0;t<arguments.length;t++)r[t-0]=arguments[t];for(var n=[],s=0;s<r.length;s++){var h=r[s];if("string"!=typeof h)throw new TypeError("Invalid argument type to paths.join: "+typeof h);""!==h&&(h.charAt(0)===r.sep&&(n=[]),n.push(h))}var a=e(n.join(r.sep));if(a.length>1&&a.charAt(a.length-1)===r.sep)return a.substr(0,a.length-1);if(a.charAt(0)!==r.sep){"."!==a.charAt(0)||1!==a.length&&a.charAt(1)!==r.sep||(a=1===a.length?"":a.substr(2));var o=process.cwd();a=""!==a?e(o+("/"!==o?r.sep:"")+a):o}return a}});
//# sourceMappingURL=sourcemaps/resolve.js.map
