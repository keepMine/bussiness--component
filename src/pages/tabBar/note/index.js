// index.js
// 获取应用实例
const app = getApp()
const imgHost = 'https://lancomecrm.blob.core.chinacloudapi.cn/lancomecrm/wxapp/'
let start = 0,
  end = 0,
  timer = null;
Page({
  
    // 页面的初始数据
  data: {
    title: 'lancome',
    imgHost,
    banner: [
      {
        img: `${imgHost}garden-banner-b-1-1.png`,
        img2: `${imgHost}tansuo-s-1-1.png`,
        path: '/pages/garden/gardenProduct/gardenProduct',
        title: '种草社区',
        des: '「明星产品邀你测评」',
        id: 0,
      },
      {
        img: `${imgHost}garden-banner-b-3.png`,
        img2: `${imgHost}tansuo-s-2.png`,
        path: '',
        title: '全线产品',
        des: '「兰蔻家族系列产品手册」',
        id: 1,
      },
      {
        img: `${imgHost}garden-banner-b-4-1.png`,
        img2: `${imgHost}tansuo-s-3.png`,
        path: '/pages/garden/gardenStoryDetail/gardenStoryDetail',
        title: '品牌故事',
        des: '「了解品牌故事及最新动态」',
        id: 2,
      },
      {
        img: `${imgHost}live-bj-2-1.png`,
        img2: `${imgHost}tansuo-s-4.2.png`,
        path: '/pages/live/live',
        title: '独家教学',
        des: '「产品干货直播揭秘」',
        id: 3,
      },
      {
        img: `${imgHost}garden-banner-b-1-1.png`,
        img2: `${imgHost}tansuo-s-1-1.png`,
        path: '/pages/garden/gardenProduct/gardenProduct',
        title: '种草社区',
        des: '「明星产品邀你测评」',
        id: 0,
      },
      {
        img: `${imgHost}garden-banner-b-3.png`,
        img2: `${imgHost}tansuo-s-2.png`,
        path: '',
        title: '全线产品',
        des: '「兰蔻家族系列产品手册」',
        id: 1,
      },
      {
        img: `${imgHost}garden-banner-b-4-1.png`,
        img2: `${imgHost}tansuo-s-3.png`,
        path: '/pages/garden/gardenStoryDetail/gardenStoryDetail',
        title: '品牌故事',
        des: '「了解品牌故事及最新动态」',
        id: 2,
      },
      {
        img: `${imgHost}live-bj-2-1.png`,
        img2: `${imgHost}tansuo-s-4.2.png`,
        path: '/pages/live/live',
        title: '独家教学',
        des: '「产品干货直播揭秘」',
        id: 3,
      },
    ],
    imgHost,
    bannerIndex: -1,
    is_ad_popup:0,//广告弹窗
    ad_popup:{},
    advertiseModal:false,
  
  },

  onLoad() {
  
  },
  onShow() {
    this.autoPlay();
  },
  onHide() {
    this.stopPlay();
  },
  touchStart(e) {
    start = e.changedTouches[0].clientY;
  },
  touchEnd(e) {
    end = e.changedTouches[0].clientY;
    if (end - start < -40) {
      this.goNext();
    }
  },
  goPath(e) {
    let item = e.currentTarget.dataset.item;
    let index = e.currentTarget.dataset.index;
 
    let bannerIndex = this.data.bannerIndex;
    if (index - bannerIndex === 1) {
      console.log('跳转', item.path);
      if (item.path) {
        if(item.title === '独家教学') return this.goTeacher(item.path);
        wx.navigateTo({
          url: item.path,
        });
      } else if (item.title === '全线产品') {
        wx.navigateToMiniProgram({
          appId: 'wx7a7d6e9c3c289d80',
          path: '/pages/goods/index/index', // path
        });
      } else {
        wx.showToast({
          title: '敬请期待',
          icon: 'none',
        });
      }
    }
  },
  autoPlay() {
    if (!timer) {
      timer = setInterval(() => {
        this.goNext();
      }, 2500);
    }
  },

  stopPlay() {
    if (timer) {
      clearInterval(timer);
    }
  },
  goNext(e) {
    // this.stopPlay();
    let bannerIndex;
    let oldBannerIndex = this.data.bannerIndex;
    let banner = this.data.banner;
    let len = banner.length;
    let data = {};
    if (e) {
      let index = e.currentTarget.dataset.index;
      bannerIndex = index - 1;
      for (let i = oldBannerIndex + 1; i < index; i++, len++) {
        let key = `banner[${len}]`;
        let value = banner[i];
        data[key] = value;
      }
    } else {
      bannerIndex = oldBannerIndex + 1;
      let key = `banner[${len}]`;
      let value = banner[bannerIndex];
      data[key] = value;
    }
    data.bannerIndex = bannerIndex;
    this.setData(data, () => {
      this.autoPlay();
    });
  },
})

