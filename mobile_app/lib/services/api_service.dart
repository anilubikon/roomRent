import 'package:dio/dio.dart';

class ApiService {
  ApiService(String baseUrl)
      : dio = Dio(BaseOptions(baseUrl: baseUrl, headers: {'Content-Type': 'application/json'}));

  final Dio dio;

  Future<List<dynamic>> getProperties({Map<String, dynamic>? filters}) async {
    final response = await dio.get('/api/properties', queryParameters: filters);
    return response.data as List<dynamic>;
  }

  Future<Map<String, dynamic>> sendOtp(String phone) async {
    final response = await dio.post('/api/auth/send-otp', data: {'phone': phone});
    return response.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> verifyOtp({required String phone, required String otp}) async {
    final response = await dio.post('/api/auth/verify-otp', data: {'phone': phone, 'otp': otp});
    return response.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> createPaymentOrder({
    required String token,
    required double amount,
    required String type,
    String? bookingId,
    String planType = 'full',
  }) async {
    final response = await dio.post(
      '/api/payments/order',
      data: {
        'bookingId': bookingId,
        'amount': amount,
        'type': type,
        'planType': planType,
      },
      options: Options(headers: {'Authorization': 'Bearer $token'}),
    );

    return response.data as Map<String, dynamic>;
  }
}
