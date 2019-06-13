import util from 'ser/util'
import dateUtil from 'ser/date'

function requestCommonList(options, success , error){
    app.linkplugin.ajax({
        url: window.env.specialUri + '/webCommon/getList',
        data: options,
        contentType: 'application/json',
        success: function(res){
            res = JSON.parse(res);
            success(res.data);
        },
        error: function(){
            error(window.i18n.ErrorLoadData);
        }
    }) 
}

function formatCalendarDate(time){
    return new Date(dateUtil.format(new Date(time), 'yyyy-MM-dd') + ' 00:00:00').getTime();
}

//将时间段切成天
function cutPeriodToDay(startTime, endTime, isAllDay){
    if(startTime > endTime) return {};
    var days = {};
    var startDay = formatCalendarDate(startTime);
    for(; startDay <= endTime; startDay += dateUtil.DATE_TIME){
        var dayStr = dateUtil.format(new Date(startDay), 'yyyy-MM-dd'),
            dS = new Date(dayStr + ' 00:00:00').getTime(),
            dE = new Date(dayStr + ' 23:59:59').getTime();
        if(startTime <= dS && dE <= endTime || isAllDay){ //全天
            days[dayStr] = i18n.Date_ALLDay;
        } else if(startTime > dS && dE > endTime){ //某天内
            days[dayStr] = dateUtil.format(new Date(startTime), 'hh:mm') + '-'
                + dateUtil.format(new Date(endTime), 'hh:mm');
        } else if(startTime > dS && dE <= endTime){ //开始于
            days[dayStr] = dateUtil.format(new Date(startTime), 'hh:mm');
        } else if(startTime <= dS && dE > endTime){ //结束于
            days[dayStr] = i18n.Date_End + dateUtil.format(new Date(endTime), 'hh:mm');
        }
    }
    return days;
}

//将日程切割到每一天
function splitScheduleToDay(datas){
    var sheduleDays = {};
    util.each(datas, function(d){
        var ds = cutPeriodToDay(d.startTime, d.endTime, d.isAllDay);
        for(var dStr in ds){
            if(!sheduleDays[dStr]) sheduleDays[dStr] = [];
            sheduleDays[dStr].push({
                id: d.id,
                period: ds[dStr],
                title: d.name,
                marked: d.marked
            });
        }
    });
    return sheduleDays;
}

module.exports = {
    getSchedules(start, end, success, error){
        var sqls = [];
        if(end) sqls.push('UNIX_TIMESTAMP(startTime) <= ' + end / 1000);
        if(start) sqls.push('UNIX_TIMESTAMP(endTime) >= ' + start / 1000);

        var reqObj = {
            entityName: 'ExtendSchedule',
            searchType: 0,
            pageSize: '',
            page: '',
            keyWord: '',
            orderBy: 'startTime asc',
            parentId: '',
            scope: 'all',
            whereFilter: sqls.join(' and '),
            endTime: '',
            startTime: ''
        }

        var reqObjExt = util.extend({}, reqObj, {
            searchType: 4 //; 外部数据
        });

        var counter = 2,
            datas = [];
        requestCommonList(reqObj, sucCallback, errCallback)
        requestCommonList(reqObjExt, sucCallback, errCallback)

        function sucCallback(res){
            datas = datas.concat(res);
            counter--;
            if(counter == 0){
                success(splitScheduleToDay(datas));
            }
        }

        function errCallback(){
            counter--;
            if(counter == 0){
                error(window.i18n.ErrorLoadData);
            }
        }
    },
    getOpenUrl(item){
        var params = {
            name: encodeURIComponent(i18n.App_Schedule),
            sourceType: 26,
            E: 'ExtendSchedule',
            sourceId: item.id
        }
        var url = '{web}/home.html?';
        for(var key in params){
            url += key + '=' + params[key] + '&';
        }
        return url;
    },
    getMoreUrl(){
        var params = {
            name: encodeURIComponent(i18n.App_Schedule),
            sourceType: 26,
            E: 'ExtendSchedule'
        }
        var url = '{web}/scheduleList.html?';
        for(var key in params){
            url += key + '=' + params[key] + '&';
        }
        return url;
    }
}
