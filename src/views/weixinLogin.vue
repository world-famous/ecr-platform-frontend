<template>
	<h3>请稍等...</h3>
</template>

<script type="text/javascript">
    import { requestWeixin } from '../api/api';

	export default {
		methods: {

		},
		created() {
			var loginParams = {
                accredit_code: this.$route.query.accredit_code
			};
			requestWeixin(loginParams)
			.then((res) => {
				if (res.data.serverResult.resultCode == "200") {
                    // localStorage.setItem('isFirstLogin', 1);
                    this.user = res.data.responseEntity;
                    localStorage.setItem('frontend-user', JSON.stringify(this.user));
                    localStorage.setItem('frontend-token', this.user.token);
                    localStorage.setItem('afterLoginVisible', true);
                    //localStorage.setItem('badwords', this.user.badwords);
                    this.login.afterLoginVisible = true;
                    this.getBasketCount();
                    window.EventHub.$emit('loggedin', this.user);
                } else {
                    this.$message({
                        message: res.data.serverResult.resultMessage,
                        type: 'error'
                    });
                }
                this.$router.push('/home');
			})
			.catch(() => {
				this.$router.push('/home');
                    this.$message({
                        message: '登录失败',
                        type: 'error'
                    });
                });
		}
	}
</script>