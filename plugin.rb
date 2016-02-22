# name: changetip
# about: add a button at the end of every post allowing users to tip the author
# version: 0.3
# authors: Josh Sorchik
# url: https://github.com/jsorchik/changetip-discourse

gem 'httparty', '0.13.3'

register_asset 'javascripts/initializers/changetip.js.es6'

after_initialize do
  require_dependency 'post_serializer'
  load File.expand_path('../controllers/changetip_controller.rb', __FILE__)
  load File.expand_path('../lib/changetip.rb', __FILE__)

  Discourse::Application.routes.prepend do
    get 'changetip/tip_uid' => 'changetip#tip_uid'
  end

  class ::PostSerializer
    attributes :changetip_uuid

    def changetip_uuid
      changetip_id = get_changetip_id
      return if changetip_id.blank?

      result = ::PluginStore.get('changetip', "tipme_id_#{changetip_id}")

      begin
        result ||= Changetip.find_by_tipme_id(tipme_id)
        if result && result['uid']
          ::PluginStore.set('changetip', "tipme_id_#{changetip_id}", result)
        end
      end

      if result && result['uid']
        result['uid']
      end
    end

    private

    def get_changetip_id
      u = object.user
      f = UserField.find_by(name: 'ChangeTip tip.me URL')

      if u.user_fields["#{f.id}"].present?
        name = ERB::Util.html_escape(u.user_fields["#{f.id}"])
        remove = %r{.tip.me/?|(http|https)://|(www.)?changetip.com/tipme/|/+}
        name = name.gsub(remove, '') if name =~ /.tip.me|changetip.com|\//
        return name
      end
    end

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
  z-index: 945;
  position: relative;
}

CSS
