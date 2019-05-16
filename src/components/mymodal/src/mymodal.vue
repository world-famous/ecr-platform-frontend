<template>
	<transition name="modal">
		<div v-show="visible">
			<div class="ecrm-dialog-mask"></div>
			<div class="ecrm-dialog" style="transition: margin-left 4s ease-in-out 1s;">
				<div class="ecrm-dialog-title" v-if="title != ''">{{ title }}</div>
				<div class="ecrm-dialog-cont">
					<slot name="content"></slot>
				</div>
				<div class="ecrm-dialog-button">
					<a href="javascript:;" class="ecrm-dialog-enter" @click="onAction(1)">{{ btnPositive }}</a>
					<a href="javascript:;" class="ecrm-dialog-quit" @click="onAction(0)" v-if="btnNegative != ''">{{ btnNegative }}</a>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
    export default {
        props: {
            title: {
            	type:String,
            	required: false,
            	default: ''
            },
			btnPositive: {
				type: String,
				required: true
			},
			btnNegative: {
				type: String,
				required: false,
				default: ''
			}
        },
        watch: {
        	visible: function(val, oldVal) {
				this.$nextTick(function() {
					if (val == true) {
						var height = $(this.$el).find(".ecrm-dialog-cont").height() + 140;
						$(this.$el).find(".ecrm-dialog").css("margin-top", -height / 2 + "px");
					}
				});
			}
        },
        data: function () {
			return {
				visible: false
			}
        },
        computed: {
        },
        methods: {
	        openModal: function() {
				this.visible = true;
			},
			closeModal: function() {
				this.visible = false;
			},
			onAction: function(type) {
				if (type == 1) {
					this.$emit('positive');
				} else {
					this.$emit('negative');
				}
			}
        }
    }
</script>

<style scoped lang="scss">
.ecrm-dialog-mask{position:fixed;z-index:1000;top:0;left:0;width:100%;height:100%;background-color:rgba(0, 0, 0, .5);display:table;transition:opacity .3s ease;}
.ecrm-dialog{position:fixed;left:50%;top:50%;z-index:1001;background:#fff;width:400px;margin-left:-200px;padding-bottom:20px;box-shadow:0px 0px 5px #999;transition:all .3s ease;}
.ecrm-dialog-title{height:40px;line-height:40px;color:#fff;background:#07b9ad;padding-left:15px;font-size:16px;}
.ecrm-dialog-cont{padding:20px;max-height:500px;overflow-y:auto;}
.ecrm-dialog-textcont{text-align:center;color:#ff0000;font-size:16px;line-height:60px;}
.ecrm-dialog-button{text-align:center;}
.ecrm-dialog-button a{font-size:16px;height:40px;display:inline-block;width:120px;line-height:40px;text-align:center;border-radius:3px;margin-right:15px;}
.ecrm-dialog-enter{cursor:pointer;background:#0bc2b6;color:#fff;border:none;border-radius:2px;}
.ecrm-dialog-enter:hover{background:#13e2d5;}
.ecrm-dialog-quit{background:#f0f0f0;color:#666;}
.ecrm-dialog-quit:hover{background:#f0f0f0;color:#666;}

.modal-enter .ecrm-dialog,
.modal-leave-to .ecrm-dialog {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>