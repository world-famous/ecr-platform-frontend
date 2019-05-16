<template>
    <section>
        <canvas id="canvas" style="width: 100%; height: 100%;">
            <img :src="url"></img>
        </canvas>
    </section>
</template>

<script>
    export default {
        props: {
            path: String
        },
        data() {
            return {
                canvas: null,
                WATERMARKIMG_URL: WATERMARKIMG_URL
            }
        },
        computed: {
            url() {
                if (this.canvas != null) {
                    this.createImage();
                }
                return;
            }
        },
        methods: {
            createImage() {
                var img = new Image();
                var canvas = document.getElementById('canvas');
                canvas.width = canvas.offsetWidth;
                canvas.height = canvas.offsetHeight;
                this.canvas = canvas;
                var context = canvas.getContext('2d');
                var _this = this;
                img.addEventListener('load', function() {
                    context.drawImage(img, 0, 0, canvas.width, canvas.height);

                    _this.addWatermark(20, 10, canvas, context);
                }, false);
                img.src = ECO_MEDIA_PATH + this.path;
            },
            addWatermark(x, y, canvas) {
                var context = canvas.getContext('2d');
                var img = new Image();
                var _this = this;
                img.addEventListener('load', function() {
                    context.drawImage(img, x, y);
                    _this.uploadContext(canvas);
                }, false);
                //watermark image////////
                img.src = WATERMARKIMG_URL;
                ///////////////////////
            },
            uploadContext() {
                var img = this.canvas.toDataURL('image/png');
            }
        },
        mounted() {
            this.createImage();
        }
    }
</script>

<style scoped lang="scss">
    section {
        width: 100%;
        height: 100%;
    }
    img {
        width:100%;
        height: 100%;
    }
</style>