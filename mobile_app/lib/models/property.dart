class Property {
  Property({
    required this.id,
    required this.title,
    required this.city,
    required this.type,
    required this.rent,
    required this.bhk,
  });

  final String id;
  final String title;
  final String city;
  final String type;
  final int rent;
  final int bhk;

  factory Property.fromJson(Map<String, dynamic> json) {
    return Property(
      id: json['_id'] as String,
      title: json['title'] as String,
      city: json['city'] as String,
      type: json['type'] as String,
      rent: json['rent'] as int,
      bhk: json['bhk'] as int? ?? 1,
    );
  }
}
