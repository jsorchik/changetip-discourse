# name: changetip
# about: add a button at the end of every post allowing users to tip the author
# version: 0.1
# authors: Josh Sorchik
# url: https://github.com/jsorchik/changetip-discourse

gem 'httparty', '0.13.3'

register_asset 'javascripts/initializers/changetip.js.es6'

after_initialize do
  load File.expand_path('../controllers/changetip_controller.rb', __FILE__)
  load File.expand_path('../lib/changetip.rb', __FILE__)

  Discourse::Application.routes.prepend do
    get 'changetip/tipme_id' => 'changetip#tipme_id'
    get 'changetip/button_ids' => 'changetip#button_ids'
  end
end

register_css <<CSS

.topic-body {
  z-index: auto;
}

.changetip_tipme_button {
  margin-right: 100px;
  margin-top: 7px;
  display: inline-block;
  text-align: left;
  z-index: 501;
  position: relative;
}

CSS
