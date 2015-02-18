# name: changetip
# about: add a button at the end of every post allowing users to tip the author
# version: 0.1
# authors: Coinbase

register_asset 'javascripts/initializers/changetip.js.es6'

after_initialize do
  load File.expand_path('../controllers/changetip_controller.rb', __FILE__)

  Discourse::Application.routes.prepend do
    get 'changetip/tip_id' => 'changetip#tip_id'
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
