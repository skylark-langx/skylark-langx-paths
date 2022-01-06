/**
 * skylark-langx-paths - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./paths","./normalize"],function(n,e){return n.extname=function(t){var r=(t=e(t)).split(n.sep);if(""===(t=r.pop())&&r.length>0&&(t=r.pop()),".."===t)return"";var p=t.lastIndexOf(".");return-1===p||0===p?"":t.substr(p)}});
//# sourceMappingURL=sourcemaps/extname.js.map
