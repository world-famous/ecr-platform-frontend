<template>
  <ul v-if="data!=null && data.length>0">
    <my-course-treeitem
      v-for="(item, idx) in data"
      :key="idx"
      :data="item"
      :selectable="selectable"
      :selectlevel="selectlevel"
      :single="single"
      :openlevel="openlevel"
      :openstep="openstep"
      :model="item"
      :itemlabel="itemlabel"
      @item-click="onItemClick"
      @item-select="onItemSelect"
      @item-deselect="onItemDeselect">
    </my-course-treeitem>
  </ul>
</template>

<script>
  export default {
    props: {
      data: {
        type: Array,
        default: [],
        required: true
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
      single: {
        type: Boolean,
        default: true,
        required: false,
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
      itemlabel: {
        type: String,
        default: 'label',
        required: false
      }
    },
    data: function () {
      return {
        selectedItems:[],
        lastSelectedTarget:null
      }
    },
    methods: {
      onItemSelect: function(target, item) {
        this.selectedItems.push(item);
        this.$emit('item-select', target, item, this.selectedItems);
        
        if (this.single && this.lastSelectedTarget != null) {
          this.lastSelectedTarget.doClick();
        }
        this.lastSelectedTarget = target;
      },
      onItemDeselect: function(target, item) {
        if (this.single && this.lastSelectedTarget != null && this.lastSelectedTarget == target) {
          this.lastSelectedTarget = null;
        }
        var index = this.selectedItems.indexOf(item);
        this.selectedItems.splice(index, 1);
        this.$emit('item-deselect', target, item, this.selectedItems);
      },
      onItemClick: function(target, item) {
        this.$emit('item-click', target, item, this.selectedItems);
      }
    }
  }
</script>