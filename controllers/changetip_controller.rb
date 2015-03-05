# Controller for Changetip Discourse plugin
class ::ChangetipController < ::ApplicationController
  def tipme_id
    u = User.find_by(id: params[:id])
    f = UserField.find_by(name: 'ChangeTip Username')

    if u.user_fields["#{f.id}"].present?
      return render json: {
        tipme_id: ERB::Util.html_escape(u.user_fields["#{f.id}"]) }
    end

    render json: { tipme_id: 'tipme' }
  end

  def button_ids
    ids = ::PluginStore.get('changetip', "post_id_#{params[:post_id]}")

    if ids.nil?
      begin
        ids = Changetip.find_by_tipme_id(params[:tipme_id])
      rescue
        puts 'Error looking up changetip button'
        return render json: { uid: 'tipme', bid: 'tipme' }
      else
        if ids['uid'].present?
          ::PluginStore.set('changetip', "post_id_#{params[:post_id]}", ids)
        end
      end
    end

    render json: { uid: ids['uid'], bid: ids['button_id'] }
  end
end
