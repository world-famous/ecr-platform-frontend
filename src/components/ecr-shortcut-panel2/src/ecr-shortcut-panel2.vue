<template>
    <div class="ecrw-right-wrap ecrw-right-wrap-resource">
        <ul>
            <li class="ecrw-right-li" :class="ECRUtil.resourceType(item.resource[itemTypeKey])" v-for="(item,idx) in items" :key="idx" :data="item">
                <div class="ecrw-right-file">
                    <span class="ecrw-file-cat">[{{ ECRUtil.resourceLabel(item.resource[itemTypeKey]) }}]</span>
                    <a :href="'resource/' + item.resource[itemIdKey]" @click="onClickItem" target="_blank">
                        {{ item.resource[itemTitleKey] }}
                    </a>
                    <span class="ecrw-right-time">
                        {{ duration(item.resource) }}
                </span>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
    import ECRUtil from '../../../common/js/util.js';

    export default {
        props: {
            items:Array,
            step:String,
            itemTitleKey:String,
            itemTypeKey:String,
            itemIdKey:String
        },
        data: function () {
            return {
                ECRUtil:ECRUtil
            }
        },
        methods: {
            //            Author : GOD 2019-2-18 Bug ID: #803
            duration(item) {
                var createTime = new Date(item.createtime).getTime();
                var nowTime = new Date().getTime();
                var countDate = Math.floor((nowTime - createTime) / (3600 * 24 * 1000));
                
                if(countDate > 365) {
                    return Math.floor(countDate / 365) + '年前';
                } else if(countDate < 365 && countDate > 30) {
                    return Math.floor(countDate / 30) + '月前';
                } else if (countDate < 30 && countDate > 0) {
                    return countDate + '天前';
                } else if (countDate == 0 && countDate * 24 > 0) {
                    return (Math.floor((nowTime - createTime) / (3600 * 1000))) + '时前';
                } else {
                    return '刚才';
                }
            },
            //            Author : GOD 2019-2-18 Bug ID: #803
            onClickItem() {
                var steps = JSON.parse(localStorage.getItem("step"));
                steps.push({
                    title:this.step
                });
                localStorage.setItem("step", JSON.stringify(steps));
            }
        }
    }
</script>