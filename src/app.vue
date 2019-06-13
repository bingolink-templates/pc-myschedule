<template>
  <div class="news">
    <div class="header">
      <span class="title">{{i18n.MySchedule}}<i>{{items.length>0?'('+items.length+')':''}}</i></span>
      <span class="more" @click="toMore()">{{i18n.More}}</span>
    </div>
    <div class="content">
      <div class="calendar">
        <div class="text">
          <span v-for="dt in DateTexts">{{dt}}</span>
        </div>
        <div class="num">
          <span v-for="dt in DateTimes" v-bind:class="{hasData: dt.hasSchedule}">
            <i v-bind:style="{'background-color':(dt.isActive||dt.isHover)?themeColor:'',
              'color':(dt.isActive||dt.isHover)?'#FFFFFF':''}" 
              @mouseover="dt.isHover=true"
              @mouseout="dt.isHover=false"
              @click="selectDay(dt)">{{dt.day}}</i>
          </span>
        </div>
      </div>
      <div class="new-item" v-for="(item, $index) in items" :key="item">
        <div class="text-type">
          <i class="item-dot" v-bind:style="{'background-color': themeColor}"></i>
          <p class="item-title" @click="openUrl(item)">【{{item.period}}】{{item.title}}</p>
        </div>
      </div>  
      <div class="error-info" v-if="errMsg">
        <img src="static/styleImages/tea.svg" />
        <span @click="getWholeData()">{{errMsg}}</span>
      </div>          
    </div>
  </div>
</template>

<script>
import dateUtil from 'ser/date'
import api from 'ser/api'
import util from 'ser/util'

export default {
  data () {
    return {
      i18n: window.i18n,
      themeColor: window.env.themeColor,
      DateTexts: [window.i18n.Sun, window.i18n.Mon,
                  window.i18n.Tue, window.i18n.Wed,
                  window.i18n.Thu, window.i18n.Fri, window.i18n.Sat],
      DateTimes: [],
      weekItems: {},
      items: [],
      errMsg: ''
    }
  },
  components: {
  },
  created(){
    this.getWholeData();
  },
  mounted(){
  },
  methods: {
    getWholeData(callback){
      this.DateTimes = dateUtil.getCurrentWeek();
      this.getWeekItems(() => {
        util.each(this.DateTimes , (dt) => {
          if(dt.isActive){
            this.selectDay(dt);
          }
        });
      });
    },
    selectDay(weekDay){
      var res = this.weekItems[weekDay.dateStr] || [];
      if(res.length > 0){
        this.items = res;
        this.errMsg = '';
      } else {
        this.items = [];
        this.errMsg = i18n.NoOngoingSchedules;
      }
      util.each(this.DateTimes , function(dt){
        dt.isActive = false;
      });
      weekDay.isActive = true;
    },
    getWeekItems(callback){
      var start = this.DateTimes[0].dateStr,
          end = this.DateTimes[6].dateStr;
      api.getSchedules(new Date(start + ' 00:00:00').getTime(), new Date(end + ' 23:59:59').getTime(),
        (res) => {
          util.each(this.DateTimes, (_dt) => {
            _dt.hasSchedule = res[_dt.dateStr];
          })
          this.weekItems = res;
          callback && callback();
        },
        (errMsg) => {
          this.errMsg = errMsg;
        });
    },
    openUrl(item){
      app.linkplugin.openWindow(api.getOpenUrl(item), item.name);
    },
    toMore(){
      app.linkplugin.openWindow(api.getMoreUrl(), i18n.App_Schedule);
    }
  }
}
</script>

<style lang="scss">
@import '~asset/common';
@import '~asset/app';
</style>
