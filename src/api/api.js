import axios from 'axios';
import util from '../common/js/util'

var openapi_server = axios.create({
		baseURL: OPENAPI_SERVER,
		headers: {
			'Content-Type':'application/json'
		}
	});
const getConfig = params => { return { headers: {'token':localStorage.getItem('frontend-token') } }; };

export const requestLogin = params => { return openapi_server.post(`/user/loginUser`, params); };
export const requestWeixin = params => { return openapi_server.post(`/user/loginSSO`, params); };
export const requestCapcha = params => { return openapi_server.get(`/user/requestCaptcha`); };
export const autoLogin = params => { return util.checkToken(openapi_server.get(`/user/autoLogin`, getConfig())); };
export const getUserCountInfo = params => { return util.checkToken(openapi_server.get(`/user/getUserCountInfo/` + params, getConfig())); };
export const getTeacherInfo = params => { return util.checkToken(openapi_server.get(`/user/getTeacherById/` + params, getConfig())); };
export const getResourceInfo = params => { return util.checkToken(openapi_server.get(`/user/getResourceInfo`, getConfig())); }

export const getOneLabelList = params => { return util.checkToken(openapi_server.post(`/label/getOneLabelList` , params, getConfig())); };
export const getTwoLabelList = params => { return util.checkToken(openapi_server.post(`/label/getTwoLabelList` , params, getConfig())); };
export const getThreeLabelList = params => { return util.checkToken(openapi_server.post(`/label/getThreeLabelList` , params, getConfig())); };
export const getLabelList = params => { return util.checkToken(openapi_server.post(`/label/getLabelList`, params, getConfig())); };
export const getLabelTree = params => { return util.checkToken(openapi_server.post(`/label/getLabelTree`, params, getConfig())); };
export const getLabelById = labelId => { return util.checkToken(openapi_server.get(`/label/getLabelById/` + labelId, getConfig())); };

export const getGoodsListByOrder = params => { return util.checkToken(openapi_server.post(`/order/getGoodsListByOrder`, params, getConfig())); };
export const getGoodsTotalCount = params => {return util.checkToken(openapi_server.get(`/good/getGoodsStatus`, getConfig())); };
export const setGoodThumbnail = params => { return util.checkToken(openapi_server.post(`good/setGoodThumbnail`, params, getConfig())); };
export const getGoodsList = params => {
	params.conditions.push({ // Show Only Sellable Goods in Frontend
        fieldName: 'status',
        fieldValues: [ '1' ],
        prepender: null,
        operator: 'EQUAL',
        childCondtions: null
    });
	return util.checkToken(openapi_server.post(`/good/getGoodsList`, params, getConfig()));
};
export const getResource = contentId => {return util.checkToken(openapi_server.get(`/resource/detailResource/` + contentId, getConfig())); };
export const rateResource = params => { return util.checkToken(openapi_server.post(`/resource/rateResource`, params, getConfig())); };
export const voteResource = contentId => {return util.checkToken(openapi_server.get(`/resource/voteResource/` + contentId, getConfig())); };
export const addToFavorite = contentId => {return util.checkToken(openapi_server.get(`/resource/addToFavorite/` + contentId, getConfig())); };
export const removeFromFavorite = contentId => {return util.checkToken(openapi_server.get(`/resource/removeFromFavorite/` + contentId, getConfig())); };
export const batchRemoveFromFavorite = params => { return util.checkToken(openapi_server.post(`/resource/batchRemoveFromFavorite` , params, getConfig())); };
export const addToBasket = contentId => {return util.checkToken(openapi_server.get(`/resource/addToBasket/` + contentId, getConfig())); };
export const removeFromBasket = contentId => {return util.checkToken(openapi_server.get(`/resource/removeFromBasket/` + contentId, getConfig())); };
export const getBasketResourceByUser = params => { return util.checkToken(openapi_server.post(`/resource/getBasketResourceListByUser`, params, getConfig())); };
export const editResource = params => { return util.checkToken(openapi_server.post(`/resource/editResource`, params, getConfig())); };
export const getUploadResourceByUser = params => { return util.checkToken(openapi_server.post(`/resource/getUploadResourceListByUser`, params, getConfig())); };
export const getDownloadResourceByUser = params => { return util.checkToken(openapi_server.post(`/resource/getDownloadResourceListByUser`, params, getConfig())); };
export const isAlreadyDownload = resourceId => { return util.checkToken(openapi_server.get(`/resource/isAlreadyDownload/` + resourceId, getConfig())); };
export const downloadResource = resourceId => { return util.checkToken(openapi_server.get(`/resource/downloadResource/` + resourceId, getConfig())); };
export const getCollectedResourceList = params => { return util.checkToken(openapi_server.post(`/resource/getCollectedResourceList`, params, getConfig()));};
export const getFavoriteResourceListByUser = params => { return util.checkToken(openapi_server.post(`/resource/getFavoriteResourceListByUser`, params, getConfig()));};
export const uploadResource = params => { return util.checkToken(openapi_server.post(`/resource/uploadResource`, params, getConfig())); };
export const uploadFileInfo = params => { return util.checkToken(openapi_server.post(`/resource/uploadFileInfo`, params, getConfig())); };
export const uploadCollectionResource = params => { return util.checkToken(openapi_server.post(`/resource/uploadCollectionResource`, params, getConfig())); };
export const uploadEstimateResource = params => { return util.checkToken(openapi_server.post(`/resource/uploadEstimateResource`, params, getConfig()));}; 
export const uploadEstimateFileInfo = params => { return util.checkToken(openapi_server.post(`/resource/uploadEstimateResourceFileInfo`, params, getConfig()));}; 
export const uploadRewardResource = params => { return util.checkToken(openapi_server.post(`/resource/uploadRewardResource`, params, getConfig())); };
export const getRewardResourceList = params => { return util.checkToken(openapi_server.post(`/resource/getRewardResourceList`, params, getConfig())); };
export const getBasketResourceCountByUser = params => { return util.checkToken(openapi_server.get(`/resource/getBasketResourceCountByUser`, getConfig())); };

export const getSchoolSectionList = params => { return util.checkToken(openapi_server.post(`/navigation/getSchoolSectionList`, params, getConfig())); };
export const getSubjectList = params => { return util.checkToken(openapi_server.post(`/navigation/getSubjectList`, params, getConfig())); };
export const getNaviBookModelList = params => { return util.checkToken(openapi_server.post(`/navigation/getNaviBookModelList`, params, getConfig())); };
export const getNaviEditionTypeList = params => { return util.checkToken(openapi_server.post(`/navigation/getNaviEditionTypeList`, params, getConfig())); };
export const getNaviGradeList = params => { return util.checkToken(openapi_server.post(`/navigation/getNaviGradeList`, params, getConfig())); };
export const getTeachCatalogList = params => { return util.checkToken(openapi_server.post(`/catalog/getCatalogTree` , params, getConfig())); };
export const getCatalogList = params => { return util.checkToken(openapi_server.post(`/catalog/getCatalogList` , params, getConfig())); };
export const getTeachCatalogHeader = params => { return util.checkToken(openapi_server.post(`/catalog/getCatalogHeader` , params, getConfig())); };

export const getCollectionActivityList = params => { return util.checkToken(openapi_server.post(`/collection/getCollectionActivityList`, params, getConfig())); };
export const getRecentCollectionList = params => { return util.checkToken(openapi_server.post(`/collection/getRecentCollectionList`, params, getConfig())); };
export const getManyResourceTypeList = params => { return util.checkToken(openapi_server.get(`/collection/getManyResourceTypeList`, params, getConfig())); };
export const getCollectionExportManList = params => { return util.checkToken(openapi_server.post(`/collection/getCollectionExportManList`, params, getConfig())); };
export const getMyCollectionList = params => { return util.checkToken(openapi_server.post(`/collection/getMyCollectionList`, params, getConfig())); };
export const getActivity = params => { return util.checkToken(openapi_server.get(`/collection/` + params, getConfig()));};
export const getActivityResourceList = params => { return util.checkToken(openapi_server.post('/resource/getActivityResourceList', params, getConfig()));};

export const getMyScore = params => { return util.checkToken(openapi_server.get(`/score/getMyScore`, getConfig())); };
export const getScoreDetail = params => { return util.checkToken(openapi_server.post(`/score/getScoreDetail`, params, getConfig())); };
export const getScoreRule = params => { return util.checkToken(openapi_server.post(`/score/getScoreRule` , params, getConfig())); };

export const orderCharge = params => { return util.checkToken(openapi_server.post(`/charge/orderCharge`, params, getConfig())); };
export const chargeToAccount = params => { return util.checkToken(openapi_server.post(`/charge/chargeToAccount`, params, getConfig())); };
export const getChargeItemList = params => { return util.checkToken(openapi_server.post(`/charge/getChargeItemList`, params, getConfig())); };
export const getChargeExchange = params => { return openapi_server.get(`/charge/getExchange`, getConfig()); };

export const addToOrder = params => { return util.checkToken(openapi_server.post(`/order/addToOrder`, params, getConfig())); };
export const getMyOrderList = params => { return util.checkToken(openapi_server.post(`/order/getMyOrderList`, params, getConfig())); };
export const payOrder = orderId => { return util.checkToken(openapi_server.get(`/order/payOrder/` + orderId, getConfig())); };

export const getEstimateActivityList = params => { return util.checkToken(openapi_server.post(`/estimate/getEstimateActivityList`, params, getConfig())); };
export const getRecentEstimateList = params => { return util.checkToken(openapi_server.post(`/estimate/getRecentEstimateList`, params, getConfig())); };
export const getEstimateActivity = params => { return util.checkToken(openapi_server.get(`/estimate/` + params, getConfig())); };
export const getEstimateExporterList = params => { return util.checkToken(openapi_server.post(`/estimate/getEstimateExporterList`, params, getConfig())); };
export const getEstimateTeacherList = params => { return util.checkToken(openapi_server.post(`/estimate/getEstimateTeacherList`, params, getConfig())); };
export const getEstimateResourceList = params => { return util.checkToken(openapi_server.post(`/resource/getEstimateResourceList`, params, getConfig()));};
export const voteTeacher = params => { return util.checkToken(openapi_server.get(`/estimate/voteTeacher/` + params, getConfig())); };

export const getRewardActivityList = params => { return util.checkToken(openapi_server.post(`/reward/getRewardActivityList`, params, getConfig())); };
export const addRewardActivity = params => { return util.checkToken(openapi_server.post(`/reward/addRewardActivity`, params, getConfig())); };
export const getRewardExportManList = params => { return util.checkToken(openapi_server.post(`/reward/getRewardExportManList`, params, getConfig())); };
export const getRecentRewardList = params => { return util.checkToken(openapi_server.post(`/reward/getRecentRewardList`, params, getConfig())); };
export const getManyRewardResourceTypeList = params => { return util.checkToken(openapi_server.get(`/reward/getManyResourceTypeList`, params, getConfig())); };
export const getRewardActivity = params => { return util.checkToken(openapi_server.get(`/reward/` + params, getConfig())); };
export const getMyRewardList = params => { return util.checkToken(openapi_server.post(`/reward/getMyRewardList`, params, getConfig())); };
export const setGoodAnswer = params => { return util.checkToken(openapi_server.get(`/reward/setGoodAnswer/` + params, getConfig())); };
export const getIJoinedRewardList = params => { return util.checkToken(openapi_server.post(`/reward/getIJoinedRewardList`, params, getConfig())); };
export const getRewardCountInfo = params => { return util.checkToken(openapi_server.get(`/reward/getRewardCountInfo`, getConfig())); };
export const endRewardActivity = params => { return util.checkToken(openapi_server.get(`/reward/endRewardActivity/` + params, getConfig()));};

export const getNamedTeacherList = params => { return util.checkToken(openapi_server.post(`/teacher/getNamedTeacherList`, params, getConfig()));};

export const getParentAreaId = params => { return util.checkToken(openapi_server.get(`/area/getParentAreaId/` + params, getConfig()));};
export const getAreasByParent = params => { return util.checkToken(openapi_server.get(`/area/getAreasByParent/` + params, getConfig()));};
export const getNamedSchoolInfoListByAreaId = params => { return util.checkToken(openapi_server.post(`/school/getNamedSchoolInfoListByAreaId`, params, getConfig()));};
export const getGoodsStatisticsBySchoolId = params => { return util.checkToken(openapi_server.get(`/school/getGoodsStatisticsBySchoolId/` + params, getConfig()));};
export const getSchoolGoodsList = params => { return util.checkToken(openapi_server.post(`/school/getGoodsList`, params, getConfig())); };
export const getSchoolList = params => { return util.checkToken(openapi_server.post(`/school/getSchoolList` , params, getConfig())); };

export const getAdvertList = params => { return util.checkToken(openapi_server.post(`/advret/getAdvretList`, params, getConfig())); };
export const search = params => { return util.checkToken(openapi_server.post(`/esearch/getSearchResult`, params, getConfig())); };
export const upLoadFeedback = params => { return util.checkToken(openapi_server.post(`/feedback/upLoadFeedback`, params, getConfig())); };
export const inputUserAction = params => { return util.checkToken(openapi_server.post(`/action/inputUserAction`, params, getConfig())); };

export const getThemeList = params => { return util.checkToken(openapi_server.post(`/theme/getThemeList`, params, getConfig()));};
export const getThemeResourceList= params => { return util.checkToken(openapi_server.post(`/theme/getResourceList`, params, getConfig()));};
export const getHomeList = params => { return util.checkToken(openapi_server.post('theme/getHomeList', params, getConfig()));};
export const getThemeDetail = params => { return util.checkToken(openapi_server.get('theme/getTheme/' + params, getConfig()));};

const getEcoBaseAPIConfig = params => {
	return {
			baseURL:ECOAPI_SERVER + '/openapi-base', 
			headers: {
				'access-token':localStorage.getItem('frontend-token'),
				'Content-Type':'application/json',
				'Tenant-Id':'YYDJ001'
			}
		};
};

const getEcoUCAPIConfig = params => {
	return {
			baseURL:ECOAPI_SERVER + '/openapi-uc', 
			headers: {
				'access-token':localStorage.getItem('frontend-token'),
				'Content-Type':'application/json'
			}
		};
};

const getECOFileAPIConfig = params => {
	return {
			baseURL:ECOAPI_SERVER + '/fs/fs', 
			headers: {
				'Content-Type':'application/json'
			}
		};
};

export const signupStudent = params => { return openapi_server.post(`/base/addStudent`, params, getEcoBaseAPIConfig()); };
export const signupTeacher = params => { return openapi_server.post(`/base/addTeacher`, params, getEcoBaseAPIConfig()); };
export const updatePwdECO = (params, message) => {	return util.checkECOToken(openapi_server.post(`/uc/updatePwd`, params, getEcoUCAPIConfig()), message); };
export const updateUserECO = (params, message) => {	return util.checkECOToken(openapi_server.post(`/uc/updateUser`, params, getEcoUCAPIConfig()), message); };
export const updateUser = params => { return util.checkToken(openapi_server.post(`/user/updateUser`, params, getConfig()));};
export const getThumbnail = (params, message) => { return openapi_server.post(`/getImage`, params, getECOFileAPIConfig()); };
export const getWaterMarkToImage = (params, message) => { return util.checkECOToken(openapi_server.post(`/uc/getWaterMarkToImage`, params, getEcoUCAPIConfig()), message); };
export const getFileList = (params) => { return openapi_server.post(`/file/getListByFields`,params,getConfig());};
// ECO API
export const uploadFile = params => {
	return openapi_server.post(`/twasp/fs/fs/file/upload`, params.data, 
		{
			baseURL: ECOAPI_SERVER, 
			headers: {
				'user-agent':'Mozilllla/4.0 (compatible; MSIE 6.0; Windows NT 5.1;)',
				'Content-Type':'multipart/form-data;charset=UTF-8',
				'Host':'****',
				'Accept-Encoding':'gzip',
				'charset':'utf-8',
				'branchCode': BRANCH_CODE
			},
			onUploadProgress: params.onUploadProgress
		}
	);
};
// ECO API消息
export const getUnReadMsgCount = params => { 
	return openapi_server.get(`/message-hub/unReadMsgCount?` + params,
		{
			baseURL: ECOAPI_SERVER,
			headers: {
				'Content-Type':'application/json',
				'Tenant-Id': TENANT_ID
			}
		}
	);
};
export const getUnReadMsgList = params => {
	return openapi_server.get(`/message-hub/unReadMsgList?` + params,
		{
			baseURL: ECOAPI_SERVER,
			headers: {
				'Content-Type':'application/json',
				'Tenant-Id': TENANT_ID
			}
		}
	);
};
export const getMsgList = params => {
	return openapi_server.get(`/message-hub/msgList?` + params,
		{
			baseURL: ECOAPI_SERVER,
			headers: {
				'Content-Type':'application/json',
				'Tenant-Id': TENANT_ID
			}
		}
	);
}
export const setRead = params => {
	return openapi_server.get(`/message-hub/setReaded?` + params,
		{
			baseURL: ECOAPI_SERVER,
			headers: {
				'Content-Type':'application/json',
				'Tenant-Id': TENANT_ID
			}
		}
	);
}
export const getSMSKey = params => {
	return openapi_server.post(`/message-hub/saveMessage`, params,
		{
			baseURL: ECOAPI_SERVER,
			headers: {
				'Content-Type':'application/json',
				'Tenant-Id': TENANT_ID
			}		
		}
	);
}
export const getOrgInformation = params => { 
	return openapi_server.get(`/org/` + params.id,
		{
			baseURL:ECOAPI_SERVER + '/openapi-uc', 
			headers: {
				'Content-Type':'application/json',
				'access-token':localStorage.getItem('frontend-token'),
			}
		}
	);
};

export const checkConvertUrl = (url, message) => { return util.checkECOToken(openapi_server.get(`/file/getMediaConvertPath?` + url, getECOFileAPIConfig()), message); };
// ECO API消息 END
