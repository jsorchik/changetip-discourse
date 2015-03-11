import { Button } from "discourse/views/post-menu";

export default {
  name: "changetip",

  initialize: function (container) {
    var PostMenuView = container.lookupFactory("view:post-menu");

    PostMenuView.reopen({

      buttonForTip: function (post, buffer) {

        function getButtonCode(uid, bid) {
          return '<div class="changetip_tipme_button" data-bid=' + bid + ' data-uid=' + uid + '></div>';
        }

        function scriptSnippet() {
          return '<script id="changetipWidgets">(function(document,script,id){var js,r=document.getElementsByTagName(script)[0],protocol=/^http:/.test(document.location)?\'http\':\'https\';if(!document.getElementById(id)){js=document.createElement(script);js.id=id;js.src=protocol+\'://widgets.changetip.com/public/js/widgets.js\';r.parentNode.insertBefore(js,r)}}(document,\'script\',\'changetip_w_0\'));</script>';
        }

        function makeButtonIdAjaxCall() {
          return Discourse.ajax("/changetip/tip_uid", {
            dataType: 'json',
            data: { id: post.get('user_id') },
            type: 'GET'
          });
        }

        // Create a button as a placeholder until we can make the real button
        var btn = new Button("tip", "tip-placeholder", "", {
          className: "tip-container-" + post.get('id'),
          disabled: true
        });

        var context = document.location.hostname + "/" +
                      post.get('topic_id') + "/" +
                      post.get('post_number') + "/";

        makeButtonIdAjaxCall().then(function(res) {
          if (!res["fail"]) {
            $('.tip-container-' + post.get('id')).
              replaceWith(getButtonCode(res["uid"], context));

            if($('#changetipWidgets').length === 0) {
              $('body').append(scriptSnippet());
            }
          }
        });

        return btn;
      }
    });
  }
};
