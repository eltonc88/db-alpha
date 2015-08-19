DbAlpha.Views.Post = Backbone.View.extend({
  tagName: "li",
  className: "post-list-item article-list-item",

  template: function () {
    if (this.state === "edit") { return JST['post/post_form']; }
    if (this.state === "show") { return JST['post/post_show']; }
    return JST['post/post_list_item'];
  },

  initialize: function (options) {
    if (options) { this.symbol = options.symbol; }
    if (this.model.isNew()) { this.state = "edit"; }
    this.listenTo(this.model, "sync", this.render);
  },

  events: {
    "click input.post-submit": "submitForm",
    "click button.post-delete": "deleteForm",
    "click .post-title": "toggleShow",
    "dblclick .post-body": "toggleCondense",
    "click button.edit": "toggleEdit"
  },

  deleteForm: function (event) {
    event.preventDefault();
    if (confirm("Want to delete?")) {
      if (this.model.isNew()) {
        this._deleteSuccess();
      } else {
        this.model.destroy({
          success: this._deleteSuccess.bind(this)
        });
      }
    }
  },

  render: function () {
    var content = this.template()({
      model: this.model
    });
    this.$el.html(content);
    return this;
  },

  submitForm: function (event) {
    event.preventDefault();
    var formData = this.$("form").serializeJSON().post;
    this.model.save(formData, {
      success: this._saveSuccess.bind(this),
      errors: this._saveErrors.bind(this)
    });
  },

  toggleEdit: function () {
    this.state = "edit";
    this.render();
  },

  toggleShow: function () {
    this.state = "show";
    this.render();
  },

  toggleCondense: function () {
    this.state = null;
    this.render();
  },

  _deleteSuccess: function () {
    this.collection.remove(this.model);
  },

  _saveErrors: function (model, response) {
    var errorField = this.$("ul.form-errors").empty();
    JSON.parse(response.responseText).forEach(function (errorText) {
      var msg = $("<li>").html(errorText);
      errorField.append(msg);
    });
  },

  _saveSuccess: function () {
    this.toggleShow();
  },
});
