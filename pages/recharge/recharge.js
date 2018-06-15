function a(a, t, e) {
    return t in a ? Object.defineProperty(a, t, {
        value: e,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : a[t] = e, a;
}

var t = getApp();

Page({
    data: {
        disabled: !1,
        loading: !1
    },
    onShow: function() {
        var a = this;
        wx.getStorage({
            key: "token",
            success: function(t) {
                a.setData({
                    token: t.data
                });
            }
        }), this.setData({
            userinfo: t.globalData.userInfo
        }), t.globalData.userInfo || wx.showModal({
            title: "未登录",
            content: "对不起,您还未登录,无法进行此操作!",
            showCancel: !1,
            success: function(a) {
                a.confirm && wx.navigateBack();
            }
        });
    },
    formSubmit: function(e) {
        var o = this;
        o.setData({
            loading: !0,
            disabled: !0
        }), wx.request({
            url: t.globalData.URL + "/api/wxapp/user/setusermobile/",
            method: "POST",
            data: {
                data: e.detail.value,
                token: o.data.token
            },
            success: function(e) {
                if (1 == e.data.code) {
                    o.setData(a({}, "userinfo.mobile", e.data.data)), t.globalData.userInfo.mobile = e.data.data;
                } else wx.showToast({
                    title: e.data.msg,
                    image: "../../images/err.png"
                });
            },
            complete: function() {
                o.setData({
                    loading: !1,
                    disabled: !1
                });
            }
        });
    },
    select: function(a) {
        this.setData({
            id: a.currentTarget.dataset.id,
            disabled: !1
        });
    },
    doRecharge: function() {
        var a = this;
        wx.showLoading(), a.setData({
            loading: !0,
            disabled: !0
        }), wx.login({
            success: function(e) {
                e.code && wx.request({
                    url: t.globalData.URL + "/api/wxapp/public/getuseropenid/",
                    method: "POST",
                    data: {
                        code: e.code
                    },
                    success: function(t) {
                        1 == t.data.code ? a.doOrder(t.data.data) : (a.setData({
                            loading: !1,
                            disabled: !1
                        }), wx.hideLoading(), wx.showToast({
                            title: t.data.msg,
                            image: "../../images/err.png"
                        }));
                    }
                });
            }
        });
    },
    doOrder: function(a) {
        var e = this;
        wx.request({
            url: t.globalData.URL + "/api/wxapp/shop/buygoods/",
            data: {
                goods_id: e.data.id,
                openid: a
            },
            success: function(a) {
                1 == a.data.code ? wx.requestPayment({
                    timeStamp: String(a.data.data.timeStamp),
                    nonceStr: a.data.data.noncestr,
                    package: "prepay_id=" + a.data.data.prepay_id,
                    signType: "MD5",
                    paySign: a.data.data.paySign,
                    success: function(a) {
                        wx.showToast({
                            title: "支付成功"
                        }), t.checkUsermoney();
                    },
                    complete: function(a) {
                        e.setData({
                            loading: !1,
                            disabled: !1
                        }), wx.hideLoading();
                    }
                }) : (e.setData({
                    loading: !1,
                    disabled: !1
                }), wx.hideLoading(), wx.showToast({
                    title: a.data.msg,
                    image: "../../images/err.png"
                }));
            }
        });
    },
    copy: function() {
        wx.setClipboardData({
            data: "aoyou85",
            success: function(a) {
                wx.showToast({
                    title: "复制成功"
                });
            }
        });
    }
});