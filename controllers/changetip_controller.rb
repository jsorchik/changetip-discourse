class ::ChangetipController < ::ApplicationController
  def tip_id
    u = User.find_by(id: params[:id])
    f = UserField.find_by(name: 'ChangeTip Username')

    if u.user_fields["#{f.id}"].present?
      return render json: { tipme_id: ERB::Util.html_escape(u.user_fields["#{f.id}"]) }
    end

    render json: { tipme_id: 'tipme' }
  end
end
