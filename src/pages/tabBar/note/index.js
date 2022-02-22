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
    banner: [],
    imgHost,
    bannerIndex: -1,
    is_ad_popup:0,//广告弹窗
    ad_popup:{},
    advertiseModal:false,
    imgList: [
      'cloud://cloud1-8gpys0qhdc919f2f.636c-cloud1-8gpys0qhdc919f2f-1309693043/p-1.jpeg', 
      '	cloud://cloud1-8gpys0qhdc919f2f.636c-cloud1-8gpys0qhdc919f2f-1309693043/p-2.jpg', 
      'cloud://cloud1-8gpys0qhdc919f2f.636c-cloud1-8gpys0qhdc919f2f-1309693043/p-3.jpeg', 
      'cloud://cloud1-8gpys0qhdc919f2f.636c-cloud1-8gpys0qhdc919f2f-1309693043/p-4.jpeg',
      'cloud://cloud1-8gpys0qhdc919f2f.636c-cloud1-8gpys0qhdc919f2f-1309693043/p-5.jpeg',
      'cloud://cloud1-8gpys0qhdc919f2f.636c-cloud1-8gpys0qhdc919f2f-1309693043/p1-1.jpeg',
      'cloud://cloud1-8gpys0qhdc919f2f.636c-cloud1-8gpys0qhdc919f2f-1309693043/p1-2.jpeg',
      'cloud://cloud1-8gpys0qhdc919f2f.636c-cloud1-8gpys0qhdc919f2f-1309693043/p1-3.jpeg',
      'cloud://cloud1-8gpys0qhdc919f2f.636c-cloud1-8gpys0qhdc919f2f-1309693043/p-6.jpeg',
      'cloud://cloud1-8gpys0qhdc919f2f.636c-cloud1-8gpys0qhdc919f2f-1309693043/p1-6.jpeg'
    ],
    successImgList: []
  },

  onLoad() {
    const noteImg = wx.getStorageSync('noteImg')
    console.log('缓存中的数据', noteImg)
    if(!noteImg.length) {
      this.downImage()
    }else {
      this.setData({
        banner: noteImg
      })
    }
    
  },
  onShow() {
    this.autoPlay();
  },
  onHide() {
    this.stopPlay();
  },
  /** 云开发函数 */
  downImage() {
    let list = []
    wx.showLoading({
      title: '加载中',
      mask: true,
    });
    const {imgList} = this.data
    imgList.forEach(el => {
     const proRes = wx.cloud.downloadFile({
        fileID: el, // 文件 ID
      })
      list.push(proRes)
    });
    console.log('后端返回的img', list)
    Promise.all(list).then((val)=> {
      console.log('--最终去异步后的img集合--', val)
      wx.hideLoading();
      const banner = [
        {
          img: val[0].tempFilePath,
          img2: val[1].tempFilePath,
          path: '/src/pages/common/vue-world/index',
          title: '框架篇',
          des: '「vue、react的秘境」',
          id: 0,
          name: '进入框架的世界'
        },
        {
          img: val[5].tempFilePath,
          img2: val[2].tempFilePath,
          path: '/src/pages/common/html-world/index',
          title: 'HTML',
          des: '「html中探索结构之美」',
          id: 1,
          name: '进入HTML的世界'
        },
        {
          img: val[6].tempFilePath,
          img2: val[3].tempFilePath,
          path: '/src/pages/common/css-world/index',
          title: 'CSS',
          des: '「css中探索样式之美」',
          id: 2,
          name: '进入CSS的世界'
        },
        {
          img: val[7].tempFilePath,
          img2: val[4].tempFilePath,
          path: '/src/pages/common/js-world/index',
          title: 'JS',
          des: '「js中探索逻辑之美」',
          id: 3,
          name: '进入JS的世界'
        },
        
        {
          img: val[8].tempFilePath,
          img2: val[9].tempFilePath,
          path: '/src/pages/common/webpack-world/index',
          title: '工程化',
          des: '「webpack等系列问题」',
          id: 3,
          name: '进入工程化的世界'
        }
       
      ]
      this.setData({
        successImgList: val,
        banner,
      },
      () => {
        wx.setStorageSync('noteImg', banner)
      })
    })
  },
  
  /**绑定函数 */
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
    console.log(e)
    let item = e.currentTarget.dataset.item;
    let index = e.currentTarget.dataset.index;
 
    let bannerIndex = this.data.bannerIndex;
    if (index - bannerIndex === 1) {
      console.log('跳转', item.path);
      if (item.path) {
        wx.navigateTo({
          url: item.path,
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

