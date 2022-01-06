/**
 * skylark-langx-paths - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./paths"],function(e){return e.normalize=function(t){""===t&&(t=".");for(var n=t.charAt(0)===e.sep,p=(t=e._removeDuplicateSeps(t)).split(e.sep),s=[],r=0;r<p.length;r++){var h=p[r];"."!==h&&(".."===h&&(n||!n&&s.length>0&&".."!==s[0])?s.pop():s.push(h))}if(!n&&s.length<2)switch(s.length){case 1:""===s[0]&&s.unshift(".");break;default:s.push(".")}return t=s.join(e.sep),n&&t.charAt(0)!==e.sep&&(t=e.sep+t),t}});
//# sourceMappingURL=sourcemaps/normalize.js.map
