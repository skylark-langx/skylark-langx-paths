/**
 * skylark-langx-paths - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
!function(t,e){var n=e.define,require=e.require,r="function"==typeof n&&n.amd,s=!r&&"undefined"!=typeof exports;if(!r&&!n){var i={};n=e.define=function(t,e,n){"function"==typeof n?(i[t]={factory:n,deps:e.map(function(e){return function(t,e){if("."!==t[0])return t;var n=e.split("/"),r=t.split("/");n.pop();for(var s=0;s<r.length;s++)"."!=r[s]&&(".."==r[s]?n.pop():n.push(r[s]));return n.join("/")}(e,t)}),resolved:!1,exports:null},require(t)):i[t]={factory:null,resolved:!0,exports:n}},require=e.require=function(t){if(!i.hasOwnProperty(t))throw new Error("Module "+t+" has not been defined");var module=i[t];if(!module.resolved){var n=[];module.deps.forEach(function(t){n.push(require(t))}),module.exports=module.factory.apply(e,n)||null,module.resolved=!0}return module.exports}}if(!n)throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");if(function(t,require){t("skylark-langx-paths/paths",["skylark-langx-ns"],function(t){var e={_makeLong:function(t){return t},_removeDuplicateSeps:function(t){return t=t.replace(this._replaceRegex,this.sep)},sep:"/"};return e._replaceRegex=new RegExp("//+","g"),e.delimiter=":",e.posix=e,e.win32=e,t.attach("langx.paths",e)}),t("skylark-langx-paths/basename",["./paths"],function(t){return t.basename=function(e,n){void 0===n&&(n="");if(""===e)return e;var r=(e=t.normalize(e)).split(t.sep),s=r[r.length-1];if(""===s&&r.length>1)return r[r.length-2];if(n.length>0){var i=s.substr(s.length-n.length);if(i===n)return s.substr(0,s.length-n.length)}return s}}),t("skylark-langx-paths/dirname",["./paths"],function(t){return t.dirname=function(e){var n=(e=t._removeDuplicateSeps(e)).charAt(0)===t.sep,r=e.split(t.sep);""===r.pop()&&r.length>0&&r.pop();return r.length>1||1===r.length&&!n?r.join(t.sep):n?t.sep:"."}}),t("skylark-langx-paths/normalize",["./paths"],function(t){return t.normalize=function(e){""===e&&(e=".");for(var n=e.charAt(0)===t.sep,r=(e=t._removeDuplicateSeps(e)).split(t.sep),s=[],i=0;i<r.length;i++){var a=r[i];"."!==a&&(".."===a&&(n||!n&&s.length>0&&".."!==s[0])?s.pop():s.push(a))}if(!n&&s.length<2)switch(s.length){case 1:""===s[0]&&s.unshift(".");break;default:s.push(".")}e=s.join(t.sep),n&&e.charAt(0)!==t.sep&&(e=t.sep+e);return e}}),t("skylark-langx-paths/extname",["./paths","./normalize"],function(t,e){return t.extname=function(n){var r=(n=e(n)).split(t.sep);""===(n=r.pop())&&r.length>0&&(n=r.pop());if(".."===n)return"";var s=n.lastIndexOf(".");if(-1===s||0===s)return"";return n.substr(s)}}),t("skylark-langx-paths/format",["./paths"],function(t){return t.format=function(e){if(null===e||"object"!=typeof e)throw new TypeError("Parameter 'pathObject' must be an object, not "+typeof e);if("string"!=typeof(e.root||""))throw new TypeError("'pathObject.root' must be a string or undefined, not "+typeof e.root);var n=e.dir?e.dir+t.sep:"",r=e.base||"";return n+r}}),t("skylark-langx-paths/is-absolute",["./paths"],function(t){return t.isAbsolute=function(e){return e.length>0&&e.charAt(0)===t.sep}}),t("skylark-langx-paths/join",["./paths","./normalize"],function(t,e){return t.join=function(){for(var t=[],n=0;n<arguments.length;n++)t[n-0]=arguments[n];for(var r=[],s=0;s<t.length;s++){var i=t[s];if("string"!=typeof i)throw new TypeError("Invalid argument type to paths.join: "+typeof i);""!==i&&r.push(i)}return e(r.join(t.sep))}}),t("skylark-langx-paths/path",["skylark-langx-types","skylark-langx-constructs","./paths"],function(t,e,n){var r=e.klass({_construct:function(){var e=this._={segments:null,hasLeading:!1,hasTrailing:!1};1==arguments.length&&t.isString(arguments[0])?this._parse(arguments[0]):t.isArray(arguments[0])&&(e.segments=arguments[0],e.hasLeading=arguments[1]||!1,e.hasTrailing=arguments[2]||!1,this._canonicalize())},_canonicalize:function(){for(var t,e=this._.segments,n=0;n<e.length;n++)if("."==e[n]||".."==e[n]){t=!0;break}if(t){for(var r=[],n=0;n<e.length;n++)".."==e[n]?0==r.length?this.hasLeading||r.push(e[n]):".."==r[r.length-1]?r.push(".."):r.pop():"."==e[n]&&1!=e.length||r.push(e[n]);if(r.length==e.length)return;this._.segments=r}},_length:function(t){return this._.segments.length},_parse:function(t){t||(t=".");var e=this._,n=t.split("/");"/"==t.charAt(0)&&(e.hasLeading=!0,n.shift()),"/"==t.charAt(t.length-1)&&(e.hasTrailing=!0,n.pop()),e.segments=n,e.path=t,this._canonicalize()},append:function(e){return t.isString(e)?this.appendPathStr(e):this.appendPath(e)},appendPath:function(t){if(t.isAbsolute())return t;var e=this.segments,n=t.segments,s=e.concat(n),i=new r(s,this.hasLeading,t.hasTrailing);return i},appendPathStr:function(t){return t=new r(t||""),this.appendPath(t)},clone:function(){return new r(this.segments,this.hasLeading,this.hasTrailing)},endsWith:function(t){for(var e=this.segments,n=new r(t).segments;n.length>0&&e.length>0;)if(n.pop()!=e.pop())return!1;return!0},equals:function(t){var e=this._.segments,n=t._.segments;if(e.length!=n.length)return!1;for(var r=0;r<e.length;r++)if(n[r]!=e[r])return!1;return!0},firstSegment:function(t){var e=this._.segments;return e[t||0]},getExtension:function(){var t=this._.extension,e=this._.path;return textension||(t=this._.extension=e.substr(e.lastIndexOf(".")+1)),t},getSegments:function(){return this.segments},getParentPath:function(){var t=this._.parentPath;if(!t){var e=this.segments;e.pop(),t=this._.parentPath=new r(e,this.hasLeading)}return t},getRoot:function(){},isAbsolute:function(){return this.hasLeading},lastSegment:function(){var t=this._.segments;return t[t.length-1]},matchingFirstSegments:function(t){for(var e=this.segments,n=t.segments,r=Math.min(e.length,n.length),s=0,i=0;i<r;i++){if(e[i]!=n[i])return s;s++}return s},normalize:function(){},removeFirstSegments:function(t){var e=this._.segments,n=this._.hasLeading;return hasTrailing=this._.hasTrailing,new r(e.slice(t,e.length),n,hasTrailing)},removeLastSegments:function(t){var e=this._.segments,n=this._.hasLeading;return hasTrailing=this._.hasTrailing,t||(t=1),new r(e.slice(0,e.length-t),n,hasTrailing)},removeMatchingFirstSegments:function(t){var e=this.matchingFirstSegments(t);return this.removeFirstSegments(e)},removeMatchingLastSegments:function(t){var e=this.matchingFirstSegments(anotherPath);return this.removeLastSegments(e)},removeRelative:function(){var t=this.segments;return t.length>0&&"."==t[1]?this.removeFirstSegments(1):this},relativeTo:function(t,e){"string"==typeof t&&(t=new r(t));var n=this.segments;if(this.isAbsolute())return this;var s=t.segments,i=this.matchingFirstSegments(t),a=s.length;e&&(a-=1);var h=a-i,o=h+n.length-i;if(0==o)return r.EMPTY;for(var l=[],u=0;u<h;u++)l.push("..");for(var u=i;u<n.length;u++)l.push(n[u]);return new r(l,!1,this.hasTrailing)},segment:function(t){var e=this._.segments;return e.length<t?null:e[t]},startsWith:function(t){var e=this.matchingFirstSegments(t);return t._length()==e},toString:function(){var t=[],e=this._.segments;this.hasLeading&&t.push("/");for(var n=0;n<e.length;n++)n>0&&t.push("/"),t.push(e[n]);return this.hasTrailing&&t.push("/"),t.join("")},hasLeading:{get:function(){return this._.hasLeading}},hasTrailing:{get:function(){return this._.hasTrailing}}});return r.EMPTY=new r(""),n.Path=r}),t("skylark-langx-paths/relative",["./paths"],function(t){return t.relative=function(e,n){var r;e=t.resolve(e),n=t.resolve(n);var s=e.split(t.sep),i=n.split(t.sep);i.shift(),s.shift();var a=0,h=[];for(r=0;r<s.length;r++){var o=s[r];if(o!==i[r]){a=s.length-r;break}}h=i.slice(r),1===s.length&&""===s[0]&&(a=0);a>s.length&&(a=s.length);var l="";for(r=0;r<a;r++)l+="../";(l+=h.join(t.sep)).length>1&&l.charAt(l.length-1)===t.sep&&(l=l.substr(0,l.length-1));return l}}),t("skylark-langx-paths/resolve",["./paths","./normalize"],function(t,e){return t.resolve=function(){for(var t=[],n=0;n<arguments.length;n++)t[n-0]=arguments[n];for(var r=[],s=0;s<t.length;s++){var i=t[s];if("string"!=typeof i)throw new TypeError("Invalid argument type to paths.join: "+typeof i);""!==i&&(i.charAt(0)===t.sep&&(r=[]),r.push(i))}var a=e(r.join(t.sep));if(a.length>1&&a.charAt(a.length-1)===t.sep)return a.substr(0,a.length-1);if(a.charAt(0)!==t.sep){"."!==a.charAt(0)||1!==a.length&&a.charAt(1)!==t.sep||(a=1===a.length?"":a.substr(2));var h=process.cwd();a=""!==a?e(h+("/"!==h?t.sep:"")+a):h}return a}}),t("skylark-langx-paths/main",["./paths","./basename","./dirname","./extname","./format","./is-absolute","./join","./normalize","./path","./relative","./resolve"],function(t){return t}),t("skylark-langx-paths",["skylark-langx-paths/main"],function(t){return t})}(n),!r){var a=require("skylark-langx-ns");s?module.exports=a:e.skylarkjs=a}}(0,this);
//# sourceMappingURL=sourcemaps/skylark-langx-paths.js.map
