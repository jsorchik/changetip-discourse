# Controller for Changetip Discourse plugin
class ::ChangetipController < ::ApplicationController
  def tip_uid
    return render json: { fail: true } if tipme_id.nil?

    @id = ::PluginStore.get('changetip', "tipme_id_#{tipme_id}")

    begin
      @id ||= Changetip.find_by_tipme_id(tipme_id)
    rescue
      puts 'Error looking up changetip button'
      return render json: { fail: true }
    end

    set_id if @id['uid'].present?
    render json: { uid: @id['uid'] }
  end

  private

  def tipme_id
    u = User.find_by(id: params[:id])
    f = UserField.find_by(name: 'ChangeTip tip.me URL')

    if u.user_fields["#{f.id}"].present?
      name = ERB::Util.html_escape(u.user_fields["#{f.id}"])
      remove = %r{.tip.me/?|(http|https)://|(www.)?changetip.com/tipme/|/+}
      name = name.gsub(remove, '') if name =~ /.tip.me|changetip.com|\//
      return name
    end

    nil
  end

  def set_id
    ::PluginStore.set('changetip', "tipme_id_#{tipme_id}", @id)
  end
end
