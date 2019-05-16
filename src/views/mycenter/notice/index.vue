<template>
    <section>
        <div class="ecrw-profile-content">
            <div class="ecrw-content-title ecrw-profile-right-title">通知</div>
            <div class="ecrw-profile-det">
                <img src="static/images/ecrw-empty-data-resource.png" :style="{ width:(imageSize.width) + 'px', height:(imageSize.height) + 'px' }" v-if="myMessages.length==0">
                <div class="ecrw-profile-information">
                    <ul>
                        <li class="ecrw-information-li" :class="{'background-gray' : !message.readTime, 'background-blue' : message.readTime}" v-for="(message,idx) in myMessages" :key="idx" :data="message">
                            <table>
                                <tr>
                                    <td class="ecrw-information-li-td1">
                                        <a href="javascript:;" @click="setRead(message)">
                                            <img :src="getAvatarPath(message)"/>
                                        </a>
                                    </td>
                                    <td class="ecrw-information-li-td2">
                                        {{ message.senderName }}
                                    </td>
                                    <td class="ecrw-information-li-td3">
                                        <ul>
                                            <li class="ecrw-information-li-desc">
                                                {{ message.content }}
                                            </li>
                                            <li class="ecrw-information-li-time">
                                                {{ ECRUtil.formatDate.format(new Date(message.sendTime), 'y-M-d hh:mm') }}
                                            </li>
                                        </ul>
                                    </td>
                                </tr>
                            </table>
                        </li>
                    </ul>
                </div>
                <el-col :span="24" style="margin-bottom: 50px; margin-top: 30px;">
                    <my-pagination @current-change="handleCurrentChange" :page="page" :page-size="page_size" :total="total"></my-pagination>
                </el-col>
            </div>
        </div>
    </section>
</template>

<script>
    import ECRUtil from '../../../common/js/util.js'
    import { getUnReadMsgCount, getMsgList, getUnReadMsgList, setRead } from '../../../api/api'
    
    export default {
        data() {
            return {
                myMessages: [],
                ECRUtil: ECRUtil,
                unReadMessages: [],
                loginInfo: {
                    name: '',
                    userid: ''
                },
                unreadmsgcount: 0,
                total: 0,
                page: 1,
                page_size: 5,
                imageSize: {
                    width: 0,
                    height: 0
                }
            }
        },
        methods: {
            getAvatarPath(notice) {
                if (notice.filepath == null) return '../../../../static/images/ecrw-head-big.png';
                return ECO_MEDIA_PATH + notice.filepath;
            },
            load() {
                this.getUnReadMsgCount();
                this.getMsgList();
                this.getUnReadMsgList();
            },
            getUnReadMsgList() {
                let params = 
                    'userId=' + this.loginInfo.userid
                    + '&' + 
                    'messageType=' + '2'
                    + '&' +
                    'pageNum=' + this.page
                    + '&' +
                    'pageSize=' + this.page_size;

                getUnReadMsgList(params).then((res) => {
                    if (res.result == "200") {
                        this.unReadMessages = res.data;
                    } else {
                        this.myMessages = [];
                        this.$message({
                            message: '加载失败!',
                            type: 'error'
                        });
                    }
                }).catch(() => {
                    this.myMessages = [];
                    this.$message({
                        message: '加载失败!',
                        type: 'error'
                    });
                });
            },
            getUnReadMsgCount() {
                let params = 
                    'userId=' + this.loginInfo.userid 
                    + '&' + 
                    'messageType=' + '2';
                getUnReadMsgCount(params).then((res) => {
                    if (res.result == "200") {
                        this.unreadmsgcount = res.unReadCount;    
                    } else {
                        this.unreadmsgcount = 0;
                        this.$message({
                            message: '加载失败!',
                            type: 'error'
                        });
                    }
                }).catch(() => {
                    this.unreadmsgcount = 0;
                    this.$message({
                        message: '加载失败!',
                        type: 'error'
                    });
                });
            },
            getMsgList() {
                let params = 
                    'userId=' + this.loginInfo.userid
                    + '&' + 
                    'messageType=' + '2'
                    + '&' +
                    'pageNum=' + this.page
                    + '&' +
                    'pageSize=' + this.page_size;

                getMsgList(params).then((res) => {
                    if (res.result == "200") {
                        this.myMessages = res.data;
                        this.total = res.data.length;
                    } else {
                        this.myMessages = [];
                        this.$message({
                            message: '加载失败!',
                            type: 'error'
                        });
                    }
                    this.imageSize.width = $('.ecrw-profile-det').width();
                    this.imageSize.height = 610;
                }).catch(() => {
                    this.myMessages = [];
                    this.$message({
                        message: '加载失败!',
                        type: 'error'
                    });
                });
            },
            setRead(message) {
                if (message.readTime) {
                    let params =
                    'userId=' + this.loginInfo.userid
                    + '&' + 
                    'messageId=' + message.messageId;
                    setRead(params).then((res) => {
                        if (res.result == "200") {
                            this.load();
                            this.$message({
                                message: '加载成功!',
                                type: 'success'
                            });
                        } else {
                            this.$message({
                                message: '加载失败!',
                                type: 'error'
                            });
                        }
                    }).catch(() => {
                        this.$message({
                            message: '加载失败!',
                            type: 'error'
                        });
                    });
                } else {
                    this.$message({
                        message: '已经阅读了!',
                        type: 'warning'
                    });
                    return;
                }
                
            },
            // deleteMsg() {
            //     let params =
            //         'userId=' + this.loginInfo.userid
            //         + '&' + 
            //         'messageId=' + messageId;
            //     deleteMsg(params).then((res) => {
            //         if (res.result == "200") {
            //             this.load();
            //             this.$message({
            //                 message: '加载成功!',
            //                 type: 'success'
            //             });
            //         } else {
            //             this.$message({
            //                 message: '加载失败!',
            //                 type: 'error'
            //             });
            //         }
            //     }).catch(() => {
            //         this.$message({
            //             message: '加载失败!',
            //             type: 'error'
            //         });
            //     });
            // },
            handleCurrentChange(val) {
                this.page = val;
                this.load();
            }
        },
        created() {
            ECRUtil.authenticate(this.$router, '/home');
            var user = localStorage.getItem('frontend-user');
            if (user != null) {
                this.loginInfo.name = JSON.parse(user).realName;
                this.loginInfo.userid = JSON.parse(user).userId;
            }
            this.load();
        }
    }
</script>

<style scoped lang="scss">
    @import '~scss_vars';
    .background-blue {
        background: #00beb2;
    }
    .background-gray {
        background: lightgray;
    }
</style>