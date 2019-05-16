<template>
    <section>
        <div id="docviewer" ref="docviewer"></div>
    </section>
</template>

<script>
    export default {
        props: {
            path: String
        },
        data() {
            return {
                viewer: null
            }
        },
        watch: {
            path: function(val, oldval) {
                this.init();
            }
        },
        methods: {
            init() {
                if (this.viewer != null) {
                    $(this.$refs.docviewer).html("");
                }
                this.viewer = $(this.$refs.docviewer).docViewer({
                    width: '100%',
                    height: '100%',
                    filePath: 'fs/media' + this.path
                });
            }
        },
        mounted() {
            this.init();
        }
    }
</script>

<style scoped lang="scss">
    section {
        width: 100%;
        height: 100%;
    }
    #docviewer {
        width:100%;
        height: 100%;
    }
</style>