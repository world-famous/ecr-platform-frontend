<template>
  <transition name="el-message-fade">
    <div
      class="el-message"
      :class="customClass"
      v-show="visible"
      @mouseenter="clearTimer"
      @mouseleave="startTimer">
      <img class="el-message__img" :src="typeImg" alt="" v-if="!iconClass">
      <div class="el-message__group" :class="{ 'is-with-icon': iconClass }">
        <slot><p><i class="el-message__icon" :class="iconClass" v-if="iconClass"></i>{{ message }}</p></slot>
        <div v-if="showClose" class="el-message__closeBtn el-icon-close" @click="close"></div>
      </div>
    </div>
  </transition>
</template>

<script type="text/babel">
  export default {
    data() {
      return {
        visible: false,
        message: '',
        duration: 3000,
        type: 'info',
        iconClass: '',
        customClass: '',
        onClose: null,
        showClose: false,
        closed: false,
        timer: null
      };
    },

    computed: {
      typeImg() {
        return require(`../assets/${ this.type }.svg`);
      }
    },

    watch: {
      closed(newVal) {
        if (newVal) {
          this.visible = false;
          this.$el.addEventListener('transitionend', this.destroyElement);
        }
      }
    },

    methods: {
      destroyElement() {
        this.$el.removeEventListener('transitionend', this.destroyElement);
        this.$destroy(true);
        this.$el.parentNode.removeChild(this.$el);
      },

      close() {
        this.closed = true;
        if (typeof this.onClose === 'function') {
          this.onClose(this);
        }
      },

      clearTimer() {
        clearTimeout(this.timer);
      },

      startTimer() {
        if (this.duration > 0) {
          this.timer = setTimeout(() => {
            if (!this.closed) {
              this.close();
            }
          }, this.duration);
        }
      }
    },

    mounted() {
      this.startTimer();
    }
  };
</script>

<style>
  .el-message{box-shadow:0 2px 4px rgba(0,0,0,.12),0 0 6px rgba(0,0,0,.04);min-width:300px;padding:10px 12px;box-sizing:border-box;border-radius:2px;position:fixed;left:50%;top:20px;-ms-transform:translateX(-50%);transform:translateX(-50%);background-color:#fff;transition:opacity .3s,transform .4s;overflow:hidden}.el-message .el-icon-circle-check{color:#13ce66}.el-message .el-icon-circle-cross{color:#ff4949}.el-message .el-icon-information{color:#50bfff}.el-message .el-icon-warning{color:#f7ba2a}.el-message__group{margin-left:38px;position:relative;height:20px;line-height:20px;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center}.el-message__group p{font-size:14px;margin:0 34px 0 0;white-space:nowrap;color:#8391a5;text-align:justify}.el-message__group.is-with-icon{margin-left:0}.el-message__img{width:40px;height:40px;position:absolute;left:0;top:0}.el-message__icon{vertical-align:middle;margin-right:8px}.el-message__closeBtn{top:3px;right:0;position:absolute;cursor:pointer;color:#bfcbd9;font-size:14px}.el-message__closeBtn:hover{color:#97a8be}.el-message-fade-enter,.el-message-fade-leave-active{opacity:0;-ms-transform:translate(-50%,-100%);transform:translate(-50%,-100%)}
</style>