module.exports = {
    extend() {
        var length = arguments.length;
        var target = arguments[0] || {};
        if (typeof target != "object" && typeof target != "function") {
            target = {};
        }
        for (var i = 1; i < length; i++) {
            var source = arguments[i];
            for (var key in source) {
                // 使用for in会遍历数组所有的可枚举属性，包括原型。
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    },
    each(arr, callback){
        if(!arr) return;
        for(var i = 0; i < arr.length; i++){
            callback(arr[i]);
        }
    }
}

