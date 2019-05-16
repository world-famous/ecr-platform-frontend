<template>
  <li :class="[isFolder?'ecrw-ready-left-li':'ecrw-ready-left-li-last', selected?'ecrw-ready-left-li-selected':'']">
    <span :class="{'ecrw-ready-left-list-toggle': isFolder&&!isOpen}" v-show="isFolder" @click.stop="toggle((model.id)?model.id:'')"></span>
    <a href="javascript:;" @dblclick.stop="dblclick()" @click.stop="click()">{{ model[itemlabel] }}</a>
    <el-button type="primary" id="nextBtn" size="small" @click="setInc(model.children[0].parentcatalogid)" v-if="(model.children.length==this.pageSize)&&(count[model.children[0].parentcatalogid] != pageCount[model.children[0].parentcatalogid])">以后...</el-button>
    <el-button type="primary" id="beforeBtn" size="small" @click="setDec(model.children[0].parentcatalogid)" v-if="showBeforeBu == true">以前...</el-button>
    <ul v-show="isOpen" v-if="model.childcount>0 || model.children.length>0">
      <my-course-treeitem
        v-for="(item, idx) in model.children"
        :key="idx"
        :data="item"
        :parent="model"
        :selectable="selectable"
        :selectlevel="selectlevel"
        :model="item"
        :level="level+1"
        :openlevel="openlevel"
        :openstep="openstep"
        ref="treeitem"
        @item-click="onItemClick"
        @item-dblclick="onItemDblClick"
        @item-select="onItemSelected"
        @item-deselect="onItemDeselected">
      </my-course-treeitem>
    </ul>
  </li>
</template>

<script>import {getCatalogList} from '../../../api/api';
  export default {
    props: {
      model: {
        type: Object,
        default: null,
        required: false
      },
      selectable: {
        type: Boolean,
        default: true,
        required: false
      },
      selectlevel: {
        type: Number,
        default: 0,
        required: false
      },
      openlevel: {
        type: Number,
        default: 0,
        required: false
      },
      openstep: {
        type: Number,
        default: 2,
        required: false
      },
      level: {
        type: Number,
        default: 0,
        required: false
      },
      parent: {
        type: Object,
        default: null,
        required: false
      },
      itemlabel: {
        type: String,
        default: 'label',
        required: false
      }
    },
    data: function () {
      this.model.parent = this.parent;
      this.collapse();
      return {
        isOpen: this.level < this.openlevel,
        selected: false,
        LabelDataList: [],
        pageSize: 10,
        pageCount: [],
        total: 0,
        pageinfo: [],
        count: [],
        showBeforeBu: false,
      }
    },
    watch: {
      model: function(val, oldval) {
        this.selected = false;
        // this.model.parent = this.parent;
        // this.collapse();
      }
    },
    computed: {
      isFolder: function () {
        return ((this.model.childcount > 0)||(this.model.children.length > 0));
      }
    },
    created() {
    },
    methods: {
        setInc(parentid) {
            this.count[parentid] ++;
            this.toggleHandle(this.count[parentid], parentid);
            if (this.count[parentid] > 1)
                this.showBeforeBu = true;
        },
        setDec(parentid) {
            this.count[parentid] --;
            this.toggleHandle(this.count[parentid], parentid);
            if (this.count[parentid] == 1)
                this.showBeforeBu = false;
        },
        toggle: function (parentid) {
          if (parentid == ''){
            this.isOpen = !this.isOpen;
            if (this.$refs.treeitem) {
              if (this.isOpen) {
                var _this = this;
                this.$refs.treeitem.forEach(function(treeitem) {
                  treeitem.incollapse(_this.level + _this.openstep);
                });
              } else {
                this.$refs.treeitem.forEach(function(treeitem) {
                  treeitem.collapse();
                });
              }
            }
          } else {
            let para1 = {
              pagination:{
                numPerPage:this.pageSize,
                pageNo: 1
              },
              conditions:[
                {
                  fieldName: "parentcatalogid",
                  fieldValues: [parentid],
                  prepender: null,
                  operator: "EQUAL",
                  childConditions: null,
                },
              ]
            };
            getCatalogList(para1).then((res) => {
              if (res.data.serverResult.resultCode == "200") {
                this.LabelDataList = res.data.pageInfo.list;
                this.total = res.data.pageInfo.total;
                this.model.children = this.LabelDataList;
                this.pageCount[this.model.children[0].parentcatalogid] = Math.ceil(this.total/this.pageSize);
                this.count[this.model.children[0].parentcatalogid] = 1;
                this.doToggle();
              } else {
                this.$message({
                  message: '加载失败!',
                  type: 'error'
                });
                this.LabelDataList = [];
              }
            });
          }
        },
        toggleHandle: function (pageNo, parentid) {
          let para1 = {
            pagination:{
              numPerPage:this.pageSize,
              pageNo:pageNo,
            },
            conditions:[
              {
                fieldName: "parentcatalogid",
                fieldValues: [parentid],
                prepender: null,
                operator: "EQUAL",
                childConditions: null,
              },
            ]
          };
          getCatalogList(para1).then((res) => {
            if (res.data.serverResult.resultCode == "200") {
                 this.LabelDataList = res.data.pageInfo.list;
                this.model.children = this.LabelDataList;
              } else {
                this.$message({
                    message: '加载失败!',
                    type: 'error'
                });
                this.LabelDataList = [];
              }
          });
        },

        doToggle() {
          this.isOpen = !this.isOpen;
          if (this.$refs.treeitem && !this.isOpen) {
                  this.$refs.treeitem.forEach(function(treeitem) {
                  treeitem.collapse();
              });
          } else {
              var _this = this;
              this.$refs.treeitem.forEach(function(treeitem) {
                  treeitem.incollapse(_this.level + _this.openstep);
              });
          }
        },
        collapse() {
            this.isOpen = false;
            if (this.$refs.treeitem) {
                this.$refs.treeitem.forEach(function(treeitem) {
                    treeitem.collapse();
                });
            }
        },
        incollapse(level) {
            if (this.level < level) {
                this.isOpen = true;
            }
            if (this.$refs.treeitem) {
                var _this = this;
                this.$refs.treeitem.forEach(function(treeitem) {
                    treeitem.incollapse(_this.level + _this.openstep);
                });
            }
        },
      click: function () {
        if (this.selectlevel>this.level) {
          this.toggle('');
        } else {
          this.$emit('item-click', this, this.model);
          this.doClick();
        }
      },
      dblclick: function() {
        if (this.selectlevel>this.level) return;
        this.$emit('item-dblclick', this, this.model);
      },
      doClick: function() {
        this.selected = !this.selected;
        if (this.selected)
          this.$emit('item-select', this, this.model);
        else
          this.$emit('item-deselect', this, this.model);
      },
      ///////////// EVENT HANDLER /////////////////
      onItemClick(target, model) {
        this.$emit('item-click', target, model);
      },
      onItemDblClick(target, model) {
        this.$emit('item-dblclick', target, model);
      },
      onItemSelected: function(target, model) {
        this.$emit('item-select', target, model);
      },
      onItemDeselected: function(target, model) {
        this.$emit('item-deselect', target, model);
      }
    }
  }
</script>
<style>
  #nextBtn span{
    display: inline-table;
    background: none;
    margin: 0px;
    width: 11px;
  }
  #beforeBtn span{
    display: inline-table;
    background: none;
    margin: 0px;
    width: 11px; 
  }
</style>