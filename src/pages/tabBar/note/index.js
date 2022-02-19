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
    height: app.globalData.height * 2,
    banner: [
      {
        img: `../../../images/p-1.jpeg`,
        img2: `../../../images/p-2.jpg`,
        path: '/pages/garden/gardenProduct/gardenProduct',
        title: '框架篇',
        des: '「vue、react的秘境」',
        id: 0,
        name: '进入框架的世界'
      },
      {
        img: `../../../images/p1-1.jpeg`,
        img2: `../../../images/p-3.jpeg`,
        path: '',
        title: 'HTML',
        des: '「html中探索结构之美」',
        id: 1,
        name: '进入HTML的世界'
      },
      {
        img: `../../../images/p1-2.jpeg`,
        img2: `../../../images/p-4.jpeg`,
        path: '/pages/garden/gardenStoryDetail/gardenStoryDetail',
        title: 'CSS',
        des: '「css中探索样式之美」',
        id: 2,
        name: '进入CSS的世界'
      },
      {
        img: `../../../images/p1-3.jpeg`,
        img2: `../../../images/p-5.jpeg`,
        path: '/pages/live/live',
        title: 'JS',
        des: '「js中探索逻辑之美」',
        id: 3,
        name: '进入JS的世界'
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
    this.stopPlay();
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
    
    let bannerIndex;
    let oldBannerIndex = this.data.bannerIndex;
    let banner = this.data.banner;
    let len = banner.length;
    let data = {};
    if (e) {
      this.stopPlay();
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

