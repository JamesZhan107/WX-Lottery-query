var a = getApp();

Page({
    data: {
        userinfo: !1,
        showModal: !1,
        log: []
    },
    onShow: function() {
        if (a.globalData.userInfo) {
            this.setData({
                disabled: !1
            });
            var t = this;
            wx.getStorage({
                key: "token",
                success: function(e) {
                    wx.request({
                        url: a.globalData.URL + "/api/wxapp/user/getuserbuylog/",
                        data: {
                            token: e.data
                        },
                        success: function(a) {
                            1 == a.data.code ? t.setData({
                                list: a.data.data
                            }) : wx.showToast({
                                title: a.data.msg,
                                image: "../../images/err.png"
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
    },
    orderLog: function(a) {
        0 == this.data.disabled && (this.setData({
            log: a.currentTarget.dataset.result
        }), this.setData({
            disabled: !0,
            showModal: !0
        }));
    },
    coloseDialog: function() {
        this.setData({
            disabled: !1,
            showModal: !1
        });
    }
});