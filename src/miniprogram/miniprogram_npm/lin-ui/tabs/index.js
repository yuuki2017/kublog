import scrollCenter from "../behaviors/scrollCenter";
Component({
  behaviors: [scrollCenter],
  externalClasses: ["l-class-tabs", "l-class-header", "l-class-active", "l-class-content", "l-class-inactive", "l-class-line", "l-class-tabimage", "l-class-header-line", "l-class-icon", "l-tabs-class", "l-header-class", "l-active-class", "l-content-class", "l-inactive-class", "l-line-class", "l-tabimage-class", "l-header-line-class", "l-icon-class"],
  relations: {
    "../tabpanel/index": {
      type: "child",
      linked() {
        this.initTabs()
      }
    }
  },
  options: {
    multipleSlots: !0
  },
  properties: {
    activeKey: {
      type: String,
      value: ""
    },
    placement: {
      type: String,
      value: "top"
    },
    animated: Boolean,
    swipeable: Boolean,
    scrollable: Boolean,
    hasLine: {
      type: Boolean,
      value: !0
    },
    animatedForLine: Boolean,
    activeColor: {
      type: String,
      value: "#333333"
    },
    inactiveColor: {
      type: String,
      value: "#bbbbbb"
    },
    equalWidth: {
      type: Boolean,
      value: !0
    },
    contentHeight: Number
  },
  data: {
    tabList: [],
    currentIndex: 0,
    transformX: 0,
    transformY: 0
  },
  observers: {
    activeKey: function (e) {
      if (!e) return;
      const t = this.data.tabList.findIndex(t => t.key === e);
      this.setData({
        currentIndex: t
      }, () => {
        this.data.scrollable && this.queryMultipleNodes()
      })
    }
  },
  ready() {
    this.initTabs()
  },
  methods: {
    initTabs(e = this.data.activeKey) {
      let t = this.getRelationNodes("../tabpanel/index");
      if (t.length > 0) {
        let a = e,
          s = this.data.currentIndex;
        const i = t.map((t, i) => (a = e || 0 !== i ? a : t.data.key, s = t.data.key === a ? i : s, {
          tab: t.data.tab,
          key: t.data.key,
          icon: t.data.icon,
          iconSize: t.data.iconSize,
          image: t.data.image,
          picPlacement: t.data.picPlacement
        }));
        this.setData({
          tabList: i,
          activeKey: a,
          currentIndex: s
        }, () => {
          this.data.scrollable && this.queryMultipleNodes()
        })
      }
    },
    swiperChange(e) {
      const {
        source: t,
        current: a
      } = e.detail;
      if ("touch" === t) {
        const e = a,
          t = this.data.tabList[a].key;
        this._setChangeData({
          activeKey: t,
          currentIndex: e
        })
      }
    },
    handleChange(e) {
      const t = e.currentTarget.dataset.key,
        a = e.currentTarget.dataset.index;
      this._setChangeData({
        activeKey: t,
        currentIndex: a
      })
    },
    _setChangeData({
      activeKey: e,
      currentIndex: t
    }) {
      this.setData({
        activeKey: e,
        currentIndex: t
      }, () => {
        this.data.scrollable && this.queryMultipleNodes()
      }), this.triggerEvent("linchange", {
        activeKey: e,
        currentIndex: t
      })
    }
  }
});
