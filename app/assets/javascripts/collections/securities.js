DbAlpha.Collections.Securities = Backbone.Collection.extend({
  model: DbAlpha.Models.Security,
  ops: {},

  url: function () {
    if ( this.ops.id ) {
      return "/api/security_lists/" + this.ops.id;
    } else {
      return "/api/securities?symbols=" + this.getSymbols().join(",");
    }
  },

  getOrFetch: function (value, options) {
    var security, attrs;
    if (+value) {
      attr = { id: value };
      security = this.get(value);
    } else {
      attr = { symbol: value.toUpperCase() };
      security = this.findWhere( attr );
    }
    if (!security) { security = new this.model( attr ); }
    if (!options || options.fetch) security.fetch();
    this.add(security, {reset: true});

    return security;
  },

  getSymbols: function () {
    return this.map(function (model) { return model.escape("symbol"); } );
  },

  quotes: function () {
    if (!this._quotes) {
      this._quotes = new Backbone.StocksQuery({ collection: this });
    }

    return this._quotes;
  },

  parse: function(resp, options) {
    if (resp.id) {
      this.ops.id = escape(resp.id);
      this.ops.symbol = escape(resp.symbol);
      this.ops.name = escape(resp.name).replace(/%20/g, " ").replace(/%26/g, "&");
      resp = resp.securities;
    }
    return resp;
  },

  removeNonlistMembers: function () {
    if (!this.ops.id) return;
    this.each( function (model) {
      if (model.get("list_id") != this.ops.id) {
        this.remove(model);
      }
    }.bind(this));
  },

  setID: function (value) {
    this.ops.id = value;
  },

  unsetID: function () {
    this.ops.id = this.ops.name = undefined
  },
});
