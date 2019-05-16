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
		                    <span class="ecrw-color-red">{{userAccount}}</span> 分
		                    （充值￥ 1=10 积分）
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
		                            <a href="javascript:;" class="ecrw-profile-pay-change-num" :class="{ 'ecrw-profile-pay-change-num-sel':moneyValue == '100' }" @click="settingMoney(100)">100</a>
		                        </span>
		                        
		                        <span>
		                            <a href="javascript:;" class="ecrw-profile-pay-change-num" :class="{ 'ecrw-profile-pay-change-num-sel':moneyValue == '300' }" @click="settingMoney(300)">300</a>
		                        </span>
		                        <span>
		                            <a href="javascript:;" class="ecrw-profile-pay-change-num" :class="{ 'ecrw-profile-pay-change-num-sel':moneyValue == '500' }" @click="settingMoney(500)">500</a>
		                        </span>
		                        <span>
		                            <a href="javascript:;" class="ecrw-profile-pay-change-num" :class="{ 'ecrw-profile-pay-change-num-sel':moneyValue == '1000' }" @click="settingMoney(1000)">1000</a>
		                        </span>
		                        <span>
		                            <input type="number" v-model="moneyValue" class="ecrw-profile-pay-form" placeholder="￥输入自定义金额" min="0"/>
		                        </span>

		                    </div>
		            </td>
		        </tr>

		        <tr>
		            <td class="ecrw-profile-pay-tdl">
		                    选择支付方式： 
		            </td>

		            <td>
		                <a href="javascript:;" class="ecrw-profile-pay-href " :class="{ 'ecrw-profile-pay-change-num-sel':payMode == '1' }" @click="settingPayMode(1)">
		                    <img src="static/images/ecrw-zfb.png"/>
		                </a>
		                <a href="javascript:;"  class="ecrw-profile-pay-href " :class="{ 'ecrw-profile-pay-change-num-sel':payMode == '2' }" @click="settingPayMode(2)">
		                    <img src="static/images/ecrw-wechat.png"/>
		                </a>
		            </td>
		        </tr>

		        <tr>
		            <td class="ecrw-profile-pay-tdl">
		            </td>

		            <td>
		                <a  href="javascript:;" class="ecrw-profile-pay-button">立即充值</a>
		                <a  href="javascript:;"  class="ecrw-profile-pay-ques">充值问题咨询</a>   
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
	export default {
		data() {
			return {
				userAccount: '10000',
				moneyValue: '100',
				payMode: '1',
			}
		},
		methods: {
			settingMoney(money) {
				this.moneyValue = money;
			},
			settingPayMode(val) {
				this.payMode = val;
			}
		},
		mounted() {
		}
	}
</script>

<style scoped lang="scss">
	@import '~scss_vars';

</style>