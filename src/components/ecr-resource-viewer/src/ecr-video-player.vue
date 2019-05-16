<template>
    <section id="vcontainer">
    </section>
</template>

<script>
    import { checkConvertUrl } from '../../../api/api';
    export default {
        props: {
            path: String
        },
        watch: {
            path: function(val, oldval) {
                this.remount(val);
            }
        },
        methods: {
            remount(path) {
                if ($('#vplayer').length > 0) {
                    videojs('vplayer').dispose();
                    $('#vplayer').remove();
                }

                checkConvertUrl(path).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        path = ECO_MEDIA_PATH + (res.data.responseEntity);

                        var type = path.substring(path.lastIndexOf(".") + 1);
                        if (type == "m3u8") {
                            type = "application/x-mpegURL";
                        } else {
                            type = "video/mp4";
                        }

                        var videoTag = '<video id="vplayer" class="video-js vjs-default-skin" controls preload="auto" data-setup="{}">\
                                <source src="' + path + '" type="' + type + '">\
                            </video>';

                        // Need To Clear This Block
                        $("#vcontainer").append(videoTag);
                        videojs('vplayer');
                        videojs('vplayer').dispose();
                        $('#vplayer').remove();
                        //

                        $("#vcontainer").append(videoTag);
                        videojs('vplayer');

                        let _this = this;
                        this.$nextTick(function() {
                            var marginTop = document.getElementById("vcontainer").clientHeight / 2;
                            $("#vcontainer .vjs-big-play-button").css("margin-top", "calc(" + marginTop + "px - 1em)");
                        });
                    } else {
                        message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                    }
                });
                
            },
        },
        mounted() {
            this.remount(this.path);
        }
    }
</script>

<style scoped lang="scss">
    section {
        width: 100%;
        height: 100%;
    }
</style>

<style>
    #vplayer {
        width: 100%;
        height: 100%;
        background-color: black;
    }
</style>