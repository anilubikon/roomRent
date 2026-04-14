import 'package:dio/dio.dart';

class ApiService {
  final Dio dio;

  ApiService(String baseUrl)
      : dio = Dio(BaseOptions(baseUrl: baseUrl, headers: {'Content-Type': 'application/json'}));

  Future<List<dynamic>> searchListings({String? city, String? suitableFor}) async {
    final response = await dio.get('/api/listings', queryParameters: {
      if (city != null) 'city': city,
      if (suitableFor != null) 'suitableFor': suitableFor,
    });

    return response.data as List<dynamic>;
  }

  Future<Map<String, dynamic>> createPaymentOrder({
    required String token,
    required String listingId,
    required double amount,
    required String planType,
  }) async {
    final response = await dio.post(
      '/api/payments/order',
      data: {'listingId': listingId, 'amount': amount, 'planType': planType},
      options: Options(headers: {'Authorization': 'Bearer $token'}),
    );

    return response.data as Map<String, dynamic>;
  }
}
