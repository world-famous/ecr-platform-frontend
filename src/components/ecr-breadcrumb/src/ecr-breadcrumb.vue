<template>
    <section>
        <div class="ecrw-list-pos">
            <span class="ecrw-list-pos-index">您已经选择：</span>
            <span v-for="(step, idx) in steps" v-bind:data="step" v-bind:key="idx">
                <a href="javascript:;" class="ecrw-list-pos-href" @click="goPage(step)">{{ step.title }}</a>
                <span v-if="idx < steps.length - 1"> &gt; </span>
            </span>
        </div>
    </section>
</template>

<script>
    export default {
        props: {
            steps:Array,
            changeChapter: {
                type: Boolean,
                default: false
            }            
        },
        watch: {
        },
        data: function () {
            return {}
        },
        computed: {},
        methods: {
            goPage(step) {
                this.$router.push(step.url);
                
                // @author hong
                // check if resetFunction exists
                if (step.reset) {
                    step.reset();
                }
            }
        }
    }
</script>
<style scoped lang="scss">
    @import '~scss_vars';

</style>