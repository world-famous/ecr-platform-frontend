import Vue from 'vue'
import ECRDocViewer from './src/ecr-doc-viewer';
import ECRImageViewer from './src/ecr-image-viewer';
import ECRVideoPlayer from './src/ecr-video-player';
import ECRAnimationPlayer from './src/ecr-animation-player';
import ECRResourceViewer from './src/ecr-resource-viewer';

Vue.component('ecr-doc-viewer', ECRDocViewer);
Vue.component('ecr-image-viewer', ECRImageViewer);
Vue.component('ecr-video-player', ECRVideoPlayer);
Vue.component('ecr-animation-player', ECRAnimationPlayer);
Vue.component('ecr-resource-viewer', ECRResourceViewer);