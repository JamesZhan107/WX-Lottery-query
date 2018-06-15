var a = getApp();

Page({
    data: {},
    onLoad: function() {
        this.setData({
            userinfo: a.globalData.userInfo
        });
    },
    onShow: function() {
        if (a.globalData.userInfo) {
            var t = this;
            wx.getStorage({
                key: "token",
                success: function(e) {
                    wx.request({
                        url: a.globalData.URL + "/api/wxapp/shop/getorderlist/",
                        data: {
                            token: e.data
                        },
                        success: function(a) {
                            1 == a.data.code && t.setData({
                                list: a.data.data
                            });
                        },
                        complete: function() {
                            wx.hideLoading();
                        }
                    });
                }
            });
        } else wx.showModal({
            title: "未登录",
            content: "对不起,您还未登录,无法进行此操作!",
            showCancel: !1,
            success: function(a) {
                a.confirm && wx.navigateBack();
            }
        });
    }
});