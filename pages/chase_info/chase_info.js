var a = getApp();

Page({
    data: {
        userinfo: !1,
        isHideRefer: !0,
        play_id: 0,
        height: 0,
        scrollTop: 0,
        buyin: !0
    },
    onLoad: function(t) {
        var e = this;
        wx.getStorage({
            key: "token",
            success: function(a) {
                e.setData({
                    token: a.data
                });
            }
        }), this.setData({
            lottery_id: t.id,
            userinfo: a.globalData.userInfo
        }), wx.getSystemInfo({
            success: function(a) {
                var t = a.windowWidth, s = a.windowHeight;
                e.setData({
                    height: 750 * s / t - 84
                });
            }
        }), wx.showLoading(), wx.request({
            url: a.globalData.URL + "/api/wxapp/chase/getplaylist/lottery_id/" + e.data.lottery_id,
            success: function(t) {
                1 == t.data.code ? (e.setData({
                    play_list: t.data.data.list,
                    play_id: t.data.data.play_id
                }), wx.request({
                    url: a.globalData.URL + "/api/wxapp/chase/getchaseinfo/",
                    data: {
                        lottery_id: e.data.lottery_id,
                        play_id: e.data.play_id,
                        token: e.data.token
                    },
                    success: function(a) {
                        1 == a.data.code ? e.setData({
                            list: a.data.data.list,
                            zh_result: a.data.data.zh_result
                        }) : wx.showToast({
                            title: a.data.msg,
                            image: "../../images/err.png"
                        });
                    }
                })) : wx.showToast({
                    title: t.data.msg,
                    image: "../../images/err.png"
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    onShow: function() {
        this.setData({
            disabled: !1
        });
    },
    buyChase: function(t) {
        if (!a.globalData.userInfo) return wx.showModal({
            title: "未登录",
            content: "对不起,您还未登录,无法进行此操作!",
            showCancel: !1
        }), !1;
        if (this.data.buyin) {
            var e = this;
            wx.showModal({
                title: "订阅提示",
                content: "订阅本期计划将花费15积分！",
                success: function(s) {
                    s.confirm && (wx.showLoading(), wx.getStorage({
                        key: "token",
                        success: function(s) {
                            wx.request({
                                url: a.globalData.URL + "/api/wxapp/chase/buychase/",
                                data: {
                                    lottery_id: e.data.lottery_id,
                                    play_id: e.data.play_id,
                                    qs: t.currentTarget.dataset.id,
                                    token: s.data
                                },
                                success: function(t) {
                                    1 == t.data.code ? wx.request({
                                        url: a.globalData.URL + "/api/wxapp/chase/getchaseinfo/",
                                        data: {
                                            lottery_id: e.data.lottery_id,
                                            play_id: e.data.play_id,
                                            token: e.data.token
                                        },
                                        success: function(t) {
                                            1 == t.data.code ? (e.setData({
                                                list: t.data.data.list,
                                                zh_result: t.data.data.zh_result
                                            }), a.checkUsermoney()) : wx.showToast({
                                                title: t.data.msg,
                                                image: "../../images/err.png"
                                            });
                                        }
                                    }) : wx.showToast({
                                        title: t.data.msg,
                                        image: "../../images/err.png",
                                        duration: 3e3
                                    });
                                },
                                complete: function() {
                                    wx.hideLoading(), e.setData({
                                        buyin: !0
                                    });
                                }
                            });
                        }
                    }));
                }
            });
        }
    },
    refresh: function() {
        if (1 == this.data.isHideRefer) {
            this.setData({
                isHideRefer: !1
            });
            var t = this;
            setTimeout(function() {
                wx.request({
                    url: a.globalData.URL + "/api/wxapp/chase/getchaseinfo/",
                    data: {
                        lottery_id: t.data.lottery_id,
                        play_id: t.data.play_id,
                        token: t.data.token
                    },
                    success: function(a) {
                        1 == a.data.code ? t.setData({
                            list: a.data.data.list,
                            zh_result: a.data.data.zh_result
                        }) : wx.showToast({
                            title: a.data.msg,
                            image: "../../images/err.png"
                        });
                    },
                    complete: function() {
                        t.setData({
                            isHideRefer: !0
                        });
                    }
                });
            }, 2e3);
        }
    },
    navClick: function(t) {
        if (this.data.play_id != t.currentTarget.dataset.id) {
            wx.showLoading(), this.setData({
                play_id: t.currentTarget.dataset.id,
                scrollTop: 0,
                list: [],
                zh_result: []
            });
            var e = this;
            setTimeout(function() {
                wx.request({
                    url: a.globalData.URL + "/api/wxapp/chase/getchaseinfo/",
                    data: {
                        lottery_id: e.data.lottery_id,
                        play_id: e.data.play_id,
                        token: e.data.token
                    },
                    success: function(a) {
                        1 == a.data.code ? e.setData({
                            list: a.data.data.list,
                            zh_result: a.data.data.zh_result
                        }) : e.setData({
                            list: [],
                            zh_result: []
                        });
                    }
                }), wx.hideLoading();
            }, 1e3);
        }
    }
});