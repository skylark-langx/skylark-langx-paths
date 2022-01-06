/**
 * skylark-langx-paths - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./paths"],function(e){return e.relative=function(t,n){var r;t=e.resolve(t),n=e.resolve(n);var l=t.split(e.sep),s=n.split(e.sep);s.shift(),l.shift();var h=0,i=[];for(r=0;r<l.length;r++)if(l[r]!==s[r]){h=l.length-r;break}i=s.slice(r),1===l.length&&""===l[0]&&(h=0),h>l.length&&(h=l.length);var a="";for(r=0;r<h;r++)a+="../";return(a+=i.join(e.sep)).length>1&&a.charAt(a.length-1)===e.sep&&(a=a.substr(0,a.length-1)),a}});
//# sourceMappingURL=sourcemaps/relative.js.map
