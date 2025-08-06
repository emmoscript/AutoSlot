import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:latlong2/latlong.dart';
import '../config/api_config.dart';

class LotService {
  static Future<List<Map<String, dynamic>>> fetchLots() async {
    final response = await http.get(Uri.parse(ApiConfig.lots));
    if (response.statusCode == 200) {
      final List data = json.decode(response.body);
      return data.map<Map<String, dynamic>>((lot) {
        return {
          'id': lot['id'],
          'name': lot['name'],
          'address': lot['address'],
          'latitude': double.parse(lot['latitude'].toString()),
          'longitude': double.parse(lot['longitude'].toString()),
          'latlng': LatLng(
            double.parse(lot['latitude'].toString()),
            double.parse(lot['longitude'].toString()),
          ),
          'spaces': lot['spaces'] ?? [], // Include spaces if available
          // Add other fields as needed
        };
      }).toList();
    } else {
      throw Exception('Failed to load lots');
    }
  }

  static Future<Map<String, dynamic>> fetchLotById(int id) async {
    final response = await http.get(
      Uri.parse(ApiConfig.lotById(id)),
    );
    if (response.statusCode == 200) {
      final lot = json.decode(response.body);
      lot['latlng'] = LatLng(
        double.parse(lot['latitude'].toString()),
        double.parse(lot['longitude'].toString()),
      );
      // Always try to fetch slots if not already included
      try {
        if (lot['spaces'] == null || (lot['spaces'] as List).isEmpty) {
          final slots = await fetchSlotsForLot(id);
          lot['spaces'] = slots;
          lot['slots'] = slots; // Keep both for compatibility
        } else {
          lot['slots'] = lot['spaces']; // Ensure slots field exists
        }
      } catch (e) {
        print('Error fetching slots for lot $id: $e');
        lot['spaces'] = [];
        lot['slots'] = []; // fallback to empty list
      }
      return lot;
    } else {
      throw Exception('Failed to load lot');
    }
  }

  static Future<List<Map<String, dynamic>>> fetchSlotsForLot(int lotId) async {
    final response = await http.get(
      Uri.parse(ApiConfig.spaces(lotId)),
    );
    if (response.statusCode == 200) {
      final List data = json.decode(response.body);
      print('Slots response for lot $lotId: $data');
      return data
          .map<Map<String, dynamic>>(
            (slot) => {
              'id': slot['id'].toString(),
              'floor': slot['level'].toString(),
              'isAvailable':
                  slot['is_available'] == true || slot['is_available'] == 1,
            },
          )
          .toList();
    } else {
      print('Failed to load slots for lot $lotId: ${response.body}');
      throw Exception('Failed to load slots');
    }
  }

  // Quick reserve - automatic space assignment
  static Future<Map<String, dynamic>> quickReserve(int lotId, int userId) async {
    final url = '${ApiConfig.baseUrl}/api/lots/$lotId/quick-reserve';
    print('🚀 Quick reserve URL: $url');
    
    final response = await http.post(
      Uri.parse(url),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'userId': userId}),
    );
    
    print('📡 Quick reserve response status: ${response.statusCode}');
    print('📡 Quick reserve response body: ${response.body}');
    
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      final error = json.decode(response.body);
      throw Exception(error['message'] ?? 'Failed to reserve space');
    }
  }

  // Get optimal spaces preview
  static Future<Map<String, dynamic>> getOptimalSpaces(int lotId) async {
    final url = '${ApiConfig.baseUrl}/api/lots/$lotId/optimal-spaces';
    print('🔍 Optimal spaces URL: $url');
    
    final response = await http.get(Uri.parse(url));
    
    print('📡 Optimal spaces response status: ${response.statusCode}');
    print('📡 Optimal spaces response body: ${response.body}');
    
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to load optimal spaces');
    }
  }
}
