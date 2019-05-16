<template>
    <section>
        <div class="ecrw-content-title ecrw-profile-right-title">
            <div class="ecrm-profile-title-right">
                <span>
                        当前积分： <span class="ecrw-color-green">548</span> 分
                </span>                    
                <span>
                        <span class="ecrw-color-green">如何赚取积分？</span>
                </span>                 
            </div>
            积分明细
        </div>

        <div class="ecrw-profile-det">            
            <div class="ecrw-profile-tab">
                <ul class="clearfix">
                    <li class="ecrw-dao-li" v-for="(kind,idx) in kinds" :key="idx" :data="kind" style="min-width: 10%">
                        <a href="javascript:;" class="ecrw-profile-tab-href" :class="{ 'ecrw-profile-tab-sel':curKind==kind.id }" @click="load(kind.id)" >
                            {{ kind.name }}
                        </a>
                    </li>
                </ul>              
                
            </div>

            <div class="ecrw-profile-det-intro">
                <ul>
                    <li class="ecrw-profile-det-li">
                        <span class="">
                                积分时间：
                        </span>

                        <span class="ecrw-profile-time">
                            <input type="text" class="ecrw-profile-text"/> 
                            -   
                            <input type="text" class="ecrw-profile-text"/> 

                            <a href="javascript:;" class="ecrw-profile-enter">查询</a>

                        </span>
                        
                    </li>

                </ul>
            </div>

            <div class="ecrw-profile-table-wrap">
                <div class="ecrw-profile-det-det">
                    <table class="ecrw-profile-det-table">

                        <tr>
                            <th>积分操作</th>
                            <th>积分形式</th>
                            <th>操作时间</th>
                            <th>积分变化</th>
                        </tr>

                        <tr>
                            <td>登录「资源中心」</td>
                            <td>日常积分</td>
                            <td>2018-05-20  15：00：40</td>
                            <td>
                                <span class="ecrw-color-green">
                                        +2
                                </span>
                            </td>
                        </tr>


                        <tr>
                            <td>登录「资源中心」</td>
                            <td>日常积分</td>
                            <td>2018-05-20  15：00：40</td>
                            <td>
                                <span class="ecrw-color-green">
                                        +2
                                </span>
                            </td>
                        </tr>

                        <tr>
                            <td>登录「资源中心」</td>
                            <td>日常积分</td>
                            <td>2018-05-20  15：00：40</td>
                            <td>
                                <span class="ecrw-color-green">
                                        +2
                                </span>
                            </td>
                        </tr>

                        <tr>
                            <td>登录「资源中心」</td>
                            <td>日常积分</td>
                            <td>2018-05-20  15：00：40</td>
                            <td>
                                <span class="ecrw-color-green">
                                        +2
                                </span>
                            </td>
                        </tr>

                        <tr>
                            <td>登录「资源中心」</td>
                            <td>日常积分</td>
                            <td>2018-05-20  15：00：40</td>
                            <td>
                                <span class="ecrw-color-green">
                                        +2
                                </span>
                            </td>
                        </tr>




                    </table>
                </div>
                
            </div>


            
            <div class="ecrw-ready-page">
                <a href="javascript:;" class="ecrw-ready-page-href">首页</a>
                <a href="javascript:;" class="ecrw-ready-page-href">上一页</a>
                <a href="javascript:;" class="ecrw-ready-page-href">1</a>
                <a href="javascript:;" class="ecrw-ready-page-href ecrw-ready-page-sel">2</a>
                <a href="javascript:;" class="ecrw-ready-page-href">3</a>
                <a href="javascript:;" class="ecrw-ready-page-href">4</a>
                <a href="javascript:;" class="ecrw-ready-page-href">5</a>
                <a href="javascript:;" class="ecrw-ready-page-href">...</a>
                <a href="javascript:;" class="ecrw-ready-page-href">下一页</a>
                <a href="javascript:;" class="ecrw-ready-page-href">末页</a>
                <span class="ecrw-ready-page-text">
                    共<span>23453</span>条
                </span>
                <span class="ecrw-ready-page-form">
                    到<input type="text" class="ecrw-ready-page-wenben"/>页
                </span>
                <a href="javascript:;" class="ecrw-ready-page-enter">确定</a>
            </div>

        </div>
    </section>
</template>

<script>
    import ECRUtil from '../../../common/js/util.js'
    
    export default {
        data() {
            return {
                kinds: [
                    { id:1, name:'全部' },
                    { id:2, name:'日常积分' },
                    { id:3, name:'数学积分' },
                    { id:4, name:'数学活动积分' },
                    { id:5, name:'资源积分' },
                    { id:6, name:'教研积分' },
                    { id:7, name:'课外积分' },
                    { id:8, name:'社区积分' }
                ],
                curKind:'1',
                
            }
        },
        methods: {
            load(kind) {
                this.curKind = kind;
            },
            
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