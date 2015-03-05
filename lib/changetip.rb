require 'HTTParty'

# interface to ChangeTip tip.me API
class Changetip
  include HTTParty
  base_uri 'api.changetip.com'
  default_params output: 'json'
  format :json

  def self.find_by_tipme_id(tipme_id)
    get('/v1/widgets/button_by_channel/',
        query: { channel: 'TipMe', username: tipme_id })
    rescue
      raise 'Error connecting to ChangeTip API'
  end
end
