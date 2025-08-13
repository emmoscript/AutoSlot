import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;

void main() async {
  print('🧪 Testing API endpoints...');
  
  // Test parking lots endpoint
  try {
    final response = await http.get(
      Uri.parse('https://autoslot-backend-api.onrender.com/api/parking-lots'),
    );
    
    print('📡 Status: ${response.statusCode}');
    print('📡 Headers: ${response.headers}');
    print('📡 Body length: ${response.body.length}');
    
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      print('📊 Data type: ${data.runtimeType}');
      print('📊 Data length: ${data.length}');
      
      if (data is List && data.isNotEmpty) {
        final firstLot = data[0];
        print('📍 First lot: ${firstLot['name']}');
        print('📍 Latitude: ${firstLot['latitude']} (type: ${firstLot['latitude'].runtimeType})');
        print('📍 Longitude: ${firstLot['longitude']} (type: ${firstLot['longitude'].runtimeType})');
        print('📍 Has spaces: ${firstLot.containsKey('spaces')}');
        if (firstLot.containsKey('spaces')) {
          print('📍 Spaces count: ${firstLot['spaces'].length}');
        }
      }
    } else {
      print('❌ Error response: ${response.body}');
    }
  } catch (e) {
    print('❌ Exception: $e');
  }
}
