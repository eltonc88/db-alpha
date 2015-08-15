DbAlpha.Views.PostIndex = Backbone.CompositeView.extend({
  className: "post-index",
  template: JST['post/index'],

  initialize: function () {
    this.collection = this.model ? this.model.posts() : new DbAlpha.Collections.Posts([]);
    this.collection.fetch();
    this.listenTo(this.collection, "sync add remove", this.render);
    this.listenTo(this.collection, 'add', this.addPostSubview);

    this.collection.each(function (post) {
      this.addPostSubview(post);
    }.bind(this));
  },

  events: {
    "click button": "addNewForm"
  },

  addNewForm: function () {
    this.collection.add(new this.collection.model() );
  },

  addPostListItem: function (post) {
    var postListItem = new DbAlpha.Views.Post({
      model: postListItem
    });
    this.addSubview("ul.post-index", postListItem);
  },

  render: function () {
    this.$el.html( this.template() );
    this.attachSubviews();

    return this;
  }
});
