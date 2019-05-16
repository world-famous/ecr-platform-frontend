<template>
	<section>
		<div class="ecrw-in">
	        <div class="ecrw-ready ">
	            <ecr-breadcrumb :steps="steps"></ecr-breadcrumb>
                <ecr-grade 
                    @school-section-change="onSchoolSectionChange" 
                    @subject-change="onSubjectChange" 
                    @grade-change="onGradeChange" 
                    @book-model-change="onBookModelChange" 
                    @edition-type-change="onEditionTypeChange">
                </ecr-grade>
	            <div class="ecrw-ready-wrap">
	            	<div class="ecrw-ready-wrap-left">
                        <ecr-course ref="courseTree" @item-select="onCourseSelect" @item-deselect="onCourseDeselect"></ecr-course>
                    </div>
                    <div class="ecrw-ready-wrap-right">
			            <div class="ecrw-ready-bk-tab">
	                        <ul>
	                        	<li class="ecrw-ready-bk-li" v-for="(contenttype,idx) in contenttypes" :key="idx" :data="contenttype">
			                        <a href="javascript:;" class="ecrw-ready-bk-href " :class="{ 'ecrw-ready-bk-sel':contenttypeid==contenttype.id }" @click="load('', contenttype.id)">
			                            {{ contenttype.name }}
			                        </a>
			                    </li>
	                        </ul>
	                    </div>

		                <div class="ecrw-exam-tab clearfix">
		                    <div class="ecrw-exam-search">
		                        <span>共为您找到 {{ total }} 份试卷</span>
		                        <span>
		                            <input type="text" class="ecrw-exam-search-text" placeholder="在结果内搜索" v-model="searchKey" @keyup.enter="search"/>
		                            <input type="button" class="ecrw-button ecrw-exam-search-button" value="搜索" @click="search"/>
		                        </span>
		                    </div>
		                    <div class="ecrw-exam-tab-wrap">
		                        <ul>
		                            <li class="ecrw-exam-tab-wrap-li" @click="sortBy('推荐排序')">
		                                <a href="javascript:;" :class="{ 'ecrw-exam-tab-wrap-sel':sort_by=='推荐排序' }">
		                                    推荐排序
		                                </a>
		                            </li>
		                            <li class="ecrw-exam-tab-wrap-li" @click="sortBy('最新上传')">
		                                <a href="javascript:;" :class="{ 'ecrw-exam-tab-wrap-sel':sort_by=='最新上传' }">
		                                    最新上传
		                                </a>
		                            </li>
		                            <li class="ecrw-exam-tab-wrap-li" @click="sortBy('最受欢迎')">
		                                <a href="javascript:;" :class="{ 'ecrw-exam-tab-wrap-sel':sort_by=='最受欢迎' }">
		                                    最受欢迎
		                                </a>
		                            </li>
		                            <li class="ecrw-exam-tab-wrap-li" @click="sortBy('名校精品')">
		                                <a href="javascript:;" :class="{ 'ecrw-exam-tab-wrap-sel':sort_by=='名校精品' }">
		                                    名校精品
		                                </a>
		                            </li>
		                        </ul>
		                    </div>
		                </div>
		                <div class="ecrw-exam-content">
		                    <div class="ecrw-exam-content-wrap">
		                    	<ecr-resource v-for="(item, idx) in data"
		                    		:key="idx"
		                    		:data="item"
			                    	:goods="item">
	                    		</ecr-resource>
		                        <my-pagination @current-change="onChangePage" :page-size="page_size" :total="total"></my-pagination>
		                    </div>
		                </div>
		            </div>
	            </div>
	        </div>
	    </div>
	</section>
</template>

<script>
	import { getGoodsList } from '../../api/api'

	export default {
		data() {
			return {
				page: 1,
				page_size: 5,
				contenttypes: [
                    { id:'', name:'全部' },
                    { id:'K', name:'课件' },
                    { id:'T1', name:'教学设计' },
                    { id:'T2', name:'拓展文本' },
                    { id:'T3', name:'试卷' },
                    { id:'P', name:'图片' },
                    { id:'V', name:'视频' },
                    { id:'M', name:'音频' },
                    { id:'C', name:'动画' }/*,
                    { id:'E', name:'电子书' }*/
                ],
                contenttypeid: '',
				kind: '',
				total: 0,
				sort_by: '推荐排序',
				steps:[],
				data:[],
				searchKey:'',
                selectedItems: {
                    subjectid: '',
                    schoolsectionid: '',
                    gradeid: '',
                    bookmodelid: '',
                    editiontypeid: ''
                }
			}
		},
		methods: {
			load(searchKey, contenttypeid) {
				this.searchKey = searchKey;
				this.contenttypeid = contenttypeid;

				this.steps = [
					{
						title:'首页',
						url:'#/home'
					},
					{
						title:'同步资源',
						url:'#/teaching'
					}
				];

				let params = {
                    pagination:{
                        numPerPage:this.page_size,
                        pageNo:this.page
                    },
                    conditions: [
                        {
                            fieldName: 'onelabel',
                            fieldValues: [
                                '同步资源'
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        },
                        {
                            fieldName: 'twolabel',
                            fieldValues: [
                                '生字动画资源'
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childConditions: null
                        },
                        {
                            fieldName: 'contenttype',
                            fieldValues: [
                                this.contenttypeid
                            ],
                            prepender: null,
                            operator: 'EQUAL',
                            childConditions: null
                        },
                        {
                        	fieldName: 'searchkey',
                            fieldValues: [
                                searchKey
                            ],
                            prepender: null,
                            operator: 'FUZZY_MATCH',
                            childConditions: null
                        }
                    ],
					orderMethods: [
						{
							field: this.sort_by,
							method: 'DESC'
						}
					]
                };
                if (this.kind == 'new') {
					this.steps.push({
						title:'生字动画资源',
						url:'#/teaching/new'
					});
					params.conditions[1].fieldValues[0] = '生字动画资源';
				} else if (this.kind == 'material') {
					this.steps.push({
						title:'课件教案资源',
						url:'#/teaching/material'
					});
					params.conditions[1].fieldValues[0] = '课件教案资源';
				} else if (this.kind == 'media') {
					this.steps.push({
						title:'影音资源',
						url:'#/teaching/media'
					});
					params.conditions[1].fieldValues[0] = '影音资源';
				} else if (this.kind == 'image') {
					this.steps.push({
						title:'图片资源',
						url:'#/teaching/image'
					});
					params.conditions[1].fieldValues[0] = '图片资源';
				} else if (this.kind == 'other') {
					this.steps.push({
						title:'拓展资源',
						url:'#/teaching/other'
					});
					params.conditions[1].fieldValues[0] = '拓展资源';
				}
//				sessionStorage.setItem('step', JSON.stringify(this.steps));
				localStorage.setItem('step', JSON.stringify(this.steps));

				if (this.selectedItems.subjectid != null && this.selectedItems.subjectid != '') {
					params.conditions.push({
							fieldName: 'subjectid',
							fieldValues: [ this.selectedItems.subjectid ],
				    		prepender: null,
				            operator: 'EQUAL',
				            childCondtions: null
						});
				}
				if (this.selectedItems.schoolsectionid != null && this.selectedItems.schoolsectionid != '') {
					params.conditions.push({
							fieldName: 'schoolsectionid',
							fieldValues: [ this.selectedItems.schoolsectionid ],
				    		prepender: null,
				            operator: 'EQUAL',
				            childCondtions: null
						});
				}
				if (this.selectedItems.gradeid != null && this.selectedItems.gradeid != '') {
					params.conditions.push({
							fieldName: 'gradeid',
							fieldValues: [ this.selectedItems.gradeid ],
				    		prepender: null,
				            operator: 'EQUAL',
				            childCondtions: null
						});
				}
				if (this.selectedItems.bookmodelid != null && this.selectedItems.bookmodelid != '') {
					params.conditions.push({
							fieldName: 'bookmodelid',
							fieldValues: [ this.selectedItems.bookmodelid ],
				    		prepender: null,
				            operator: 'EQUAL',
				            childCondtions: null
						});
				}
				if (this.selectedItems.editiontypeid != null && this.selectedItems.editiontypeid != '') {
					params.conditions.push({
							fieldName: 'editiontypeid',
							fieldValues: [ this.selectedItems.editiontypeid ],
				    		prepender: null,
				            operator: 'EQUAL',
				            childCondtions: null
						});
				}
                if (this.$refs.courseTree != null && 
                    this.$refs.courseTree.selectedItem != null) {
                    params.conditions.push({
                            fieldName: 'catalogids',
                            fieldValues: this.$refs.courseTree.selectedItem.catalogids,
                            prepender: null,
                            operator: 'EQUAL',
                            childCondtions: null
                        });
                }
                getGoodsList(params).then((res) => {
                	if (res.data.serverResult.resultCode == "200") {
                    	this.data = res.data.pageInfo.list;
                    	this.total = res.data.pageInfo.total;
                    } else {
                    	this.data = [];
                    	this.total = 0;
                    }
                });
			},
			search() {
				this.load(this.searchKey, this.contenttypeid);
			},
			sortBy(sort_by) {
				this.sort_by = sort_by;
				this.load(this.searchKey, this.contenttypeid);
			},
			onChangePage(page) {
				this.page = page;
				this.load(this.searchKey, this.contenttypeid);
			},
            onSchoolSectionChange: function(val) {
                this.selectedItems.schoolsectionid = val.schoolsectionid;
                this.onGradeChanged();
            },
            onSubjectChange: function(val) {
                this.selectedItems.subjectid = val.subjectid;
                this.onGradeChanged();
            },
            onGradeChange: function(val) {
                this.selectedItems.gradeid = val.gradeid;
                this.onGradeChanged();
            },
            onBookModelChange: function(val) {
                this.selectedItems.bookmodelid = val.bookmodelid;
                this.onGradeChanged();
            },
            onEditionTypeChange: function(val) {
                this.selectedItems.editiontypeid = val.editiontypeid;
                this.onGradeChanged();
            },
            onGradeChanged() {
                this.$refs.courseTree.loadChapter(this.selectedItems);
				this.load('', this.contenttypeid);
            },
            onCourseSelect(item) {
                this.load('', this.contenttypeid);
            },
            onCourseDeselect(item) {
                this.load('', this.contenttypeid);
            }
		},
		created() {
			this.kind = this.$route.params.kind;
			this.load('', '');
		}
	}
</script>

<style scoped lang="scss">
	@import '~scss_vars';

	.ecrw-ready-bk-href {
		//padding: 0 28px;
		text-align: center;
	}
</style>