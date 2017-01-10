//index.js
var util = require('../../utils/util.js')

var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    navbar: ['推荐', '排行榜', '搜索'],
    currentTab: 0,
    slider: [],
    swiperCurrent: 0,
    topList: [],
    radioList: [],
    hotkey: [],
    special: '',
    searchKeyword: '',
    searchSongList: [],
    zhida: {},
    searchPageNum: 1,
    searchLoading: false,
    isFromSearch: true,
    searchLoadingComplete: false
  },
  //事件处理函数
  // bindViewTap: function() {
  //   wx.navigateTo({
  //     url: '../logs/logs'
  //   })
  // },
  onLoad: function () {
    wx.scanCode({
      success: function(e){
        console.log(e)
      }
    })
    console.log('index onLoad');
    var that = this;
    //推荐频道
    util.getRecommend(function(data){
      that.setData({
        slider: data.data.slider,
        radioList: data.data.radioList,
        songList: data.data.songList
      })
    });

    //搜索频道
    util.getHotSearch(function(data){
      that.setData({
        hotkey: data.data.hotkey,
        special: data.data.special_key
      })
    });

    //更新排行榜数据
    util.getToplist(function(data){
      that.setData({
        topList: data.data.topList
      })
    });
  },
  swiperChange: function(e){
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  // onPullDownRefresh: function(){
  //   console.log('页面相关事件处理函数--监听用户下拉动作')
  // },
  // onReachBottom: function(){
  //   console.log('页面上拉触底事件的处理函数');
  //   let that = this;
  //   if(that.data.searchLoading == true){
  //     that.setData({
  //       searchPageNum: that.data.searchPageNum+1
  //     });
  //     that.formSubmit();
  //   }
  // },
  onShareAppMessage: function(){
    return {
      title: 'QQ音乐',
      desc: '中国最新最全免费正版高品质音乐平台！',
      path: ''
    }
  },
  navbarTap: function(e){
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },
  //排行榜
  toplistTap: function(e){
    app.setGlobalData({
      topListId: e.currentTarget.dataset.id
    });
    wx.navigateTo({
      url: '../toplist/toplist'
    });
  },
  //搜索
  fetchSearchList: function(){
    let that = this;
    let searchKeyword = that.data.searchKeyword,
        searchPageNum = that.data.searchPageNum;
    util.getSearchMusic(searchKeyword, searchPageNum, function(data){
      console.log(data)
      if(data.data.song.curnum != 0){
        let searchList = [];
        that.data.isFromSearch ? searchList=data.data.song.list : searchList=that.data.searchSongList.concat(data.data.song.list)
        that.setData({
          searchSongList: searchList,
          zhida: data.data.zhida,
          searchLoading: true
        });
      }else{
        that.setData({
          searchLoadingComplete: true,
          searchLoading: false
        });
      }
    })
  },
  bindKeywordInput: function(e){
    this.setData({
      searchPageNum: 1,
      isFromSearch: true
    })
    this.setData({
      searchKeyword: e.detail.value
    })
  },
  keywordSearch: function(e){
    this.fetchSearchList();
  },
  searchScrollLower: function(){
    let that = this;
    if(that.data.searchLoading && !that.data.searchLoadingComplete){
      that.setData({
        searchPageNum: that.data.searchPageNum+1,
        isFromSearch: false
      });
      that.fetchSearchList();
    }
  },
  playsongTap: function(e){
    app.setGlobalData({
      songData: e.currentTarget.dataset.data
    });
    wx.navigateTo({
      url: '../playsong/playsong'
    });
  },
  hotkeyTap: function(e){
    let word = e.currentTarget.dataset.text;
    this.setData({
      searchKeyword: e.currentTarget.dataset.text
    });
    this.fetchSearchList();
  }
})
