import validator from "../behaviors/validator";
Component({
  externalClasses: ["l-class", "l-img-class", "l-title-class"],
  options: {
    multipleSlots: !0
  },
  behaviors: [validator],
  properties: {
    image: String,
    title: String,
    describe: String,
    plaintext: Boolean,
    full: Boolean,
    position: {
      type: String,
      value: "left",
      options: ["left", "right"]
    },
    type: {
      type: String,
      value: "primary",
      options: ["primary", "avatar", "cover"]
    },
    imageMode: {
      type: String,
      value: "scaleToFill"
    },
    titleFirstCard: {
      type: Boolean,
      default: false
    },
  },
  data: {},
  methods: {}
});
