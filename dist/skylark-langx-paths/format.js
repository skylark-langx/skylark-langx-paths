/**
 * skylark-langx-paths - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./paths"],function(t){return t.format=function(e){if(null===e||"object"!=typeof e)throw new TypeError("Parameter 'pathObject' must be an object, not "+typeof e);if("string"!=typeof(e.root||""))throw new TypeError("'pathObject.root' must be a string or undefined, not "+typeof e.root);return(e.dir?e.dir+t.sep:"")+(e.base||"")}});
//# sourceMappingURL=sourcemaps/format.js.map
