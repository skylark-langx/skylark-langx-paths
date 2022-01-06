/**
 * skylark-langx-paths - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./paths","./resolve"],function(e,t){return e.relative=function(n,r){var l;n=t(n),r=t(r);var s=n.split(e.sep),h=r.split(e.sep);h.shift(),s.shift();var i=0,a=[];for(l=0;l<s.length;l++)if(s[l]!==h[l]){i=s.length-l;break}a=h.slice(l),1===s.length&&""===s[0]&&(i=0),i>s.length&&(i=s.length);var f="";for(l=0;l<i;l++)f+="../";return(f+=a.join(e.sep)).length>1&&f.charAt(f.length-1)===e.sep&&(f=f.substr(0,f.length-1)),f}});
//# sourceMappingURL=sourcemaps/relative.js.map
