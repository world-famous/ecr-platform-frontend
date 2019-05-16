<template>
	<section>
        <div :class="{ 'collapsed':iscollapsed, 'uncollapsed':!iscollapsed }" style="position:relative;padding-right:30px;display:inline-block;width:100%">
            <div ref="content">
                <a ref="handler" :class="{ 'ecrw-banner-left-tdl-up':iscollapsed, 'ecrw-banner-left-tdl-down':!iscollapsed }" style="display:none" @click="toggle()"></a>
                <span v-for="(item , idx) in items" v-bind:data="item" v-bind:key="idx" style="line-height:24px;">
                    <a href="javascript:;" class="ecrw-ready-banner-href" :class="{ 'ecrw-ready-banner-sel':item===selected}" @click="handleClick(item, true)">
                        {{item[value]}}
                    </a>
                </span>
            </div>
        </div>
	</section>
</template>

<script>
    export default {
        props: {
            items:Array,
            value: String,
            identifier: {
                type: String,
                default: 'dictvalue',
                required: false
            },
            single: {
                type: Boolean,
                default: true
            }
        },
        watch: {
            items(val, old) {
                let _this = this;
                this.$nextTick(function() {
                    if ($(_this.$refs.content).height() > 26) {
                        $(_this.$refs.handler).show();
                    } else {
                        $(_this.$refs.handler).hide();
                    }
                });
            }
        },
        data: function () {
            return {
                selected:null,
                clicked:null,
                iscollapsed: true
            }
        },
        methods: {
            toggle() {
                this.iscollapsed = !this.iscollapsed;
            },
            handleClick(val, byuser) {
                this.clicked = val;
                if(this.selected != this.clicked) {
                    this.selected = this.clicked;
                } 
                else if(this.selected == this.clicked) {
                    this.selected = null;
                    val = null;
                }
                this.$emit('button-click', val, byuser);
            },
            set(val) {
                for (var i=0; i<this.items.length; i++) {
                    if (val == this.items[i][this.identifier]) {
                        this.handleClick(this.items[i], false);
                        break;
                    }
                }
            }
        },
        created() {
        }
    }
</script>

<style scoped>
    .ecrw-banner-left-tdl-down {
        position:absolute;
        right:0px;
        background: url(../../../../static/images/ecrw-arr-upper.png) no-repeat right center;
        height: 26px;
        width: 12px;
        cursor: pointer;
    }
    .ecrw-banner-left-tdl-up {
        position:absolute;
        right:0px;
        background: url(../../../../static/images/ecrw-arr-down.png) no-repeat right center;
        height: 26px;
        width: 12px;
        cursor: pointer;
    }
    .collapsed {
        width:100%;
        height:26px;
        overflow-y:hidden;
    }
    .uncollapsed {
        width:100%;
    }
</style>