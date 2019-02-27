class UsersController < ApplicationController
  def create
    @user = User.new(user_params)

    @matching_enrollments = zoom_client.matching_enrollments(
      enrollment_id: @user.zoom_enrollment_id
    )

    if @matching_enrollments.any? && User.where(zoom_enrollment_id: @matching_enrollments).any?
      render status: :conflict, json: {
        errors: User.where(zoom_enrollment_id: @matching_enrollments).map do |u|
          "The face supplied matches an existing user (#{u.name})"
        end
      }
      return
    end

    if !@user.save
      render status: :unprocessable_entity, json: { errors: @user.errors.full_messages }
      return
    end

    render json: @user
  end

  def login
    head :not_found
  end

  private

  def user_params
    params.permit(:name, :email, :zoom_enrollment_id)
  end

  def zoom_client
    ZoomClient.new(session_id: params[:zoom_session_id])
  end
end