// index.js
// 获取应用实例
const app = getApp()
import {des_encrypt,des_decrypt} from '../../../utils/crypto/encrypt'
Page({
  data: {
    userinfo: {},
    formData: {
      name: '',
      key: '',
      iv: '',
      
    },
    formatData: {
      result: '',
      name: ''
    }
  },

  onLoad() {
    
  },
  onShow() {
    this.init()
  },
  init() {
    this.setData({
      formData: {
        name: '',
        key: '',
        iv: '',
        
      },
      formatData: {
        result: '',
        name: ''
      }

    })
  },
  inputName(e) {
    console.log(e)
    const {key} = e.currentTarget.dataset
    if(key === 'name') {
      this.setData({
        'formData.name': e.detail.value
      })
    }
    if(key === 'key') {
      this.setData({
        'formData.key': e.detail.value
      })
    }
    if(key === 'iv') {
      this.setData({
        'formData.iv': e.detail.value
      })
    }
  },
  encrypt() {
    const {formData} = this.data
    const objArr = Object.keys(formData)
    console.log('输入', objArr)
   const res = objArr.some(el => {
      if(!formData[el]) {
       return wx.showToast({
          title: '请输入' + el,
          icon: 'none',
        });
        
      }

    })
    if(res) return
    const {name, key, iv} = formData
    if(key.length < 5) return wx.showToast({
      title: 'key的长度必须大于5',
      icon: 'none',
    });
    this.desEncrypt(name, key, iv)
  },
  // 加密方法
  desEncrypt(str, key, iv) {
   const res = des_encrypt(key,iv, str)
   console.log('加密结果', res)
   this.setData({
     'formatData.result': res
   })
   const res1 =  des_decrypt(res,key,iv)
    console.log('解密结果', res1)
    this.setData({
      'formatData.name': res1
    })
  }
  
})
