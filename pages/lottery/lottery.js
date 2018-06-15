var t = getApp();

Page({
    data: {
        list: [],
        currentTab: 2,
        disabled: !1
    },
    onLoad: function() {
        var a = this;
        wx.showLoading(), wx.request({
            url: t.globalData.URL + "/api/wxapp/lottery/getlotterylist/type_id/" + a.data.currentTab,
            success: function(t) {
                wx.hideLoading(), 1 == t.data.code && a.setData({
                    list: t.data.data
                });
            }
        });
    },
    onShow: function() {
        this.setData({
            disabled: !1
        });
    },
    onPullDownRefresh: function() {
        wx.stopPullDownRefresh();
        var a = this;
        wx.showNavigationBarLoading(), setTimeout(function() {
            wx.request({
                url: t.globalData.URL + "/api/wxapp/lottery/getlotterylist/type_id/" + a.data.currentTab,
                data: {
                    page: a.data.page
                },
                success: function(t) {
                    1 == t.data.code && a.setData({
                        list: t.data.data
                    });
                },
                complete: function() {
                    wx.hideNavigationBarLoading();
                }
            });
        }, 1e3);
    },
    clickTab: function(a) {
        if (this.data.currentTab === a.target.dataset.current) return !1;
        this.setData({
            currentTab: a.target.dataset.current,
            list: []
        });
        var e = this;
        wx.showLoading(), wx.request({
            url: t.globalData.URL + "/api/wxapp/lottery/getlotterylist/type_id/" + e.data.currentTab,
            success: function(t) {
                wx.hideLoading(), 1 == t.data.code && e.setData({
                    list: t.data.data
                });
            }
        });
    },
    goToInfo: function(t) {
        0 == this.data.disabled && (this.setData({
            disabled: !0
        }), wx.navigateTo({
            url: "../lottery_info/lottery_info?id=" + t.currentTarget.dataset.id
        }));
    }
});