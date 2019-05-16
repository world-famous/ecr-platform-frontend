<template>
    <section>
        <div class="ecrw-content-title ecrw-profile-right-title">账号充值</div>
        <div class="ecrw-profile-det">
            <table class="ecrw-profile-pay-table">            
                <tr>
                    <td class="ecrw-profile-pay-tdl">
                        当前积分： 
                    </td>

                    <td>
                        <span class="ecrw-color-red">{{myScore}}</span> 分（充值￥ 1={{ exchange }} 积分）
                    </td>
                </tr>

                <tr>
                    <td class="ecrw-profile-pay-tdl">
                        充值数量： 
                    </td>

                    <td>
                        选择金额（您可以选择￥100至￥1000之间的任何金额）
                        <div class="ecrw-profile-pay-change">

                            <span>
                                <a href="javascript:;" class="ecrw-profile-pay-change-num" :class="{ 'ecrw-profile-pay-change-num-sel':moneyValue == 100 }" @click="settingMoney(100)">100</a>
                            </span>
                            
                            <span>
                                <a href="javascript:;" class="ecrw-profile-pay-change-num" :class="{ 'ecrw-profile-pay-change-num-sel':moneyValue == 300 }" @click="settingMoney(300)">300</a>
                            </span>
                            <span>
                                <a href="javascript:;" class="ecrw-profile-pay-change-num" :class="{ 'ecrw-profile-pay-change-num-sel':moneyValue == 500 }" @click="settingMoney(500)">500</a>
                            </span>
                            <span>
                                <a href="javascript:;" class="ecrw-profile-pay-change-num" :class="{ 'ecrw-profile-pay-change-num-sel':moneyValue == 1000 }" @click="settingMoney(1000)">1000</a>
                            </span>
                            <span>
                                <input type="number" v-model="moneyValue" class="ecrw-profile-pay-form" placeholder="￥输入自定义金额" @keyup="detectDecimal($event)" style="width: 150px" min="100" max="1000" required @change="validate" />
                            </span>

                        </div>
                    </td>
                </tr>

                <tr>
                    <td class="ecrw-profile-pay-tdl">
                            选择支付方式： 
                    </td>

                    <td>
                        <a href="javascript:;" class="ecrw-profile-pay-href " :class="{ 'ecrw-profile-pay-change-num-sel':payMode == 0 }" @click="settingPayMode(0)">
                            <img src="static/images/ecrw-zfb.png"/>
                        </a>
                        <a href="javascript:;" class="ecrw-profile-pay-href " :class="{ 'ecrw-profile-pay-change-num-sel':payMode == 1 }" @click="settingPayMode(1)">
                            <img src="static/images/ecrw-wechat.png"/>
                        </a>
                    </td>
                </tr>

                <tr>
                    <td class="ecrw-profile-pay-tdl">
                    </td>

                    <td>
                        <!-- <a  href="javascript:;" class="ecrw-button ecrw-profile-pay-button" @click="payForScore" :loading="payLoading">立即充值</a> -->
                        <el-button type="primary" class="ecrw-button ecrw-profile-pay-button ecrw-pay-primary-button" @click="payForScore" :loading="payLoading">立即充值</el-button>
                        <a  :href="payProblemSolve[payMode]" target="__blank" class="ecrw-profile-pay-ques">充值问题咨询</a>   
                    </td>
                </tr>

                <tr>
                    <td class="ecrw-profile-pay-tdl">
                    </td>

                    <td>
                        <div class="ecrw-profile-gray">
                            在使用充值方式时，您务必仔细确认自己的账号并仔细选择相关操作选项。若因为您自身输入账号错误、操作不当或不了解充值计费方式等
                            因素造成充错账号、错选充值种类等情形而损害自身权益的，网站将不会作出任何补偿或赔偿。
                        </div>
                    </td>
                </tr>

            </table>
            
        </div>
    </section>
</template>

<script>
    import ECRUtil from '../../../common/js/util.js'
    import { getMyScore, chargeToAccount, getChargeExchange } from '../../../api/api'

    export default {
        data() {
            return {
                exchange: '',
                myScore: 0,
                moneyValue: 100,
                payMode: 0, // 0 - Alipay, 1 - Weixin
                payProblemSolve: [
                    'https://alipay.com/',
                    'https://weixin.com/'
                ],
                btnStatus: true,
                payLoading: false
            }
        },
        methods: {
            loadChargeExchange() {
                getChargeExchange().then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.exchange = res.data.responseEntity;
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.exchange = '?';
                    }
                }).catch(() => {
                    this.exchange = '?';
                });
            },
            settingMoney(money) {
                this.moneyValue = money;
            },
            settingPayMode(val) {
                this.payMode = val;
            },
            getMyScore1() {
                getMyScore().then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.myScore = parseInt(res.data.responseEntity);
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                        this.myScore = 0;
                    }
                }).catch(() => {
                    this.myScore = '?';
                    
                    this.$message({
                        message: '加载失败!',
                        type: 'error'
                    });
                });
            },
            validate() {
                this.btnStatus = true;
                if (this.moneyValue == '' || this.moneyValue < 100) {
                    this.moneyValue = 100;
                }
                if (this.moneyValue > 1000) {
                    this.moneyValue = 1000;
                }
                if(this.moneyValue != parseInt(this.moneyValue)) {
                    this.btnStatus = false;
                }
            },
            detectDecimal(evt) {
                this.btnStatus = true;
                if (this.moneyValue != '' && this.moneyValue < 0) {
                    this.moneyValue = 100;
                }
                if (this.moneyValue > 1000) {
                    this.moneyValue = 1000;
                }
                if(this.moneyValue != parseInt(this.moneyValue)) {
                    this.btnStatus = false;
                }

                // evt = (evt) ? evt : window.event;
                // var charCode = (evt.which) ? evt.which : evt.keyCode;
                // if ((charCode > 31 && (charCode < 48 || charCode > 57)) ) {
                //     evt.preventDefault();
                // } else {
                //     return true;
                // }
            },
            payForScore() {
                // Payment Gateway Navigation on Here...
                // It is assumed to be charge on gateway...
                let params = {
                    cost:this.moneyValue,
                    paymode:this.payMode==0?'alipay':'wechat',
                    transinfo: {}
                };
                this.payLoading = true;
                if (!this.btnStatus) {
                    this.payLoading = false;
                    this.$message({
                        message: '不能输入小数',
                        type: 'error'
                    });    
                    return;
                }
                chargeToAccount(params).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.payLoading = false;
                        this.$router.push('/mycenter/charge/log');
                    } else {
                        this.payLoading = false;
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        });
                    }
                }).catch(() => {
                    this.payLoading = false;
                    this.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
            }
        },
        created() {
            ECRUtil.authenticate(this.$router, '/home');
            this.getMyScore1();
            this.loadChargeExchange();
        }
    }
</script>

<style scoped lang="scss">
    @import '~scss_vars';
    .ecrw-pay-primary-button {margin-right: 65px;padding: 8px 90px;}
</style>