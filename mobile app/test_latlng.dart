import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:latlong2/latlong.dart';

void main() async {
  print('🧪 Testing LatLng creation...');
  
  try {
    final response = await http.get(
      Uri.parse('https://autoslot-backend-api.onrender.com/api/parking-lots'),
    );
    
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      
      for (var lot in data) {
        final lat = double.parse(lot['latitude'].toString());
        final lng = double.parse(lot['longitude'].toString());
        final latlng = LatLng(lat, lng);
        
        print('📍 ${lot['name']}:');
        print('   Raw lat: ${lot['latitude']} (${lot['latitude'].runtimeType})');
        print('   Raw lng: ${lot['longitude']} (${lot['longitude'].runtimeType})');
        print('   Parsed lat: $lat');
        print('   Parsed lng: $lng');
        print('   LatLng: $latlng');
        print('   LatLng.latitude: ${latlng.latitude}');
        print('   LatLng.longitude: ${latlng.longitude}');
        print('');
      }
    }
  } catch (e) {
    print('❌ Exception: $e');
  }
}
