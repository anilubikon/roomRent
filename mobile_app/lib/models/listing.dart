class Listing {
  final String id;
  final String title;
  final String city;
  final String category;
  final String suitableFor;
  final int monthlyRent;

  Listing({
    required this.id,
    required this.title,
    required this.city,
    required this.category,
    required this.suitableFor,
    required this.monthlyRent,
  });

  factory Listing.fromJson(Map<String, dynamic> json) {
    return Listing(
      id: json['_id'] as String,
      title: json['title'] as String,
      city: json['city'] as String,
      category: json['category'] as String,
      suitableFor: json['suitableFor'] as String,
      monthlyRent: json['monthlyRent'] as int,
    );
  }
}
