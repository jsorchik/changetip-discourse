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

  def button_id
    @id = ::PluginStore.get('changetip', "tipme_id_#{params[:tipme_id]}")

    begin
      @id ||= Changetip.find_by_tipme_id(params[:tipme_id])
    rescue
      puts 'Error looking up changetip button'
      return render json: { uid: 'tipme' }
    end

    set_id if @id['uid'].present?
    render json: { uid: @id['uid'] }
  end

  private

  def set_id
    ::PluginStore.set('changetip', "tipme_id_#{params[:tipme_id]}", @id)
  end
end
