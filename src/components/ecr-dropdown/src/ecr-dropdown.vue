<template>
    <li class="ecrw-content-hot-addr-li" @mouseleave="toggle=false">
        <a href="javascript:;" class="ecrw-content-hot-select" @mouseover="toggle=true">{{ selectedItem==null?title:selectedItem[itemLabelKey] }}</a>
        <div class="ecrw-content-hot-addr" v-if="toggle">
            <ul>
                <li class="ecrw-content-hot-det-li" v-for="(item, idx) in items" :key="idx" :data="item" @click="onItemSelected(item)">
                    <a href="JavaScript:;">{{ item[itemLabelKey] }}</a>
                </li>
            </ul>
        </div>
    </li>
</template>

<script>
	export default {
        props: {
            title: String,
            items: Array,
            itemLabelKey: String
        },
		data() {
			return {
                toggle: false,
                selectedItem: null
			}
		},
		methods: {
            onItemSelected(item) {
                this.selectedItem = item;
                this.toggle = false;
                this.$emit('item-select', item);
            }
		}
	}
</script>
<style scoped lang="scss">
    @import '~scss_vars';

</style>