<template>
    <section>
        <div class="ecrw-in">
            <div class="ecrw-list clearfix">
                <div class="ecrw-list-media">
                    <div class="ecrw-list-resource">
                        <ecr-resource-viewer :item="resource" v-if="resource!=null"></ecr-resource-viewer>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import { getResource } from '../../api/api'

    export default {
        data() {
            return {
                resource: null
            }
        },
        methods: {
            load() {
                var resourceId = this.$route.params.id;
                getResource(resourceId).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.resource = res.data.responseEntity;
                    }
                });
            }
        },
        created() {
            this.load();
        }
    }
</script>

<style scoped lang="scss">
    @import '~scss_vars';

</style>