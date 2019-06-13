/**
 * 时间相关的处理
 */
module.exports = {
    /**
     * ts 时间
     * fmt 格式化
     */
    format: function(ts, fmt) {
        if (!ts) return '';
        if (!fmt) fmt = 'yyyy-MM-dd hh:mm:ss'
        var dt = new Date(ts)
        var o = {
            'M+': dt.getMonth() + 1, // 月份
            'd+': dt.getDate(), // 日
            'h+': dt.getHours(), // 小时
            'm+': dt.getMinutes(), // 分
            's+': dt.getSeconds(), // 秒
            'q+': Math.floor((dt.getMonth() + 3) / 3), // 季度
            'S': dt.getMilliseconds() // 毫秒
        }
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (dt.getFullYear() + '').substr(4 - RegExp.$1.length))
        for (var k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) {
                fmt = fmt.replace(RegExp.$1,
                    (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
            }
        }
        return fmt
    }
}
