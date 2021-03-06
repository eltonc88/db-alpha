class Post < ActiveRecord::Base
  validates :title, presence: true
  validates :user, presence: true

  belongs_to :user

  def self.search(options)
    if options[:security_id]
      options[:security_id] = options[:security_id].upcase
      if options[:user]
        query = "(user_id = ? OR shared_with ~* 'public') AND tags ~* ?"
        Post.includes(:user).where(query, options[:user].id, "\\y#{ options[:security_id] }\\y").order(:created_at).reverse
      else
        Post.includes(:user).where("shared_with ~* 'public' AND tags ~* ?", "\\y#{ options[:security_id] }\\y").order(:created_at).reverse
      end
    elsif options[:user]
      options[:user].posts.includes(:user).order(:created_at).reverse
    else
      Post.includes(:user).where("shared_with ~* 'public'").order(:created_at).reverse
    end
  end

  def is_public?
    /public/ =~ shared_with
  end

  def tags=(input)
    input = input.join(",") if input.is_a? Array
    super(input.upcase.split(/,/).map(&:strip).reject(&:empty?).uniq.join(","))
  end

  def tags
    super ? super.split(/,/) : []
  end
end
