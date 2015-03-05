import { Button } from "discourse/views/post-menu";

export default {
  name: "changetip",

  initialize: function (container) {
    var PostMenuView = container.lookupFactory("view:post-menu");

    PostMenuView.reopen({
      shouldRerenderTipButton: Discourse.View.renderIfChanged("post.tip_button"),

      buttonForTip: function (post, buffer) {

        function getButtonCode(uid, bid) {
          return '<div class="changetip_tipme_button" data-bid=' +
                bid + ' data-uid=' + uid +
                '></div><script>(function(document,script,id){\
                var js,r=document.getElementsByTagName(script)[0],\
                protocol=/^http:/.test(document.location)?\'http\':\'https\';\
                if(!document.getElementById(id)){js=document.createElement(script);\
                js.id=id;js.src=protocol+\'://widgets.changetip.com/public/js/widgets.js\';\
                r.parentNode.insertBefore(js,r)}}(document,\'script\',\'changetip_w_0\'));</script>';
        }

        function makeUsernameAjaxCall() {
          return Discourse.ajax("/changetip/tipme_id", {
            dataType: 'json',
            data: { id: post.get('user_id') },
            type: 'GET'
          });
        }

        function makeButtonIdAjaxCall(post_id, tipme_id) {
          return Discourse.ajax("/changetip/button_ids", {
            dataType: 'json',
            data: { post_id: post_id, tipme_id: tipme_id },
            type: 'GET'
          });
        }

        // Create a button as a placeholder until we can make the real button
        var btn = new Button("tip", "Tip post", "", {
          className: "tip-container-" + post.get('id'),
          disabled: true
        });

        makeUsernameAjaxCall().then(function(res) {
          var tipme_id = res["tipme_id"];
          if (tipme_id !== 'tipme') {
            makeButtonIdAjaxCall(post.get('id'), tipme_id).then(function(res2) {
              if (res2["uid"] !== 'tipme') {
                $('.tip-container-' + post.get('id')).
                  replaceWith(getButtonCode(res2["uid"], res2["bid"]));
                post.propertyDidChange("post.tip_button");
              }
            });
          }
        });
        return btn;
      }
    });
  }
};
