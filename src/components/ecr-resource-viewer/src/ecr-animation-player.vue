<template>
    <section>
        <object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" id="objFlash">
            <param name="movie" :value="url">
            <param name="quality" value="high">
            <param name="bgcolor" value="#869ca7">
            <embed :src="url" quality="high" bgcolor="#869ca7" name="" play="false" loop="false" type="application/x-shockwave-flash" align="middle">
        </object>
    </section>
</template>

<script>
    export default {
        props: {
            path: String
        },
        computed: {
            url() {
                return ECO_MEDIA_PATH + this.path;
            }
        }
    }
</script>

<style scoped lang="scss">
    section {
        width: 100%;
        height: 100%;
    }
    #objFlash {
        width:100%;
        height: 100%;
        embed {
            width:100%;
            height: 100%;
        }
    }
</style>