import { Button } from "discourse/views/post-menu";

export default {
  name: "changetip",

  initialize: function (container) {
    var PostMenuView = container.lookupFactory("view:post-menu");

    PostMenuView.reopen({

      shouldRerenderTipButton: Discourse.View.renderIfChanged("post.user_id"),

      buttonForTip: function (post, buffer) {
        var url = document.location.origin + post.get('url');
        var tipme_id = 'tipme'; // effectively nobody if we can't find a username

        // Create a button as a placeholder until we can make the real button
        var btn = new Button("tip", "Tip post", "", {
          className: "tip-container-" + post.get('id'),
          disabled: true
        });

        function makeAjaxCall () {
          return Discourse.ajax("/changetip/tip_id", {
            dataType: 'json',
            data: { id: post.get('user_id') },
            type: 'GET'
          });
        };

        makeAjaxCall().then(function (result) {
          tipme_id = result["tipme_id"];
          if (tipme_id != "tipme"){
            $('.tip-container-' + post.get('id'))
              .replaceWith('<div class="changetip_tipme_button" \
                data-bid="" \
                data-uid=""\
                ></div><script>(function(document,script,id){\
                var js,r=document.getElementsByTagName(script)[0],\
                protocol=/^http:/.test(document.location)?\
                \'http\':\'https\';if(!document.getElementById(id)){\
                js=document.createElement(script);js.id=id;\
                js.src=protocol+\'://widgets.changetip.com/public/js/widgets.js\';\
                r.parentNode.insertBefore(js,r)}}\
                (document,\'script\',\'changetip_w_0\'));</script>');
          }
        });
        return btn;
      }
    });
  }
};
