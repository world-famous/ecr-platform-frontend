<template>
  <li :class="[isFolder?'ecrw-ready-left-li':'ecrw-ready-left-li-last', selected?'ecrw-ready-left-li-selected':'']">
    <span :class="{'ecrw-ready-left-list-toggle': isFolder&&!isOpen}" v-show="isFolder" @click.stop="toggle()"></span><a href="javascript:;" @dblclick.stop="dblclick()" @click.stop="click()">{{ model[itemlabel] }}</a>
    <ul v-show="isOpen" v-if="model.children!=null && model.children.length>0">
      <my-treeitem
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
      </my-treeitem>
    </ul>
  </li>
</template>

<script>
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
      return {
        isOpen: this.level < this.openlevel,
        selected: false
      }
    },
    watch: {
      model: function(val, oldval) {
        this.model.parent = this.parent;
      }
    },
    computed: {
      isFolder: function () {
        return this.model.children != null && this.model.children.length > 0;
      }
    },
    methods: {
      toggle: function () {
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
      },
      collapse: function() {
        this.isOpen = false;
        if (this.$refs.treeitem) {
          this.$refs.treeitem.forEach(function(treeitem) {
            treeitem.collapse();
          });
        }
      },
      incollapse: function(level) {
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
          this.toggle();
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