# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

User.create!(email: "eltonchan@cal.berkeley.edu", password: "development123")

Security.create!(symbol: "aapl", name: "Apple Inc.", website: "http://investor.apple.com/")

Post.create!(
  user_id: 1,
  title: "First post",
  shared_with: "public",
  tags: "test",
  note: "note content",
  body: "a very long string of text can go here",
)
