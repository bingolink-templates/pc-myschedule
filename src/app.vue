<template>
  <div class="news">
    <div class="header">
      <span class="title">{{i18n.MyTask}}<i>{{items.length>0?'('+items.length+')':''}}</i></span>
      <span class="more" @click="toMore()">{{i18n.More}}</span>
    </div>
    <div class="content">
      <div class="new-item" v-for="(item, $index) in items" :key="item">
        <div class="text-type">
          <p class="item-title" @click="openUrl(item)">{{item.name}}</p>
          <span class="item-info">{{item.showTime}}</span>
        </div>
      </div>  
      <div class="error-info" v-if="errMsg">
        <img src="static/styleImages/tea.svg" />
        <span @click="loadTask()">{{errMsg}}</span>
      </div>          
    </div>
  </div>
</template>

<script>
import dateUtil from 'ser/date'
import api from 'ser/api'

export default {
  data () {
    return {
      i18n: window.i18n,
      items: [],
      errMsg: ''
    }
  },
  components: {
  },
  created(){
    this.loadTask();
  },
  mounted(){
  },
  methods: {
    loadTask(){
      var today = dateUtil.format(new Date(), 'yyyy-MM-dd');
      api.getTasks(new Date(today + ' 00:00:00').getTime(), new Date(today + ' 23:59:59').getTime(),
        (res) => {
          console.log('Task Get', res)
          if(res.length > 0){
            this.items = res;
            this.errMsg = '';
          } else {
            this.errMsg = i18n.NoOngoingTasks;
          }
        },
        (errMsg) => {
          this.errMsg = errMsg;
        });
    },
    openUrl(item){
      app.linkplugin.openWindow(api.getOpenUrl(item), item.name);
    },
    toMore(){
      app.linkplugin.openWindow(api.getMoreUrl(), i18n.App_Worktask);
    }
  }
}
</script>

<style lang="scss">
@import '~asset/common';
@import '~asset/app';
</style>
