import { withPluginApi } from 'discourse/lib/plugin-api';
import { Button } from "discourse/components/post-menu";

function renderAllButtons() {
  var tipmeButtons = document.getElementsByClassName("changetip_tipme_button");
  Array.prototype.forEach.call(tipmeButtons, function(tipmeButton) {
    window.Changetip.widget.buildButtonWidget(tipmeButton);
  });
}

function oldPluginCode(container) {
  var PostMenuComponent = container.lookupFactory("component:post-menu");

  PostMenuComponent.reopen({
    buttonForTip(post) {

      function buttonSnippet(uid, bid) {
        return '<div class="changetip_tipme_button" data-bid=' + bid + ' data-uid=' + uid + '></div>';
      }

      function makeButtonIdAjaxCall() {
        return Discourse.ajax("/changetip/tip_uid", {
          dataType: 'json',
          data: { id: post.get('user_id') },
          type: 'GET'
        });
      }

      // Create a button as a placeholder until we can make the real button
      var btn = new Button("", "", "", {
        className: "tip-container-" + post.get('id'),
        disabled: true
      });

      var context = document.location.hostname + "/" +
                    post.get('topic_id') + "/" +
                    post.get('post_number') + "/";

      makeButtonIdAjaxCall().then(function(res) {
        if (!res["fail"] && !!res["uid"]) {
          $('.tip-container-' + post.get('id')).
            replaceWith(buttonSnippet(res["uid"], context));
        }
        renderAllButtons();
      });

      return btn;
    }
  });
}

class ChangeTipButton {
  constructor(uid, bid) {
    this.bid = bid;
    this.uid = uid;
  }
  init() {
    const { bid, uid } = this;
    const $button = $(`<div class="changetip_tipme_button" data-bid="${bid}" data-uid="${uid}"></div>`);
    Ember.run.next(() => renderAllButtons());
    return $button[0];
  }

  update() { }
}
ChangeTipButton.prototype.type = 'Widget';

function initializeChangeTip(api) {
  api.includePostAttributes('changetip_uuid');

  api.decorateWidget('post-menu:before', dec => {
    const attrs = dec.attrs;
    const context = document.location.hostname + "/" + attrs.topicId + "/" + attrs.post_number + "/";
    return new ChangeTipButton(attrs.changetip_uuid, context);
  });
}

export default {
  name: "changetip",

  initialize(container) {
    withPluginApi('0.1', api => initializeChangeTip(api), { noApi: () => oldPluginCode(container) });
  }
};
