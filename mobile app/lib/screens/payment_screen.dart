import 'package:flutter/material.dart';
import 'package:mobile_app/screens/success_splash_screen.dart';

class PaymentScreen extends StatefulWidget {
  final List<String> slotIds;
  final String parkingName;

  const PaymentScreen({
    super.key,
    required this.slotIds,
    required this.parkingName,
  });

  @override
  State<PaymentScreen> createState() => _PaymentScreenState();
}

class _PaymentScreenState extends State<PaymentScreen> {
  String? _selectedPaymentMethod;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24.0),
      // Use a Column inside a SingleChildScrollView if content might overflow,
      // but for simple payment options, a Column is often sufficient.
      // Removed Scaffold as this is also intended for a bottom sheet
      child: Column(
        mainAxisSize: MainAxisSize.min, // Keep column tight to content
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Center(
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: 12.0),
              child: Container(
                width: 40,
                height: 5,
                decoration: BoxDecoration(
                  color: Colors.grey[300],
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
            ),
          ),
          Text(
            'Pagar Reserva en ${widget.parkingName}',
            style: Theme.of(context).textTheme.headlineSmall,
          ),
          const SizedBox(height: 8),
          Text(
            'Slot Seleccionado: ${widget.slotIds.join(', ')}',
            style: Theme.of(context).textTheme.titleMedium,
          ),
          const SizedBox(height: 24),
          Text(
            'Selecciona un método de pago:',
            style: Theme.of(context).textTheme.titleLarge,
          ),
          const SizedBox(height: 16),
          _buildPaymentOption(
            context,
            'Tarjeta de Crédito/Débito',
            Icons.credit_card,
            'card',
          ),
          const SizedBox(height: 12),
          _buildPaymentOption(
            context,
            'Apple Pay',
            Icons.apple, // Use a generic Apple icon for simplicity
            'apple_pay',
          ),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: _selectedPaymentMethod != null
                  ? () {
                      // Simulate payment processing
                      Navigator.of(context).pop(); // Dismiss payment screen
                      Navigator.of(context).pop(); // Dismiss slots screen
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (context) => SuccessSplashScreen(),
                        ),
                      );
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text(
                            'Pago de Slot ${widget.slotIds.join(', ')} con ${_selectedPaymentMethod == 'card' ? 'Tarjeta' : 'Apple Pay'} exitoso!',
                          ),
                          duration: const Duration(seconds: 3),
                        ),
                      );
                      // In a real app, integrate with payment gateway here
                    }
                  : null,
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: Text(
                _selectedPaymentMethod != null
                    ? 'Pagar con ${_selectedPaymentMethod == 'card' ? 'Tarjeta' : 'Apple Pay'}'
                    : 'Selecciona un Método de Pago',
                style: const TextStyle(fontSize: 18),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPaymentOption(
    BuildContext context,
    String title,
    IconData icon,
    String methodId,
  ) {
    bool isCurrentMethodSelected = _selectedPaymentMethod == methodId;

    return Card(
      elevation: isCurrentMethodSelected ? 8.0 : 2.0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12.0),
        side: BorderSide(
          color: isCurrentMethodSelected
              ? Colors.blue.shade400
              : Colors.grey.shade300,
          width: isCurrentMethodSelected ? 2.5 : 1.0,
        ),
      ),
      child: InkWell(
        onTap: () {
          setState(() {
            _selectedPaymentMethod = methodId;
          });
        },
        borderRadius: BorderRadius.circular(12.0),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Row(
            children: [
              Icon(
                icon,
                size: 30,
                color: isCurrentMethodSelected
                    ? Colors.blue.shade700
                    : Colors.grey.shade700,
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Text(
                  title,
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w500,
                    color: isCurrentMethodSelected
                        ? Colors.blue.shade900
                        : Colors.black87,
                  ),
                ),
              ),
              if (isCurrentMethodSelected)
                Icon(Icons.check_circle, color: Colors.blue.shade700),
            ],
          ),
        ),
      ),
    );
  }
}
