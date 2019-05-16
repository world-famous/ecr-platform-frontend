import Vue from 'vue'

Vue.component('my-pagination', {
  template: '<div class="my-pagination" v-if="total > 0">\
          <el-button @click="toPage(0)" class="ecrm-mode-page-index">首页</el-button>\
          <el-button @click="toPage(curPg-1)" class="ecrm-mode-page-num">上一页</el-button>\
          <el-button v-if="Math.floor((curPg-1)/5) * 5 + 1 > 5" @click="toPage(Math.floor((curPg-1)/5) * 5)">...</el-button>\
          <el-button v-for="i in pages" @click="toPage(i)" :class="{\'el-button--primary\':i==curPg}" :key="i" :data="i">{{ i }}</el-button>\
          <el-button v-if="Math.floor((curPg-1)/5) * 5 + 5 < lastPg" @click="toPage(Math.floor((curPg-1)/5) * 5 + 6)">...</el-button>\
          <el-button @click="toPage(curPg+1)">下一页</el-button>\
          <el-button @click="toPage(lastPg)">尾页</el-button>\
          <div style="display:inline-block">\
            <span>\
              &nbsp;共{{ total }}条&nbsp;\
            </span>\
            <span>\
                到\
                <el-input style="display:inline-block; width: 50px;" v-model="toPg"></el-input>\
                页\
            </span>\
          </div>\
          <span>\
            <el-button type="primary" @click="toPage(toPg)">确定</el-button>\
          </span>\
        </div>',
  replace: true,
  props: {
    page: {
      type: Number,
      default: 1,
      required: false
    },
    total: {
      type: Number,
      default: 0,
      required: true
    },
    pageSize: {
      type: Number,
      default: 10,
      required: false
    }
  },
  watch: {
    total: function (val, oldVal) {
      this.lastPg = Math.ceil(val / this.pageSize);
    },
    curPg: function (val, oldVal) {
      this.toPg = val;
    },
    page: function(val, oldVal) {
      this.curPg = val;
    }
  },
  data: function () {
    return {
      curPg: this.page,
      lastPg: 1,
      toPg: 1
    }
  },
  computed: {
    pages: function() {
      var startPg = Math.floor((this.curPg-1)/5) * 5 + 1;
      var endPg = Math.min(this.lastPg, Math.floor((this.curPg-1)/5) * 5 + 5);
      var pageNums = [];
      for (var i=startPg; i<=endPg; i++) {
        pageNums.push(i);
      }
      return pageNums;
    }
  },
  methods: {
    toPage: function(pg) {
      if (pg < 1) pg = 1;
      if (pg > this.lastPg) pg = this.lastPg;
      this.curPg = pg;

      this.$emit('current-change', parseInt(this.curPg));
    },
  }
});