<template>
	<section>
	</section>
</template>

<script>
    import ECRUtil from '../../../common/js/util.js'
    
	export default {
		data() {
			return {
			}
		},
		methods: {
		},
		created() {
			ECRUtil.authenticate(this.$router, '/home');
		},
		mounted() {
		}
	}
</script>

<style scoped lang="scss">
	@import '~scss_vars';

</style>