import validator from "../behaviors/validator";
Component({
    externalClasses: ["l-class", "l-container-class", "l-placeholder-class", "l-icon-class", "l-input-class", "l-cancel-class"],
    behaviors: [validator],
    options: {
        multipleSlots: !0
    },
    properties: {
        confirmType: {
            type: String,
            value: "search"
        },
        placeholder: String,
        cancelText: {
            type: String,
            value: "取消"
        },
        frontText: String,
        custom: Boolean,
        value: String,
        type: String,
        icon: {
            type: String,
            value: "research"
        },
        iconColor: {
            type: String,
            value: "#bdbdbd"
        },
        iconSize: {
            type: String,
            value: "28"
        },
        bgColor: {
            type: String,
            value: "#f3f3f3"
        },
        showCancel: {
            type: Boolean,
            value: !0
        },
        shape: {
            type: String,
            value: "primary",
            options: ["circle", "primary"]
        },
        textAlign: {
            type: String,
            value: "left",
            options: ["left", "right"]
        },
        focus: Boolean,
        clear: {
            type: Boolean,
            value: !0
        },
        maxlength: {
            type: Number,
            value: 140
        },
        disabled: Boolean,
        placeholderStyle: String,
        holdKeyboard: Boolean,
    },
    data: {},
    methods: {
        onCancel() {
            this.triggerEvent("lincancel", {}, {
                bubbles: !0,
                composed: !0
            })
        },
        handleInputChange(e) {
            const {
                detail: t = {}
            } = e, {
                value: l = ""
            } = t;
            this.setData({
                value: l
            }), this.triggerEvent("linchange", t)
        },
        handleInputFocus(e) {
            this.triggerEvent("linfocus", e.detail)
        },
        handleInputBlur(e) {
            this.triggerEvent("linblur", e.detail)
        },
        handleInputConfirm(e) {
            const {
                detail: t = {}
            } = e, {
                value: l = ""
            } = t;
            this.setData({
                value: l
            }), this.triggerEvent("linconfirm", t)
        },
        onClearTap(e) {
            this.setData({
                value: ""
            }), this.triggerEvent("linclear", e.detail, {
                bubbles: !0,
                composed: !0
            })
        },
        handleTapFrontText(e) {
            this.triggerEvent("linfronttap", e.detail)
        }
    }
});