class Security < ActiveRecord::Base
  validates :symbol, presence: true, uniqueness: true
  attr_accessor :feeds

  def self.search_or_initialize(value)
    begin
      result = value.to_i > 0 ? self.find(value) : self.find_or_initialize_by(symbol: value.upcase)
    rescue
      result = nil
    end

    if result
      result.feeds = Feedjira::Feed.fetch_and_parse("http://feeds.finance.yahoo.com/rss/2.0/headline?region=US&s=#{result.symbol.html_safe}")
    end

    result
  end

  def symbol=(symbol_string)
    super(symbol_string.upcase)
  end

  def website=(website_string)
    super(website_string.downcase)
  end
end
