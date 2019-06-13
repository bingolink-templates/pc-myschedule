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

function formatStartEndTime(datas){
    var tYear = new Date().getFullYear();
    util.each(datas || [], function(data){
        var sDate,
            eDate,
            sf,
            ef;
        if(data.startTime){
            sDate = new Date(data.startTime);
            sf = data.isAllDay ? (sDate.getFullYear() == tYear ? 'MM-dd' : 'yyyy-MM-dd') : (sDate.getFullYear() == tYear ? 'MM-dd hh:mm' : 'yyyy-MM-dd hh:mm');
            sDate = dateUtil.format(sDate, sf);
        }
        if(data.endTime){
            eDate = new Date(data.endTime);
            ef = data.isAllDay ? (eDate.getFullYear() == tYear ? 'MM-dd' : 'yyyy-MM-dd') : (eDate.getFullYear() == tYear ? 'MM-dd hh:mm' : 'yyyy-MM-dd hh:mm');
            eDate = dateUtil.format(eDate, ef);
        }
        if(sDate && eDate){
            data.showTime = sDate + '~' + eDate;
        } else if(sDate && !eDate){
            data.showTime = i18n.Date_Begin + sDate;
        } else if(!sDate && eDate){
            data.showTime = i18n.Date_End + eDate;
        } else {
            data.showTime = '';
        }
        if(data.isAllDay) data.showTime += ' ' + i18n.Date_ALLDay;
    });
    return datas;
}

module.exports = {
    getTasks(startTime, endTime, success, error){
        startTime /= 1000;
        endTime /= 1000;
        var obj = {
            entityName: 'ExtendWorktask',
            searchType: 0,
            keyWord: '',
            currentStatus: 0,
            orderBy: 'IF(ISNULL(IFNULL(startTime,endTime)),1,0),IF(ISNULL(startTime),endTime,startTime),IF(ISNULL(endTime),1,0),endTime',
            marked: false,
            parentId: '',
            endTime: '',
            startTime: ''
        }
        //进行中
        var progressObj = util.extend({}, obj, {
            marked: '',
            whereFilter: '(UNIX_TIMESTAMP(startTime) <= ' + endTime + ' OR startTime IS NULL) AND (UNIX_TIMESTAMP(endTime) >= ' + startTime + ' OR endTime IS NULL)'
        });
        var progressObjExt = util.extend({}, progressObj, {
            searchType: 4 //; 外部数据
        });

        var counter = 2,
            datas = [];
        requestCommonList(progressObj, sucCallback, errCallback)
        requestCommonList(progressObjExt, sucCallback, errCallback)

        function sucCallback(res){
            datas = datas.concat(res);
            counter--;
            if(counter == 0){
                success(formatStartEndTime(datas));
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
            name: encodeURIComponent(i18n.App_Worktask),
            sourceType: 40,
            E: 'ExtendWorktask',
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
            name: encodeURIComponent(i18n.App_Worktask),
            sourceType: 40,
            E: 'ExtendWorktask'
        }
        var url = '{web}/taskList.html?';
        for(var key in params){
            url += key + '=' + params[key] + '&';
        }
        return url;
    }
}
