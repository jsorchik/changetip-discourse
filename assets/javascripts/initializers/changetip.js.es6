import { Button } from "discourse/views/post-menu";

export default {
  name: "changetip",

  initialize: function (container) {
    var PostMenuView = container.lookupFactory("view:post-menu");

    PostMenuView.reopen({

      buttonForTip: function (post, buffer) {

        function resetCounter() {
          topic.tipCounter.remaining = Math.min(topic.chunk_size, topic.posts_count - topic.tipCounter.completed);
          if (topic.tipCounter.completed >= topic.posts_count) {
           topic.tipCounter.completed = 0;
          }
        }

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

        var root = "//www.changetip.com";

        function buildButtonWidget(button) {
          if (!!button.getAttribute("data-read")) {
              return;
          }
          button.setAttribute("data-read", "true");
          button.style.height = "22px";
          var buttonDiv = document.createElement("div");
          buttonDiv.style.height = "100%";
          buttonDiv.style.display = "inline-block";
          buttonDiv.style.position = "relative";
          var popoverIframe = buildPopoverIframe();
          var uid = button.getAttribute("data-uid");
          var buttonId = button.getAttribute("data-bid");
          loadButton(popoverIframe, uid, buttonId);
          buttonDiv.appendChild(popoverIframe);
          button.appendChild(buttonDiv);
          popoverIframe.onload = function() {
              initPopoverIframe(popoverIframe);
          };
        }

        function loadButton(f, uid, bid) {
            if (bid) {
                f.src = root + "/widget/tipme/" + uid + "?context=" + bid + "&max_age=600";
            } else {
                f.src = root + "/widget/tipme/" + uid + "?max_age=600";
            }
        }

        function buildPopoverIframe() {
            var popoverIframe = document.createElement("iframe");
            popoverIframe.style.overflow = "hidden";
            popoverIframe.setAttribute("frameborder", "0");
            popoverIframe.style.border = "none";
            popoverIframe.setAttribute("scrolling", "no");
            popoverIframe.style.height = "100%";
            popoverIframe.setAttribute("allowtransparency", "true");
            popoverIframe.setAttribute("title", "Tip Bitcoin with Changetip");
            popoverIframe.style.margin = "0";
            popoverIframe.style.padding = "0";
            popoverIframe.style.position = "absolute";
            popoverIframe.style.zIndex = 999999;
            return popoverIframe;
        }

        function getPopoverIframeByBid(bid) {
            var button = document.querySelectorAll("[data-bid='" + bid + "']")[0];
            return button.getElementsByTagName("iframe")[0];
        }

        function initPopoverIframe(popoverIframe) {
            popoverIframe.style.width = "113px";
            popoverIframe.style.minWidth = "113px";
            popoverIframe.style.maxWidth = "113px";
            popoverIframe.style.height = "100%";
        }

        function renderPopoverIframe(popoverIframe) {
            popoverIframe.style.width = "400px";
            popoverIframe.style.minWidth = "400px";
            popoverIframe.style.maxWidth = "400px";
            popoverIframe.style.height = "560px";
        }

        var topic = post.get('topic');
        if (topic.tipCounter == null) {
          topic.tipCounter = {
            remaining: 0,
            completed: 0,
            status: 0
          };

          resetCounter();
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
          if (!res["fail"]) {
            $('.tip-container-' + post.get('id')).
              replaceWith(buttonSnippet(res["uid"], context));
          }

          topic.tipCounter.remaining--; topic.tipCounter.completed++;
          if (topic.tipCounter.remaining <= 0) {
            topic.tipCounter.status++;

            window.addEventListener("message", function(msg) {
              var protocol = "https:";
              if (msg.origin != protocol + root) {
                return;
              }
              if (msg.data.click) {
                renderPopoverIframe(getPopoverIframeByBid(msg.data.bid));
                return;
              }
              if (msg.data.close) {
                initPopoverIframe(getPopoverIframeByBid(msg.data.bid));
                return;
              }
            });

            var tipmeButton = document.getElementById("changetip_tipme_button");
            if (tipmeButton) {
              buildButtonWidget(tipmeButton);
            }

            var tipmeButtons = document.getElementsByClassName("changetip_tipme_button");
            Array.prototype.forEach.call(tipmeButtons, function(tipmeButton) {
              buildButtonWidget(tipmeButton);
            });

            resetCounter();
          }
        });

        return btn;
      }
    });
  }
};
