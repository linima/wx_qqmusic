var util = require('../../utils/util.js')

var app = getApp()

Page({
	data: {
		topinfo: {},
		songlist: [],
		update_time: '',
		listBgColor: '',
		isLight: false
	},
	onLoad: function(){
		console.log('toplist onLoad');

		let that = this;
		let id = app.globalData.topListId;
		util.getToplistInfo(id, function(data){
			if(data.color == '14737632'){
				that.setData({
					isLight: true
				})
			};
			that.setData({
				topinfo: data.topinfo,
				songlist: data.songlist,
				update_time: data.update_time,
				listBgColor: that.dealColor(data.color)
			});
		})
	},
	dealColor: function(rgb){
	    if (!rgb) { return; }
	    let r = (rgb & 0x00ff0000) >> 16,
	    	g = (rgb & 0x0000ff00) >> 8,
	    	b = (rgb & 0x000000ff);
	    return 'rgb(' + r + ',' + g + ',' + b + ')';
	},
	playsongTap: function(e){
		app.setGlobalData({
		  songData: e.currentTarget.dataset.data
		});
		wx.navigateTo({
		  url: '../playsong/playsong'
		});
	}
})