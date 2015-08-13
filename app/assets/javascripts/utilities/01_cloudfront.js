"use strict";
(function() {
  if (window.TradingView && window.TradingView.host && !window.TradingView.reoloadTvjs) {
    return;
  }
  var TradingView = {
    host: window.location.host.match(/eotpro\.com|mrn\.eotpro\.net|tradingview\.com|pyrrosinvestment\.com/i) == null ? "https://dwq4do82y8xi7.cloudfront.net" : "https://www.tradingview.com",
    ideasHost: "https://www.tradingview.com",
    chatHost: "https://www.tradingview.com",
    gEl: function(id) {
      return document.getElementById(id);
    },
    gId: function() {
      return "tradingview_" + ((1 + Math.random()) * 1048576 | 0).toString(16).substring(1);
    },
    onready: function(callback) {
      if (window.addEventListener) {
        window.addEventListener("DOMContentLoaded", callback, false);
      } else {
        window.attachEvent("onload", callback);
      }
    },
    css: function(css_content) {
      var head = document.getElementsByTagName("head")[0],
      style = document.createElement("style"),
      rules;
      style.type = "text/css";
      if (style.styleSheet) {
        style.styleSheet.cssText = css_content;
      } else {
        rules = document.createTextNode(css_content);
        style.appendChild(rules);
      }
      head.appendChild(style);
    },
    bindEvent: function(o, ev, fn) {
      if (o.addEventListener) {
        o.addEventListener(ev, fn, false);
      } else if (o.attachEvent) {
        o.attachEvent("on" + ev, fn);
      }
    },
    unbindEvent: function(o, ev, fn) {
      if (o.removeEventListener) {
        o.removeEventListener(ev, fn, false);
      } else if (o.detachEvent) {
        o.detachEvent("on" + ev, fn);
      }
    },
    cloneSimpleObject: function(obj) {
      if (null == obj || "object" != typeof obj) return obj;
      var copy = obj.constructor();
      for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
      }
      return copy;
    },
    generateUtmForUrlParams: function() {
      return "utmsource=" + encodeURI(window.location.hostname) + "&utmmedium=" + encodeURI(window.location.host + window.location.pathname);
    },
    WidgetAbstract: function() {},
    MiniWidget: function(options) {
      this.id = TradingView.gId();
      this.options = {
        width: TradingView.WidgetAbstract.prototype.fixSize(options.width) || 300,
        height: TradingView.WidgetAbstract.prototype.fixSize(options.height) || 400,
        symbols: options.symbols,
        tabs: options.tabs || "",
        symbols_description: options.symbols_description || "",
        customer: options.customer || "",
        container: options.container_id || "",
        large_chart_url: options.large_chart_url || "",
        gridLineColor: options.gridLineColor || "",
        fontColor: options.fontColor || "",
        underLineColor: options.underLineColor || "",
        trendLineColor: options.trendLineColor || "",
        timeAxisBackgroundColor: options.timeAxisBackgroundColor || "",
        activeTickerBackgroundColor: options.activeTickerBackgroundColor || "",
        noGraph: options.noGraph || false
      };
      this.createWidget();
    },
    MediumWidget: function(options) {
      this.id = TradingView.gId();
      this.options = {
        container: options.container_id || "",
        width: TradingView.WidgetAbstract.prototype.fixSize(options.width) || "",
        height: TradingView.WidgetAbstract.prototype.fixSize(options.height) || "",
        symbols: options.symbols,
        symbols_description: options.symbols_description || "",
        large_chart_url: options.large_chart_url || "",
        customer: options.customer || "",
        gridLineColor: options.gridLineColor || "",
        fontColor: options.fontColor || "",
        underLineColor: options.underLineColor || "",
        trendLineColor: options.trendLineColor || "",
        timeAxisBackgroundColor: options.timeAxisBackgroundColor || "",
        chartOnly: !!options.chartOnly
      };
      this.createWidget();
    },
    widget: function(options) {
      this.id = TradingView.gId();
      var _url_params = TradingView.getUrlParams();
      var _symbol = options.tvwidgetsymbol || _url_params.tvwidgetsymbol || _url_params.symbol || options.symbol || "FX:SPX500";
      var _logo = options.logo || "";
      if (_logo.src) {
        _logo = _logo.src;
      }
      this.options = {
        width: options.width || 800,
        height: options.height || 500,
        symbol: _symbol,
        interval: options.interval || "1",
        timezone: options.timezone || "",
        autosize: options.autosize,
        hide_top_toolbar: options.hide_top_toolbar,
        hide_side_toolbar: options.hide_side_toolbar,
        allow_symbol_change: options.allow_symbol_change,
        save_image: options.save_image !== undefined ? options.save_image : true,
        container: options.container_id || "",
        toolbar_bg: options.toolbar_bg || "f4f7f9",
        watchlist: options.watchlist || [],
        studies: options.studies || [],
        theme: options.theme || "",
        style: options.style || "",
        extended_hours: options.extended_hours === undefined ? undefined : +options.extended_hours,
        eotprobtn: !!options.eotprobtn,
        details: !!options.details,
        news: !!options.news,
        calendar: !!options.calendar,
        hotlist: !!options.hotlist,
        hideideas: !!options.hideideas,
        hideideasbutton: !!options.hideideasbutton,
        widgetbar_width: +options.widgetbar_width || undefined,
        withdateranges: options.withdateranges || "",
        customer: options.customer || "",
        venue: options.venue,
        symbology: options.symbology,
        logo: _logo,
        show_popup_button: !!options.show_popup_button,
        popup_height: options.popup_height || "",
        popup_width: options.popup_width || "",
        studies_overrides: options.studies_overrides,
        overrides: options.overrides,
        enabled_features: options.enabled_features,
        disabled_features: options.disabled_features,
        publish_source: options.publish_source || "",
        enable_publishing: options.enable_publishing,
        idea_url: options.idea_url,
        whotrades: options.whotrades || false,
        locale: options.locale
      };
      if (options.cme) this.options.customer = "cme";
      if (options.news && options.news.length) {
        this.options.news_vendors = [];
        for (var i = 0; i < options.news.length; i++) {
          switch (options.news[i]) {
            case "headlines":
            case "stocktwits":
            this.options.news_vendors.push(options.news[i]);
          }
        }
        if (!this.options.news_vendors) {
          delete this.options.news_vendors;
        }
      }
      if (isFinite(options.widgetbar_width) && options.widgetbar_width > 0) {
        this.options.widgetbar_width = options.widgetbar_width;
      }
      this._ready_handlers = [];
      this.create();
    },
    chart: function(options) {
      this.id = TradingView.gId();
      this.is_fullscreen = false;
      this.options = {
        width: options.width || 640,
        height: options.height || 500,
        container: options.container_id || "",
        realtime: options.realtime,
        chart: options.chart
      };
      this._ready_handlers = [];
      this.create();
    },
    WidgetPopup: function(options) {
      this.id = TradingView.gId();
      this.options = {
        callback: typeof options.callback === "function" ? options.callback : function() {},
        width: options.width || 800,
        height: options.height || 600,
        symbol: options.symbol,
        interval: options.interval || "1",
        toolbar_bg: options.toolbar_bg || "f4f7f9",
        theme: options.theme || "",
        hide_side_toolbar: !!options.hide_side_toolbar
      };
      this.create();
    },
    IdeasStreamWidget: function(options) {
      this.id = TradingView.gId();
      this.options = {
        container: options.container_id || "",
        width: options.width || 486,
        height: options.height || 670,
        symbol: options.symbol || "",
        username: options.username || "",
        mode: options.mode || "",
        userProfileUrl: options.userProfileUrl || "",
        ideaUrl: options.ideaUrl || "",
        publishSource: options.publishSource || "",
        sort: options.sort,
        stream: options.stream,
        interval: options.interval,
        time: options.time,
        waitSymbol: options.waitSymbol,
        hideDescription: options.hideDescription,
        startingCount: options.startingCount,
        bgColor: options.bgColor || "",
        headerColor: options.headerColor || "",
        borderColor: options.borderColor || ""
      };
      this._ready_handlers = [];
      this.createWidget(options);
    },
    IdeaWidget: function(options) {
      this.id = TradingView.gId();
      this.options = {
        container: options.container_id || "",
        width: options.width || 486,
        height: options.height || 670,
        idea: options.idea || "",
        userProfileUrl: options.userProfileUrl || "",
        chartUrl: options.chartUrl || "",
        whotrades: options.whotrades || false
      };
      this.createWidget(options);
    },
    ChatWidgetEmbed: function(options) {
      this.id = TradingView.gId();
      this.options = {
        container: options.container_id || "",
        width: options.width || 400,
        height: options.height || 500,
        room: options.room || "",
        whotrades: options.whotrades || false
      };
      this.createWidget(options);
    },
    UserInfoWidget: function(options) {
      this.options = {
        container: options.container_id || "",
        width: options.width || 1040,
        height: options.height || 340,
        username: options.username || ""
      };
      this.createWidget(options);
    },
    QuotesProvider: function(options) {
      var id = TradingView.gId();
      var options = {
        container: options.container_id,
        symbols: options.symbols || []
      };
      var widget_url = TradingView.host + "/embed-quotes-provider/?" + TradingView.generateUtmForUrlParams();
      var widget_html = "<iframe" + ' id="' + id + '"' + ' src="' + widget_url + '"' + ' width="0" height="0"' + ' frameborder="0" allowTransparency="true" scrolling="no"></iframe>';
      var iframe, postMessage;
      addWidget(widget_html, options.container);
      iframe = TradingView.gEl(id);
      postMessage = TradingView.postMessageWrapper(iframe.contentWindow, id);
      TradingView.bindEvent(iframe, "load", function() {
        options.symbols.forEach(resolveSymbol);
      });

      function resolveSymbol(symbolObj) {
        var symbol = symbolObj.symbol;
        var success = symbolObj.success;
        var error = symbolObj.error;
        if (!symbol || !(success && error)) return;
        postMessage.post(iframe.contentWindow, "resolveSymbol", {
          symbol: symbol
        });
        if (success) {
          postMessage.on("success" + symbol, function(data) {
            success(data);
          });
        }
        if (error) {
          postMessage.on("error" + symbol, function(data) {
            error(data);
          });
        }
      }
    }
  };
  TradingView.WidgetAbstract.prototype = {
    fixSize: function(size) {
      return /^[0-9]+(\.|,[0-9])*$/.test(size) ? size + "px" : size;
    },
    width: function() {
      if (this.options.autosize) {
        return "100%";
      }
      return TradingView.WidgetAbstract.prototype.fixSize(this.options.width);
    },
    height: function() {
      if (this.options.autosize) {
        return "100%";
      }
      return TradingView.WidgetAbstract.prototype.fixSize(this.options.height);
    },
    addWrapperFrame: function(widgetCode, logoCode, widgetBgColor) {
      var height = TradingView.WidgetAbstract.prototype.height.call(this);
      var width = TradingView.WidgetAbstract.prototype.width.call(this);
      var widgetBgColor = widgetBgColor || "transparent";
      return '<div id="' + this.id + '-wrapper" style="' + "position: relative;" + "box-sizing: content-box;" + "width: " + width + ";" + "height: " + height + ";" + "margin: 0;" + "padding: 0;" + "font-family:Arial,sans-serif;" + '">' + '<div style="' + "width: " + width + ";" + "height: " + height + ";" + "background: " + widgetBgColor + ";" + '">' + widgetCode + "</div>" + (logoCode || "") + "</div>";
    },
    addFooterLogo: function(widgetCode, options) {
      var greyText = (options || {}).greyText || "powered by";
      var linkText = (options || {}).linkText || "tradingview.com";
      var href = (options || {}).href || "https://www.tradingview.com/";
      return TradingView.WidgetAbstract.prototype.addWrapperFrame.call(this, widgetCode, '<div style="' + "position:absolute;" + "display: block;" + "box-sizing: content-box;" + "height: 24px;" + "width: " + TradingView.WidgetAbstract.prototype.width.call(this) + ";" + "bottom: 0;" + "left: 0;" + "margin: 0;" + "padding: 0;" + "font-family: Arial,sans-serif;" + '">' + '<div style="' + "display: block;" + "margin: 0 1px 1px 1px;" + "line-height: 7px;" + "box-sizing: content-box;" + "height: 11px;" + "padding: 6px 10px;" + "text-align: right;" + "background: #fff;" + '">' + "<a" + ' href="' + href + "?" + TradingView.generateUtmForUrlParams() + '"' + ' target="_blank"' + ' style="' + "color: #0099d4;" + "text-decoration: none;" + "font-size: 11px;" + '"' + ">" + '<span style="' + "color: #b4b4b4;" + "font-size: 11px;" + '">' + greyText + "</span> " + linkText + "</a>" + "</div>" + "</div>", "#fff");
    }
  };
  TradingView.UserInfoWidget.prototype = {
    createWidget: function() {
      var widget_html = this.widgetCode();
      addWidget(widget_html, this.options.container);
    },
    widgetCode: function() {
      var query = TradingView.createUrlParams({
        username: this.options.username
      });
      var utm = "&" + TradingView.generateUtmForUrlParams();
      var widget_url = TradingView.ideasHost + "/user-info-widget/?" + query + utm;
      return "<iframe" + ' src="' + widget_url + '"' + (this.options.width ? ' width="' + this.options.width + '"' : "") + (this.options.height ? ' height="' + this.options.height + '"' : "") + ' frameborder="0" allowTransparency="true" scrolling="no"></iframe>';
    }
  };
  TradingView.ChatWidgetEmbed.prototype = {
    createWidget: function() {
      var widget_code = this.widgetCode();
      widget_code = TradingView.WidgetAbstract.prototype.addFooterLogo.call(this, widget_code);
      addWidget(widget_code, this.options.container);
    },
    widgetCode: function() {
      var room = this.options.room ? "#" + encodeURIComponent(this.options.room) : "";
      var whotrades = this.options.whotrades ? "?whotrades=" + encodeURIComponent(this.options.whotrades) : "";
      var widget_url = TradingView.chatHost + "/chatwidgetembed/" + whotrades + room;
      return "<iframe" + ' src="' + widget_url + '"' + (this.options.width ? ' width="' + this.options.width + '"' : "") + (this.options.height ? ' height="' + this.options.height + '"' : "") + ' frameborder="0" allowTransparency="true" scrolling="no"></iframe>';
    }
  };
  TradingView.IdeaWidget.prototype = {
    createWidget: function() {
      var widget_html = this.widgetCode();
      addWidget(widget_html, this.options.container);
      var self = this;
      var c = TradingView.gEl(this.id);
      this.postMessage = TradingView.postMessageWrapper(c.contentWindow, this.id);
      this.postMessage.on("resize", function(data) {
        if (data.id == self.id) {
          c.style.height = data.height + "px";
        }
      }, true);
    },
    widgetCode: function() {
      var query = TradingView.createUrlParams({
        id: this.id,
        width: this.options.width,
        height: this.options.height,
        idea: this.options.idea,
        profile_url: this.options.userProfileUrl,
        chart_url: this.options.chartUrl,
        whotrades: this.options.whotrades
      });
      var utm = "&" + TradingView.generateUtmForUrlParams();
      var widget_url = TradingView.ideasHost + "/idea-popup/?" + query + utm;
      return '<iframe id="' + this.id + '"' + ' src="' + widget_url + '"' + ' width="' + this.options.width + '"' + (this.options.height ? ' height="' + this.options.height + '"' : "") + ' frameborder="0" allowTransparency="true" scrolling="no"></iframe>';
    },
    getSymbol: function(callback) {
      this.postMessage.on("symbolInfo", callback);
    }
  };
  TradingView.IdeasStreamWidget.prototype = {
    createWidget: function() {
      var widget_html = this.widgetCode();
      addWidget(widget_html, this.options.container);
      var self = this;
      var c = TradingView.gEl(this.id);
      this.postMessage = TradingView.postMessageWrapper(c.contentWindow, this.id);
      TradingView.bindEvent(c, "load", function() {
        self._ready = true;
        for (var i = self._ready_handlers.length; i--;) {
          self._ready_handlers[i].call(self);
        }
      });
      self.postMessage.on("resize", function(data) {
        if (data.id == self.id) {
          var minHeight = 450;
          var height = Math.max(data.height, minHeight);
          c.style.height = height + "px";
        }
      }, true);
    },
    widgetCode: function() {
      var query = TradingView.createUrlParams({
        id: this.id,
        width: this.options.width,
        height: this.options.height,
        symbol: this.options.symbol,
        username: this.options.username,
        mode: this.options.mode,
        profile_url: this.options.userProfileUrl,
        idea_url: this.options.ideaUrl,
        publish_source: this.options.publishSource,
        sort: this.options.sort,
        stream: this.options.stream,
        interval: this.options.interval,
        time: this.options.time,
        wait_symbol: this.options.waitSymbol,
        request_host: TradingView.ideasHost,
        hide_desc: this.options.hideDescription,
        s_count: this.options.startingCount,
        bg_color: this.options.bgColor,
        h_color: this.options.headerColor,
        borderColor: this.options.borderColor
      });
      var widget_url = TradingView.host + "/ideaswidgetembed/?" + query;
      return '<iframe id="' + this.id + '"' + ' src="' + widget_url + '"' + ' width="' + this.options.width + '"' + (this.options.height ? ' height="' + this.options.height + '"' : "") + ' frameborder="0" allowTransparency="true" scrolling="no"></iframe>';
    },
    setSymbol: function(symbol) {
      var c = TradingView.gEl(this.id);
      this.postMessage.post(c.contentWindow, "setSymbol", symbol);
    },
    ready: function(callback) {
      if (this._ready) {
        callback.call(this);
      } else {
        this._ready_handlers.push(callback);
      }
    }
  };
  TradingView.MiniWidget.prototype = {
    createWidget: function() {
      var widget_code = this.widgetCode();
      if (!this.options.noLogoOverlay) {
        widget_code = TradingView.WidgetAbstract.prototype.addFooterLogo.call(this, widget_code, {
          greyText: "Quotes by",
          linkText: "TradingView"
        });
      }
      addWidget(widget_code, this.options.container);
    },
    widgetCode: function() {
      var symbols = "";
      var tabs = "";
      var symbols_description = "";
      var site_path = "/miniwidgetembed/";
      var width = this.options.width ? "&width=" + encodeURIComponent(this.options.width) : "";
      var height = this.options.height ? "&height=" + encodeURIComponent(this.options.height) : "";
      var no_graph = this.options.noGraph ? "&noGraph=" + encodeURIComponent(this.options.noGraph) : "";
      var utm = "&" + TradingView.generateUtmForUrlParams();
      var plain_params_list = ["large_chart_url", "gridLineColor", "fontColor", "underLineColor", "trendLineColor", "activeTickerBackgroundColor", "timeAxisBackgroundColor"];
      var plain_params = "";
      for (var i = plain_params_list.length - 1; i >= 0; i--) {
        var param_name = plain_params_list[i];
        var param_value = this.options[param_name];
        plain_params += param_value ? "&" + param_name + "=" + encodeURIComponent(param_value) : "";
      }
      var prepareSymbols = function(symbols) {
        var _symbols = [];
        for (var i = 0; i < symbols.length; i++) {
          var _s = symbols[i];
          if (Object.prototype.toString.call(_s) === "[object Array]") {
            var customSymbolName = encodeURIComponent(_s[0]);
            var trueSymbolName = encodeURIComponent(_s[1]);
            _symbols.push(customSymbolName);
            symbols_description += "&" + customSymbolName + "=" + trueSymbolName;
          } else if (typeof _s === "string") {
            _symbols.push(encodeURIComponent(_s));
          }
        }
        return _symbols.join(",");
      };
      if (this.options.tabs) {
        for (var i = 0, tl = this.options.tabs.length; i < tl; i++) {
          var tab = this.options.tabs[i];
          if (this.options.symbols[tab]) {
            symbols += (symbols ? "&" : "") + tab + "=" + prepareSymbols(this.options.symbols[tab]);
          }
        }
        tabs = "&tabs=" + encodeURIComponent(this.options.tabs.join(","));
      } else {
        if (this.options.symbols) {
          symbols = "symbols=" + prepareSymbols(this.options.symbols);
        }
      }
      if (this.options.symbols_description) {
        for (var key in this.options.symbols_description) {
          symbols_description += "&" + encodeURIComponent(key) + "=" + encodeURIComponent(this.options.symbols_description[key]);
        }
      }
      if (this.options.customer) {
        site_path = "/" + this.options.customer + site_path;
      }
      var widget_url = TradingView.host + site_path + "?" + symbols + tabs + symbols_description + plain_params + width + height + no_graph + utm;
      return '<iframe id="tradingview_widget"' + ' src="' + widget_url + '"' + ' width="' + this.options.width + '"' + (this.options.height ? ' height="' + this.options.height + '"' : "") + ' frameborder="0" allowTransparency="true" scrolling="no"></iframe>';
    },
    remove: function() {
      var widget = TradingView.gEl("tradingview_widget");
      widget.parentNode.removeChild(widget);
    }
  };
  TradingView.MediumWidget.prototype = {
    createWidget: function() {
      var widget_code = this.widgetCode();
      if (!this.options.noLogoOverlay) {
        widget_code = TradingView.WidgetAbstract.prototype.addFooterLogo.call(this, widget_code, {
          greyText: "Quotes by",
          linkText: "TradingView"
        });
      }
      addWidget(widget_code, this.options.container);
    },
    widgetCode: function() {
      var symbols_description = "";
      var symbols = "symbols=" + prepareSymbols(this.options.symbols);
      var width = "&width=" + encodeURIComponent(this.options.width);
      var height = "&height=" + encodeURIComponent(this.options.height);
      var utm = "&" + TradingView.generateUtmForUrlParams();

      function prepareSymbols(symbols) {
        var _symbols = [];
        for (var i = 0; i < symbols.length; i++) {
          var _s = symbols[i];
          if (Object.prototype.toString.call(_s) === "[object Array]") {
            var customSymbolName = encodeURIComponent(_s[0]);
            var trueSymbolName = encodeURIComponent(_s[1]);
            _symbols.push(customSymbolName);
            symbols_description += "&" + customSymbolName + "=" + trueSymbolName;
          } else if (typeof _s === "string") {
            _symbols.push(encodeURIComponent(_s));
          }
        }
        return _symbols.join(",");
      }
      var plain_params_list = ["gridLineColor", "fontColor", "underLineColor", "trendLineColor", "activeTickerBackgroundColor", "timeAxisBackgroundColor"];
      var plain_params = "";
      for (var i = plain_params_list.length - 1; i >= 0; i--) {
        var param_name = plain_params_list[i];
        var param_value = this.options[param_name];
        plain_params += param_value ? "&" + param_name + "=" + encodeURIComponent(param_value) : "";
      }
      var chart_only = this.options.chartOnly ? "&chartOnly=1" : "";
      var site_path = "/mediumwidgetembed/";
      if (this.options.customer) {
        site_path = "/" + this.options.customer + site_path;
      }
      var widget_url = TradingView.host + site_path + "?" + symbols + symbols_description + plain_params + chart_only + width + height + utm;
      var style = this.options.width || this.options.height ? ' style="' + (this.options.width ? "width: " + this.options.width + "; " : "") + (this.options.height ? "height: " + this.options.height + ";" : " ") + '"' : "";
      return '<iframe id="tradingview_widget"' + ' src="' + widget_url + '"' + style + ' frameborder="0" allowTransparency="true" scrolling="no"></iframe>';
    },
    remove: function() {
      var widget = TradingView.gEl("tradingview_widget");
      widget.parentNode.removeChild(widget);
    }
  };
  TradingView.widget.prototype = {
    create: function() {
      var widget_html = this.render(),
      self = this,
      c;
      if (!this.options.noLogoOverlay) {
        widget_html = TradingView.WidgetAbstract.prototype.addWrapperFrame.call(this, widget_html);
      }
      addWidget(widget_html, this.options.container);
      c = TradingView.gEl(this.id);
      this.postMessage = TradingView.postMessageWrapper(c.contentWindow, this.id);
      TradingView.bindEvent(c, "load", function() {
        self.postMessage.get("widgetReady", {}, function() {
          var i;
          self._ready = true;
          for (i = self._ready_handlers.length; i--;) {
            self._ready_handlers[i].call(self);
          }
        });
      });
      self.postMessage.on("logoCreated", function(data) {
        if (data.left && data.bottom && data.width && data.height && data.href) {
          if (self._logoOverlay) {
            self._logoOverlay.parentNode.removeChild(self._logoOverlay);
            delete self._logoOverlay;
          }
          var a = document.createElement("a");
          if (data.text) {
            a.innerHTML = data.text;
            a.style.color = "transparent";
          }
          a.style.position = "absolute";
          a.style.display = "inline-block";
          a.style.left = data.left;
          a.style.bottom = data.bottom;
          a.style.width = data.width;
          a.style.height = data.height;
          a.style.backgroundColor = "transparent";
          a.href = data.href;
          a.setAttribute("target", "_blank");
          self._logoOverlay = a;
          TradingView.gEl(self.id + "-wrapper").appendChild(a);
        }
      });
      self.postMessage.on("setLogoOverlayVisibility", function(data) {
        if (self._logoOverlay && data && typeof data.visible == "boolean") {
          self._logoOverlay.style.display = data.visible ? "inline-block" : "none";
        }
      });
      self.postMessage.on("openChartInPopup", function(data) {
        var urlOptions = TradingView.cloneSimpleObject(self.options);
        var chartProps = ["symbol", "interval"];
        for (var i = chartProps.length - 1; i >= 0; i--) {
          var name = chartProps[i];
          var value = data[name];
          if (value) {
            urlOptions[name] = value;
          }
        }
        urlOptions.show_popup_button = false;
        var width = self.options.popup_width || 900;
        var height = self.options.popup_height || 600;
        var left = (screen.width - width) / 2;
        var top = (screen.height - height) / 2;
        window.open(self.generateUrl(urlOptions), "_blank", "resizable=yes, top=" + top + ", left=" + left + ", width=" + width + ", height=" + height);
      });
    },
    ready: function(callback) {
      if (this._ready) {
        callback.call(this);
      } else {
        this._ready_handlers.push(callback);
      }
    },
    render: function() {
      var url = this.generateUrl();
      return '<iframe id="' + this.id + '"' + ' src="' + url + '"' + (this.options.autosize ? ' style="width: 100%; height: 100%;"' : ' width="' + this.options.width + '"' + ' height="' + this.options.height + '"') + ' frameborder="0" allowTransparency="true" scrolling="no" allowfullscreen></iframe>';
    },
    generateUrl: function(options) {
      var options = options || this.options;
      var site_path;
      if (options.customer === "cme") {
        site_path = "/cmewidgetembed/";
      } else if (options.customer) {
        site_path = "/" + options.customer + "/widgetembed/";
      } else {
        site_path = "/widgetembed/";
      }

      function arg(name, content, argNameOverride) {
        argNameOverride = argNameOverride || name;
        return options[name] ? "&" + argNameOverride + "=" + content : "";
      }

      function jsonArg(name, content, defaultValue) {
        defaultValue = defaultValue || {};
        return "&" + name + "=" + (options[name] ? encodeURIComponent(JSON.stringify(content)) : encodeURIComponent(JSON.stringify(defaultValue)));
      }
      var host = options.enable_publishing ? TradingView.ideasHost : TradingView.host;
      var url = host + site_path + "?symbol=" + encodeURIComponent(options.symbol) + "&interval=" + encodeURIComponent(options.interval) + (options.hide_top_toolbar ? "&hidetoptoolbar=1" : "") + (typeof options.hide_side_toolbar === "undefined" ? "" : "&hidesidetoolbar=" + (options.hide_side_toolbar ? "1" : "0")) + (typeof options.allow_symbol_change === "undefined" ? "" : "&symboledit=" + (options.allow_symbol_change ? "1" : "0")) + (!options.save_image ? "&saveimage=0" : "") + "&toolbarbg=" + options.toolbar_bg.replace("#", "") + (options.watchlist && options.watchlist.length && options.watchlist.join ? "&watchlist=" + encodeURIComponent(options.watchlist.join("")) : "") + arg("details", "1") + arg("calendar", "1") + arg("hotlist", "1") + arg("news", "1") + (options.news_vendors ? "&newsvendors=" + encodeURIComponent(options.news_vendors.join("")) : "") + (options.studies ? "&studies=" + encodeURIComponent(options.studies.join("")) : "") + arg("widgetbar_width", options.widgetbar_width, "widgetbarwidth") + arg("hideideas", "1") + arg("theme", encodeURIComponent(options.theme)) + arg("style", encodeURIComponent(options.style)) + (options.extended_hours === undefined ? "" : "&extended_hours=" + options.extended_hours) + arg("timezone", encodeURIComponent(options.timezone)) + arg("eotprobtn", "1") + arg("hideideasbutton", "1") + arg("withdateranges", "1") + arg("logo", encodeURIComponent(options.logo)) + arg("show_popup_button", "1", "showpopupbutton") + jsonArg("studies_overrides", options.studies_overrides, {}) + jsonArg("overrides", options.overrides, {}) + jsonArg("enabled_features", options.enabled_features, []) + jsonArg("disabled_features", options.disabled_features, []) + (options.show_popup_button ? "&showpopupbutton=1" : "") + (options.publish_source ? "&publishsource=" + encodeURIComponent(options.publish_source) : "") + (options.enable_publishing ? "&enablepublishing=" + encodeURIComponent(options.enable_publishing) : "") + (options.idea_url ? "&idea_url=" + encodeURIComponent(options.idea_url) : "") + (options.venue ? "&venue=" + encodeURIComponent(options.venue) : "") + (options.symbology ? "&symbology=" + encodeURIComponent(options.symbology) : "") + (options.whotrades ? "&whotrades=" + encodeURIComponent(options.whotrades) : "") + (options.locale ? "&locale=" + options.locale : "") + "&" + TradingView.generateUtmForUrlParams();
      return url;
    },
    image: function(callback) {
      this.postMessage.get("imageURL", {}, function(id) {
        var link = TradingView.host + "/x/" + id + "/";
        callback(link);
      })
    },
    subscribeToQuote: function(callback) {
      var c = TradingView.gEl(this.id);
      this.postMessage.post(c.contentWindow, "quoteSubscribe");
      this.postMessage.on("quoteUpdate", callback);
    },
    saveChart: function(callback) {
      this.postMessage.get("chartID", {}, callback);
    },
    getSymbolInfo: function(callback) {
      this.postMessage.get("symbolInfo", {}, callback);
    },
    remove: function() {
      var widget = TradingView.gEl(this.id);
      widget.parentNode.removeChild(widget);
    },
    reload: function() {
      var widget = TradingView.gEl(this.id),
      parent = widget.parentNode;
      parent.removeChild(widget);
      parent.innerHTML = this.render();
    }
  };
  TradingView.chart.prototype = {
    create: function() {
      var chart_html = this.render(),
      self = this,
      a, c, f;
      if (!TradingView.chartCssAttached) {
        TradingView.css(this.renderCss());
        TradingView.chartCssAttached = true;
      }
      addWidget(chart_html, this.options.container);
      c = TradingView.gEl(this.id);
      a = TradingView.gEl(this.id + "_actions");
      f = TradingView.gEl(this.id + "_fullscreen");
      TradingView.bindEvent(c, "load", function() {
        var i;
        a.style.display = "block";
        self._ready = true;
        for (i = self._ready_handlers.length; i--;) {
          self._ready_handlers[i].call(self);
        }
      });
      TradingView.bindEvent(f, "click", function() {
        self.toggleFullscreen();
      });
      TradingView.onready(function() {
        var rf = false;
        if (document.querySelector && document.querySelector('a[href$="/v/' + self.options.chart + '/"]')) {
          rf = true;
        }
        if (!rf) {
          var anchors = document.getElementsByTagName("a");
          var re_short = new RegExp("/v/" + self.options.chart + "/$");
          var re_full = new RegExp("/chart/([0-9a-zA-Z:+*-/()]+)/" + self.options.chart);
          var re_script = new RegExp("/script/" + self.options.chart);
          for (var i = 0; i < anchors.length; i++) {
            if (re_short.test(anchors[i].href) || re_full.test(anchors[i].href)) {
              rf = true;
              break;
            }
          }
        }
        if (rf) {
          c.src += "#nolinks";
          c.name = "nolinks";
        }
      });
      this.postMessage = TradingView.postMessageWrapper(c.contentWindow, this.id);
    },
    ready: TradingView.widget.prototype.ready,
    renderCss: function() {
      var url = TradingView.host;
      return ".tradingview-widget {position: relative;}.tradingview-widget .chart-actions-float {display: none; position: absolute; z-index: 5; top: 0; right: 0; background: #fff; border: 1px solid #bfbfbf; border-radius: 0 3px 0 3px; padding: 3px 3px 3px 3px; height: 23px;}.tradingview-widget .chart-actions-float .tradingview-button {font-weight: normal; font-size: 11px; padding: 3px 5px;}.tradingview-widget .chart-actions-float .status-picture {margin: 4px 1px 0 3px; border: none !important; padding: 0 !important; background: none !important;}.tradingview-widget .chart-status-picture {position: absolute; z-index: 50;}.tradingview-widget .icon {display: inline-block; background: url('" + url + "/static/images/icons.png') 0 0 no-repeat; position: relative;}.tradingview-widget .icon-action-realtime{background-position: -120px -80px; width: 15px; height: 15px; left: -1px; vertical-align: top;}.tradingview-widget .icon-action-zoom{background-position: -100px -80px; width: 15px; height: 15px; left: -1px; vertical-align: top;}.tradingview-widget .exit-fullscreen {z-index: 16; position: fixed; top: -1px; left: 50%; display: none; opacity: 0.6; background: #f9f9f9; color: #848487; border-radius: 0 0 3px 3px; border: 1px solid #b2b5b8; font-size: 11px; width: 116px; font-weight: bold; padding: 2px 4px; cursor: default; margin: 0 0 0 -62px;}.tradingview-widget .exit-fullscreen:hover {opacity: 1;}.tradingview-widget .tradingview-button {padding: 6px 10px 5px; height: 15px; display: inline-block; vertical-align: top; text-decoration: none !important;color: #6f7073; cursor: pointer;border: 1px solid #b2b5b8; font: bold 12px Calibri, Arial; background: url('" + url + "/static/images/button-bg.png') 0 0 repeat-x; border-radius: 3px; -moz-border-radius: 3px; -webkit-user-select: none;-moz-user-select: none;-o-user-select: none;user-select: none; box-sizing: content-box; -moz-box-sizing: content-box; -webkit-box-sizing: content-box;}.tradingview-widget .tradingview-button:hover, .tv-button:active {background-position: 0 -26px; color: #68696b;}";
    },
    render: function() {
      var url = TradingView.host;
      return '<div class="tradingview-widget" style="width: ' + this.options.width + "px; height: " + this.options.height + 'px;">' + '<div id="' + this.id + '_actions" class="chart-actions-float">' + '<a id="' + this.id + '_fullscreen" class="tradingview-button"><span class="icon icon-action-zoom"></span> Full Screen</a> ' + '<a id="' + this.id + '_live" class="tradingview-button" target="_blank" href="https://www.tradingview.com/chart/?clone=' + this.options.chart + '">' + '<span class="icon icon-action-realtime"></span> Make It Live' + "</a> " + "</div>" + '<iframe id="' + this.id + '"' + ' src="' + url + "/embed/" + this.options.chart + "/?method=script&" + TradingView.generateUtmForUrlParams() + '"' + ' width="' + this.options.width + '"' + ' height="' + this.options.height + '"' + ' frameborder="0" allowTransparency="true" scrolling="no"></iframe>' + "</div>";
    },
    windowSize: function() {
      var w = 0,
      h = 0;
      if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
        w = document.documentElement.clientWidth;
        h = document.documentElement.clientHeight;
      } else if (typeof window.innerWidth == "number") {
        w = window.innerWidth;
        h = window.innerHeight;
      } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
        w = document.body.clientWidth;
        h = document.body.clientHeight;
      }
      return {
        width: w,
        height: h
      };
    },
    toggleFullscreen: function() {
      var frame = TradingView.gEl(this.id),
      actions = TradingView.gEl(this.id + "_actions"),
      ws = this.windowSize();
      if (this.is_fullscreen) {
        frame.style.position = "static";
        frame.style.width = this.options.width + "px";
        frame.style.height = this.options.height + "px";
        frame.style.zIndex = "auto";
        frame.style.backgroundColor = "transparent";
        actions.style.position = "absolute";
        actions.style.zIndex = "auto";
        TradingView.unbindEvent(document, "keydown", this.getKeyHandler());
      } else {
        frame.style.position = "fixed";
        frame.style.width = ws.width + "px";
        frame.style.height = ws.height + "px";
        frame.style.left = "0px";
        frame.style.top = "0px";
        frame.style.zIndex = "1000000";
        frame.style.backgroundColor = "#fff";
        actions.style.position = "fixed";
        actions.style.zIndex = "1000001";
        TradingView.bindEvent(document, "keydown", this.getKeyHandler());
      }
      this.is_fullscreen = !this.is_fullscreen;
    },
    getKeyHandler: function() {
      var that = this;
      if (!this.keyHandler) {
        this.keyHandler = function(e) {
          if (e.keyCode == 27) {
            that.toggleFullscreen();
          }
        };
      }
      return this.keyHandler;
    },
    getSymbolInfo: function(callback) {
      this.postMessage.get("symbolInfo", {}, callback);
    }
  };
  TradingView.showSignIn = function(options, callback) {
    var shadowBox = document.createElement("div");
    shadowBox.style.cssText = "position: fixed;" + "left: 0;" + "top: 0;" + "width: 100%;" + "height: 100%;" + " background: rgba(0, 0, 0, 0.5);" + "z-index: 120;" + " -webkit-transform: translate3d(0, 0, 0);";
    shadowBox.addEventListener("click", function() {
      document.body.removeChild(shadowBox);
    });
    document.body.appendChild(shadowBox);
    var id = TradingView.gId();
    var query = TradingView.createUrlParams({
      id: id,
      utmSourceOverride: options.utmSourceOverride
    });
    var widget_url = TradingView.ideasHost + "/authwidget/?" + query;
    var iframeOptions = {
      width: "470px",
      height: "650px"
    };
    var widget_html = '<iframe id="' + id + '"' + ' src="' + widget_url + '"' + ' width="' + iframeOptions.width + '"' + (iframeOptions.height ? ' height="' + iframeOptions.height + '"' : "") + ' frameborder="0" allowTransparency="true" scrolling="no"></iframe>';
    var container = document.createElement("div");
    container.innerHTML = widget_html;
    container.style.cssText = "position: absolute;" + "left: 50%;" + "top: 50%;" + "margin-top: -325px;" + "margin-left: -235px;";
    shadowBox.appendChild(container);
    var c = TradingView.gEl(id);
    var postMessage = TradingView.postMessageWrapper(c.contentWindow, id);
    var onClose = function(data) {
      if (data.id == id) {
        document.body.removeChild(shadowBox);
        if (data.user) {
          callback(data.user);
        }
        postMessage.off("close", onClose);
      }
    };
    postMessage.on("close", onClose, true);
  };
  TradingView.isSignedIn = function(options, callback) {
    var id = TradingView.gId();
    var query = TradingView.createUrlParams({
      id: id
    });
    var widget_url = TradingView.ideasHost + "/isauthwidget/?" + query;
    var widget_html = '<iframe id="' + id + '"' + ' src="' + widget_url + '"' + ' frameborder="0" allowTransparency="true" scrolling="no"></iframe>';
    var container = document.createElement("div");
    container.innerHTML = widget_html;
    document.body.appendChild(container);
    var c = TradingView.gEl(id);
    var postMessage = TradingView.postMessageWrapper(c.contentWindow, id);
    var onClose = function(data) {
      if (data.id == id) {
        document.body.removeChild(container);
        callback(data.user);
        postMessage.off("close", onClose);
      }
    };
    postMessage.on("close", onClose, true);
  };
  TradingView.postMessageWrapper = function() {
    var get_handlers = {},
    on_handlers = {},
    client_targets = {},
    on_target, call_id = 0,
    post_id = 0,
    provider_id = "TradingView";
    if (window.addEventListener) {
      window.addEventListener("message", function(e) {
        var msg;
        try {
          msg = JSON.parse(e.data);
        } catch (error) {
          return;
        }
        if (!msg.provider || msg.provider != provider_id) {
          return;
        }
        if (msg.type == "get") {
          if (!on_handlers[msg.name]) {
            return;
          }
          on_handlers[msg.name].forEach(function(on_handler) {
            if (typeof on_handler === "function") {
              on_handler.call(msg, msg.data, function(result) {
                var reply = {
                  id: msg.id,
                  type: "on",
                  name: msg.name,
                  client_id: msg.client_id,
                  data: result,
                  provider: provider_id
                };
                on_target.postMessage(JSON.stringify(reply), "*");
              });
            }
          });
        } else if (msg.type == "on") {
          if (get_handlers[msg.client_id] && get_handlers[msg.client_id][msg.id]) {
            get_handlers[msg.client_id][msg.id].call(msg, msg.data);
            delete get_handlers[msg.client_id][msg.id];
          }
        } else if (msg.type == "post") {
          if (!on_handlers[msg.name]) {
            return;
          }
          on_handlers[msg.name].forEach(function(on_handler) {
            if (typeof on_handler === "function") {
              on_handler.call(msg, msg.data, function() {});
            }
          });
        }
      });
    }
    return function(target, client_id) {
      get_handlers[client_id] = {};
      client_targets[client_id] = target;
      on_target = target;
      return {
        on: function(name, callback, keepPrevious) {
          if (!on_handlers[name] || !keepPrevious) {
            on_handlers[name] = [];
          }
          on_handlers[name].push(callback);
        },
        off: function(name, callback) {
          if (!on_handlers[name]) {
            return false;
          }
          var index = on_handlers[name].indexOf(callback);
          if (index > -1) {
            on_handlers[name].splice(index, 1);
          }
        },
        get: function(name, data, callback) {
          var msg = {
            id: call_id++,
            type: "get",
            name: name,
            client_id: client_id,
            data: data,
            provider: provider_id
          };
          get_handlers[client_id][msg.id] = callback;
          client_targets[client_id].postMessage(JSON.stringify(msg), "*");
        },
        post: function(target, name, data) {
          var msg = {
            id: post_id++,
            type: "post",
            name: name,
            data: data,
            provider: provider_id
          };
          if (target && typeof target.postMessage === "function") {
            target.postMessage(JSON.stringify(msg), "*");
          }
        }
      };
    };
  }();
  TradingView.getUrlParams = function() {
    var pl = /\+/g,
    search = /([^&=]+)=?([^&]*)/g,
    query = window.location.search.substring(1),
    match = search.exec(query),
    decode = function(s) {
      return decodeURIComponent(s.replace(pl, " "));
    },
    result = {};
    while (match) {
      result[decode(match[1])] = decode(match[2]);
      match = search.exec(query);
    }
    return result;
  };
  TradingView.createUrlParams = function(data) {
    var result = [];
    for (var d in data) {
      if (data.hasOwnProperty(d) && data[d] != null) {
        result.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
      }
    }
    return result.join("&");
  };
  TradingView.WidgetPopup.prototype = {
    create: function() {
      var self = this;
      var width = this.options.width || 900;
      var height = this.options.height || 600;
      var left = (screen.width - width) / 2;
      var top = (screen.height - height) / 2;
      var url = TradingView.host + "/widgetpopup/" + "?symbol=" + encodeURIComponent(this.options.symbol) + "&interval=" + encodeURIComponent(this.options.interval) + "&toolbarbg=" + this.options.toolbar_bg.replace("#", "") + (this.options.theme ? "&theme=" + encodeURIComponent(this.options.theme) : "") + "&hidesidetoolbar=" + (this.options.hide_side_toolbar ? "1" : "0") + "&" + TradingView.generateUtmForUrlParams();
      this.popupWindow = window.open(url, "", "resizable=yes,directories=no,location=no,toolbar=no,menubar=no,scrollbars=yes, top=" + top + ", left=" + left + ", width=" + width + ", height=" + height);
      this.postMessage = TradingView.postMessageWrapper(this.popupWindow, this.id);
      this.postMessage.on("pushChartId", function(data) {
        var chartID = data;
        self.onPushChartId(chartID);
      });
      if (typeof this.popupWindow === "function") {
        this.popupWindow.focus();
      }
    },
    onPushChartId: function(chartID) {
      var self = this;
      self.options.callback(chartID);
      this.popupWindow.close();
    }
  };
  var addWidget = function(widgetHtml, containerId) {
    var container = TradingView.gEl(containerId);
    if (container) {
      container.innerHTML = widgetHtml;
    } else {
      document.write(widgetHtml);
    }
  };
  if (window.TradingView && jQuery) {
    jQuery.extend(window.TradingView, TradingView);
  } else {
    window.TradingView = TradingView;
  }
})();
