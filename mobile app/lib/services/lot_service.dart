import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:latlong2/latlong.dart';

class LotService {
  static Future<List<Map<String, dynamic>>> fetchLots() async {
    final response = await http.get(Uri.parse('http://10.0.0.7:4000/api/lots'));
    if (response.statusCode == 200) {
      final List data = json.decode(response.body);
      return data.map<Map<String, dynamic>>((lot) {
        return {
          'id': lot['id'],
          'name': lot['name'],
          'latlng': LatLng(
            double.parse(lot['latitude'].toString()),
            double.parse(lot['longitude'].toString()),
          ),
          // Add other fields as needed
        };
      }).toList();
    } else {
      throw Exception('Failed to load lots');
    }
  }

  static Future<Map<String, dynamic>> fetchLotById(int id) async {
    final response = await http.get(
      Uri.parse('http://10.0.0.7:4000/api/lots/$id'),
    );
    if (response.statusCode == 200) {
      final lot = json.decode(response.body);
      lot['latlng'] = LatLng(
        double.parse(lot['latitude'].toString()),
        double.parse(lot['longitude'].toString()),
      );
      // Try to fetch slots, but handle errors gracefully
      try {
        if (lot['slots'] == null) {
          lot['slots'] = await fetchSlotsForLot(id);
        }
      } catch (e) {
        print('Error fetching slots for lot $id: $e');
        lot['slots'] = []; // fallback to empty list
      }
      return lot;
    } else {
      throw Exception('Failed to load lot');
    }
  }

  static Future<List<Map<String, dynamic>>> fetchSlotsForLot(int lotId) async {
    final response = await http.get(
      Uri.parse('http://10.0.0.7:4000/api/spaces?lot_id=$lotId'),
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
}
