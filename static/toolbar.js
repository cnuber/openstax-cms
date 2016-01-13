

function makeRichTextEditable(id) {
    var input = $('#' + id);
    var richText = $('<div class="richtext"></div>').html(input.val());
    richText.insertBefore(input);
    input.hide();

    var removeStylingPending = false;
    function removeStyling() {
        /* Strip the 'style' attribute from spans that have no other attributes.
        (we don't remove the span entirely as that messes with the cursor position,
        and spans will be removed anyway by our whitelisting)
        */
        $('span[style]', richText).filter(function() {
            return this.attributes.length === 1;
        }).removeAttr('style');
        removeStylingPending = false;
    }

    var closestObj = input.closest('.object');

    richText.hallo({
//        toolbar:null,
//        toolbar:'halloToolbarContextual',
        toolbar: 'halloToolbarFixed',
//        toolbar:'halloToolbarInstant',
        toolbarCssClass: (closestObj.hasClass('full')) ? 'full' : (closestObj.hasClass('stream-field')) ? 'stream-field' : '',
        plugins: halloPlugins
    }).bind('hallomodified', function(event, data) {
        input.val(data.content);
        if (!removeStylingPending) {
            setTimeout(removeStyling, 100);
            removeStylingPending = true;
        }
    }).bind('paste', function(event, data) {
        setTimeout(removeStyling, 1);
    /* Animate the fields open when you click into them. */
    }).bind('halloactivated', function(event, data) {
        $(event.target).addClass('expanded', 200, function(e) {
            /* Hallo's toolbar will reposition itself on the scroll event.
            This is useful since animating the fields can cause it to be
            positioned badly initially. */
            $(window).trigger('scroll');
        });
    }).bind('hallodeactivated', function(event, data) {
        $(event.target).removeClass('expanded', 200, function(e) {
            $(window).trigger('scroll');
        });
    });
}

(function() {
  (function(jQuery) {
    return jQuery.widget('IKS.halloToolbarFixed', {
      toolbar: null,
      options: {
        parentElement: 'body',
        editable: null,
        toolbar: null,
        affix: true,
        affixTopOffset: 2
      },
      _create: function() {
        var el, widthToAdd,
          _this = this;
        this.toolbar = this.options.toolbar;
        this.toolbar.show();
        jQuery(this.options.parentElement).append(this.toolbar);
        this._bindEvents();
        jQuery(window).resize(function(event) {
          return _this.setPosition();
        });
        jQuery(window).scroll(function(event) {
          return _this.setPosition();
        });
        if (this.options.parentElement === 'body') {
          el = jQuery(this.element);
          widthToAdd = parseFloat(el.css('padding-left'));
          widthToAdd += parseFloat(el.css('padding-right'));
          widthToAdd += parseFloat(el.css('border-left-width'));
          widthToAdd += parseFloat(el.css('border-right-width'));
          widthToAdd += (parseFloat(el.css('outline-width'))) * 2;
          widthToAdd += (parseFloat(el.css('outline-offset'))) * 2;
          return jQuery(this.toolbar).css("width", el.width() + widthToAdd);
        }
      },
      _getPosition: function(event, selection) {
        var offset, position, width;
        if (!event) {
          return;
        }
        width = parseFloat(this.element.css('outline-width'));
        offset = width + parseFloat(this.element.css('outline-offset'));
        return position = {
          top: this.element.offset().top - this.toolbar.outerHeight() - offset,
          left: this.element.offset().left - offset
        };
      },
      _getCaretPosition: function(range) {
        var newRange, position, tmpSpan;
        tmpSpan = jQuery("<span/>");
        newRange = rangy.createRange();
        newRange.setStart(range.endContainer, range.endOffset);
        newRange.insertNode(tmpSpan.get(0));
        position = {
          top: tmpSpan.offset().top,
          left: tmpSpan.offset().left
        };
        tmpSpan.remove();
        return position;
      },
      setPosition: function() {
        var elementBottom, elementTop, height, offset, scrollTop, topOffset;
        if (this.options.parentElement !== 'body') {
          return;
        }
        this.toolbar.css('position', 'absolute');
        this.toolbar.css('top', this.element.offset().top - this.toolbar.outerHeight());
        if (this.options.affix) {
          scrollTop = jQuery(window).scrollTop();
          offset = this.element.offset();
          height = this.element.height();
          topOffset = this.options.affixTopOffset;
          elementTop = offset.top - (this.toolbar.height() + this.options.affixTopOffset);
          elementBottom = (height - topOffset) + (offset.top - this.toolbar.height());
          if (scrollTop > elementTop && scrollTop < elementBottom) {
            this.toolbar.css('position', 'fixed');
            this.toolbar.css('top', this.options.affixTopOffset);
          }
        } else {

        }

        return this.toolbar.css('left', this.element.offset().left - 2);
      },
      _updatePosition: function(position) {},
      _bindEvents: function() {
        var _this = this;
        this.element.on('halloactivated', function(event, data) {
          _this.setPosition();
          return _this.toolbar.show();
        });
        return this.element.on('hallodeactivated', function(event, data) {
          return _this.toolbar.hide();
        });
      }
    });
  })(jQuery);

}).call(this);



(function() {
  (function(jQuery) {
    return jQuery.widget("IKS.halloformat", {
      options: {
        editable: null,
        uuid: '',
        formattings: {
          bold: true,
          italic: true,
          strikeThrough: false,
          underline: false
        },
        buttonCssClass: null
      },
      populateToolbar: function(toolbar) {
        var buttonize, buttonset, enabled, format, widget, _ref,
          _this = this;
        widget = this;
        buttonset = jQuery("<span class=\"" + widget.widgetName + "\"></span>");
        buttonize = function(format) {
          var buttonHolder;
          buttonHolder = jQuery('<span></span>');
          buttonHolder.hallobutton({
            label: format,
            editable: _this.options.editable,
            command: format,
            uuid: _this.options.uuid,
            cssClass: _this.options.buttonCssClass
          });
          return buttonset.append(buttonHolder);
        };
        _ref = this.options.formattings;
        for (format in _ref) {
          enabled = _ref[format];
          if (!enabled) {
            continue;
          }
          buttonize(format);
        }
        buttonset.hallobuttonset();
        return toolbar.append(buttonset);
      }
    });
  })(jQuery);

}).call(this);



(function() {
  (function(jQuery) {
    return jQuery.widget("IKS.halloheadings", {
      options: {
        editable: null,
        uuid: '',
        formatBlocks: ["p", "h1", "h2", "h3"],
        buttonCssClass: null
      },
      populateToolbar: function(toolbar) {
        var buttonize, buttonset, command, format, ie, widget, _i, _len, _ref,
          _this = this;
        widget = this;
        buttonset = jQuery("<span class=\"" + widget.widgetName + "\"></span>");
        ie = navigator.appName === 'Microsoft Internet Explorer';
        command = (ie ? "FormatBlock" : "formatBlock");
        buttonize = function(format) {
          var buttonHolder;
          buttonHolder = jQuery('<span></span>');
          buttonHolder.hallobutton({
            label: format,
            editable: _this.options.editable,
            command: command,
            commandValue: (ie ? "<" + format + ">" : format),
            uuid: _this.options.uuid,
            cssClass: _this.options.buttonCssClass,
            queryState: function(event) {
              var compared, e, map, result, val, value, _i, _len, _ref;
              try {
                value = document.queryCommandValue(command);
                if (ie) {
                  map = {
                    p: "normal"
                  };
                  _ref = [1, 2, 3, 4, 5, 6];
                  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    val = _ref[_i];
                    map["h" + val] = val;
                  }
                  compared = value.match(new RegExp(map[format], "i"));
                } else {
                  compared = value.match(new RegExp(format, "i"));
                }
                result = compared ? true : false;
                return buttonHolder.hallobutton('checked', result);
              } catch (_error) {
                e = _error;
              }
            }
          });
          buttonHolder.find('button .ui-button-text').text(format.toUpperCase());
          return buttonset.append(buttonHolder);
        };
        _ref = this.options.formatBlocks;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          format = _ref[_i];
          buttonize(format);
        }
        buttonset.hallobuttonset();
        return toolbar.append(buttonset);
      }
    });
  })(jQuery);

}).call(this);


(function() {
  (function(jQuery) {
    return jQuery.widget("IKS.hallolists", {
      options: {
        editable: null,
        toolbar: null,
        uuid: '',
        lists: {
          ordered: true,
          unordered: true
        },
        buttonCssClass: null
      },
      populateToolbar: function(toolbar) {
        var buttonize, buttonset,
          _this = this;
        buttonset = jQuery("<span class=\"" + this.widgetName + "\"></span>");
        buttonize = function(type, label) {
          var buttonElement;
          buttonElement = jQuery('<span></span>');
          buttonElement.hallobutton({
            uuid: _this.options.uuid,
            editable: _this.options.editable,
            label: label,
            command: "insert" + type + "List",
            icon: "icon-list-" + (label.toLowerCase()),
            cssClass: _this.options.buttonCssClass
          });
          return buttonset.append(buttonElement);
        };
        if (this.options.lists.ordered) {
          buttonize("Ordered", "OL");
        }
        if (this.options.lists.unordered) {
          buttonize("Unordered", "UL");
        }
        buttonset.hallobuttonset();
        return toolbar.append(buttonset);
      }
    });
  })(jQuery);

}).call(this);

(function() {
  (function(jQuery) {
    return jQuery.widget("IKS.halloreundo", {
      options: {
        editable: null,
        toolbar: null,
        uuid: '',
        buttonCssClass: null
      },
      populateToolbar: function(toolbar) {
        var buttonize, buttonset,
          _this = this;
        buttonset = jQuery("<span class=\"" + this.widgetName + "\"></span>");
        buttonize = function(cmd, label) {
          var buttonElement;
          buttonElement = jQuery('<span></span>');
          buttonElement.hallobutton({
            uuid: _this.options.uuid,
            editable: _this.options.editable,
            label: label,
            icon: cmd === 'undo' ? 'icon-undo' : 'icon-repeat',
            command: cmd,
            queryState: false,
            cssClass: _this.options.buttonCssClass
          });
          return buttonset.append(buttonElement);
        };
        buttonize("undo", "Undo");
        buttonize("redo", "Redo");
        buttonset.hallobuttonset();
        return toolbar.append(buttonset);
      }
    });
  })(jQuery);

}).call(this);


