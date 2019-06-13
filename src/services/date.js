/**
 * 时间相关的处理
 */
module.exports = {
    DATE_TIME: 1000 * 60 * 60 * 24,
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
    },
    getCurrentWeek(){
        var DATE_TIME = this.DATE_TIME;
        var today = new Date(),
            todayTime = today.getTime(),
            dayOf = today.getDay(),
            weeks = [];
        for(var i = 0; i < 7; i++){
            var _date = new Date(todayTime + (i - dayOf) * DATE_TIME);
            weeks.push({
                day: _date.getUTCDate(),
                date: _date,
                dateStr: this.format(_date, 'yyyy-MM-dd'),
                isActive: i == dayOf,
                hasSchedule: false
            })
        }
        return weeks;
    }
}
