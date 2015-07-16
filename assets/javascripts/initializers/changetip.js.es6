import { Button } from "discourse/components/post-menu";

export default {
  name: "changetip",

  initialize: function (container) {

    var PostMenuComponent = container.lookupFactory("component:post-menu");

    PostMenuComponent.reopen({

      buttonForTip: function (post, buffer) {

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

          var tipmeButtons = document.getElementsByClassName("changetip_tipme_button");
          Array.prototype.forEach.call(tipmeButtons, function(tipmeButton) {
            window.Changetip.widget.buildButtonWidget(tipmeButton);
          });
        });

        return btn;
      }
    });
  }
};
