// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    lists: [
      {
        name: '导航组件',
        type: '1', // 1 展开 2 折叠
        childrens: [
          {
            name: '头部导航组件',
          
          },
          {
            name: '侧边栏组件',
            
          },
        ]
      },
      {
        name: '滑动组件',
        type: '1',
        childrens: [
          {
            name: '头部导航组件',
          
          },
          {
            name: '侧边栏组件',
            
          },
        ]
      },
      {
        name: '动画组件',
        type: '1',
        childrens: [
          {
            name: '滑动渐入渐出组件',
          
          },
          {
            name: '自动滚动组件',
            
          },
        ]
      },
      {
        name: '弹窗组件',
        type: '1',
        childrens: [
          {
            name: 'dialog组件',
          
          },
          {
            name: 'popup组件',
            
          },
        ]
      },
    ]
  },

  onLoad() {
  
  },

  /** 绑定事件 */
  clickItem(e) {
    console.log('--', e)
    const {lists} = this.data
    const {index} = e.currentTarget.dataset
    if(lists[index].type === '1') {
      this.setData({
        ['lists[' + index + '].type']: '2'
      }) 
    }else {
      this.setData({
        ['lists[' + index + '].type']: '1'
      })
    }
    
  },
  checkToChildren(e) {
    console.log(e)
  }

})
