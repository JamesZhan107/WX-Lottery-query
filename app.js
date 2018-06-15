App({
    onLaunch: function() {
        var t = this;
        wx.getSetting({
            success: function(a) {
                a.authSetting["scope.userInfo"] ? wx.getStorage({
                    key: "token",
                    success: function(a) {
                        wx.request({
                            url: t.globalData.URL + "/api/wxapp/user/getuserinfo/token/" + a.data,
                            success: function(a) {
                                1 == a.data.code && (t.globalData.userInfo = a.data.data);
                            }
                        });
                    }
                }) : wx.setStorage({
                    key: "token",
                    data: ""
                });
            }
        });
    },
    wx_login: function(t) {
        wx.showLoading();
        var a = this, e = "";
        wx.login({
            success: function(n) {
                e = n.code, wx.getUserInfo({
                    success: function(n) {
                        var o = n.userInfo;
                        wx.request({
                            url: a.globalData.URL + "/api/wxapp/public/login",
                            data: {
                                code: e,
                                encrypted_data: n.encryptedData,
                                iv: n.iv,
                                raw_data: n.raw_data,
                                signature: n.signature
                            },
                            success: function(e) {
                                1 == e.data.code ? (wx.setStorage({
                                    key: "token",
                                    data: e.data.data.token
                                }), a.globalData.userInfo = o, a.globalData.userInfo.money = e.data.data.money, 
                                a.globalData.userInfo.mobile = e.data.data.mobile, a.globalData.userInfo.status = e.data.data.status, 
                                t(o)) : wx.showToast({
                                    title: e.data.msg,
                                    image: "../../images/err.png"
                                });
                            },
                            complete: function() {
                                wx.hideLoading();
                            }
                        });
                    }
                });
            }
        });
    },
    checkLogin: function(t) {
        wx.getSetting({
            success: function(a) {
                a.authSetting["scope.userInfo"] ? t.setData({
                    isLogin: !0
                }) : t.setData({
                    isLogin: !1
                });
            }
        });
    },
    openSetting: function() {
        var t = this;
        wx.openSetting ? wx.openSetting({
            success: function(a) {
                t.login();
            }
        }) : wx.showModal({
            title: "授权提示",
            content: "小程序完整功能需要您的微信授权才能使用!"
        });
    },
    checkUsermoney: function() {
        var t = this;
        wx.getStorage({
            key: "token",
            success: function(a) {
                wx.request({
                    url: t.globalData.URL + "/api/wxapp/user/getuserinfo/token/" + a.data,
                    success: function(a) {
                        1 == a.data.code && (t.globalData.userInfo = a.data.data);
                    }
                });
            }
        });
    },
    globalData: {
        userInfo: !1,
        first: 1,
        URL: "https://www.bk63.com"
    }
});