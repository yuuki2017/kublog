import eventBus from "../core/utils/event-bus.js";
import validator from "../behaviors/validator";
import rules from "../behaviors/rules";
Component({
    options: {
        multipleSlots: !0
    },
    behaviors: ["wx://form-field", validator, rules],
    externalClasses: ["l-class", "l-label-class", "l-error-text", "l-error-text-class", "l-input-class"],
    properties: {
        label: String,
        hideLabel: Boolean,
        labelCustom: Boolean,
        showRow: {
            type: Boolean,
            value: !0
        },
        required: Boolean,
        placeholder: String,
        type: {
            type: String,
            value: "text",
            options: ["text", "idcard", "digit", "password", "number"]
        },
        value: String,
        colon: Boolean,
        focus: Boolean,
        clear: Boolean,
        maxlength: {
            type: Number,
            value: 140
        },
        width: {
            type: Number,
            value: null
        },
        labelWidth: {
            type: Number,
            value: 200
        },
        labelLayout: {
            type: String,
            value: "left",
            options: ["left", "right"]
        },
        disabled: Boolean,
        placeholderStyle: String,
        showEye: {
            type: Boolean,
            value: !1
        },
        holdKeyboard: Boolean
    },
    data: {},
    attached() {},
    methods: {
        handleInputChange(e) {
            const {
                detail: t = {}
            } = e, {
                value: a = ""
            } = t;
            this.setData({
                value: a
            }), eventBus.emit("lin-form-change-" + this.id, this.id), this.triggerEvent("lininput", e.detail)
        },
        handleInputFocus(e) {
            this.triggerEvent("linfocus", e.detail)
        },
        handleInputBlur(e) {
            this.validatorData({
                [this.data.name]: e.detail.value
            }), eventBus.emit("lin-form-blur-" + this.id, this.id), this.triggerEvent("linblur", e.detail)
        },
        handleInputConfirm(e) {
            const {
                detail: t = {}
            } = e, {
                value: a = ""
            } = t;
            this.setData({
                value: a
            }), this.triggerEvent("linconfirm", e.detail)
        },
        onClearTap(e) {
            this.setData({
                value: ""
            }), this.triggerEvent("linclear", e.detail)
        },
        getValues() {
            return this.data.value
        },
        reset() {
            this.setData({
                value: ""
            })
        },
        onTapEyeIcon() {
            const e = this.data.type;
            "text" === e ? this.setData({
                type: "password"
            }) : "password" === e && this.setData({
                type: "text"
            })
        }
    }
});