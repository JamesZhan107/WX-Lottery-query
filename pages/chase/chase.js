var a = getApp();

Page({
    data: {
        userinfo: !1
    },
    onLoad: function() {
        var t = this;
        wx.showLoading(), wx.request({
            url: a.globalData.URL + "/api/wxapp/chase/getchaselist/",
            success: function(a) {
                wx.hideLoading(), 1 == a.data.code && t.setData({
                    list: a.data.data
                });
            }
        });
    },
    onShow: function() {
        a.checkUsermoney(), this.setData({
            userinfo: a.globalData.userInfo
        }), this.setData({
            disabled: !1
        });
    },
    login: function(t) {
        var e = this;
        t.detail.iv ? a.wx_login(function(a) {
            e.setData({
                userinfo: a
            });
        }) : wx.showModal({
            title: "授权提示",
            content: "小程序完整功能需要您的微信授权才能使用!",
            showCancel: !1
        });
    },
    goTochase: function(a) {
        0 == this.data.disabled && (this.setData({
            disabled: !0
        }), wx.navigateTo({
            url: "../chase_info/chase_info?id=" + a.currentTarget.dataset.id
        }));
    },
    goTorecharge: function(a) {
        0 == this.data.disabled && (this.setData({
            disabled: !0
        }), wx.navigateTo({
            url: "../recharge/recharge"
        }));
    }
});