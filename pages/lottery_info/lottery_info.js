var t = getApp();

Page({
    data: {
        page: 1,
        lottery_id: 0
    },
    onLoad: function(a) {
        this.setData({
            lottery_id: a.id
        });
        var e = this;
        wx.showLoading(), wx.request({
            url: t.globalData.URL + "/api/wxapp/lottery/getLotteryInfo/lottery_id/" + e.data.lottery_id,
            success: function(t) {
                wx.hideLoading(), 1 == t.data.code ? (e.setData({
                    info: t.data.data.info,
                    list: t.data.data.list
                }), wx.setNavigationBarTitle({
                    title: t.data.data.name
                })) : wx.showToast({
                    title: t.data.msg,
                    image: "../../images/err.png"
                });
            }
        });
    },
    onPullDownRefresh: function() {
        wx.stopPullDownRefresh(), this.setData({
            page: 1
        });
        var a = this;
        wx.showNavigationBarLoading(), setTimeout(function() {
            wx.request({
                url: t.globalData.URL + "/api/wxapp/lottery/getLotteryInfo/lottery_id/" + a.data.lottery_id,
                success: function(t) {
                    1 == t.data.code && a.setData({
                        list: t.data.data.list
                    });
                }
            }), wx.hideNavigationBarLoading();
        }, 1e3);
    },
    onReachBottom: function() {
        this.setData({
            isHideLoadMore: !1,
            page: this.data.page + 1
        });
        var a = this;
        setTimeout(function() {
            wx.request({
                url: t.globalData.URL + "/api/wxapp/lottery/getLotteryInfo/lottery_id/" + a.data.lottery_id,
                data: {
                    page: a.data.page
                },
                success: function(t) {
                    1 == t.data.code && a.setData({
                        list: a.data.list.concat(t.data.data.list)
                    });
                }
            }), a.setData({
                isHideLoadMore: !0
            });
        }, 1e3);
    }
});