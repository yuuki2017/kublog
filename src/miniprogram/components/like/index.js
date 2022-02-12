Component({
  properties: {
    like: Boolean
  },

  methods: {
    onLike() {
      const like = this.properties.like
      this.properties.like = !like
      const behavior = this.properties.like ? "like" : "cancel"
      this.triggerEvent("like", {
        behavior: behavior
      }, {})
    }
  }
})
