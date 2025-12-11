import 'package:flutter/material.dart';
import '../services/api_service.dart';

class ParcelleScreen extends StatefulWidget {
  const ParcelleScreen({super.key});

  @override
  State<ParcelleScreen> createState() => _ParcelleScreenState();
}

class _ParcelleScreenState extends State<ParcelleScreen> {
  final _formKey = GlobalKey<FormState>();
  final _codeController = TextEditingController();
  final _superficieController = TextEditingController();
  bool _isLoading = false;

  Future<void> _saveParcelle() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    try {
      await ApiService.post('/parcelles', {
        'code': _codeController.text.trim(),
        'superficie': double.parse(_superficieController.text.trim()),
      });

      if (!mounted) return;
      
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Parcelle créée avec succès'),
          backgroundColor: Colors.green,
        ),
      );
      
      Navigator.pop(context);
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Erreur: $e'),
          backgroundColor: Colors.red,
        ),
      );
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Nouvelle Parcelle'),
        backgroundColor: const Color(0xFF8B4513),
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Card(
                elevation: 4,
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        '📍 Information Parcelle',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Version simplifiée - GPS sera ajouté ultérieurement',
                        style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _codeController,
                decoration: const InputDecoration(
                  labelText: 'Code parcelle *',
                  prefixIcon: Icon(Icons.qr_code),
                  border: OutlineInputBorder(),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Ce champ est requis';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _superficieController,
                decoration: const InputDecoration(
                  labelText: 'Superficie (ha) *',
                  prefixIcon: Icon(Icons.landscape),
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.number,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Ce champ est requis';
                  }
                  if (double.tryParse(value) == null) {
                    return 'Valeur invalide';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 24),
              SizedBox(
                height: 50,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _saveParcelle,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF8B4513),
                  ),
                  child: _isLoading
                      ? const CircularProgressIndicator(color: Colors.white)
                      : const Text(
                          'Enregistrer',
                          style: TextStyle(fontSize: 16, color: Colors.white),
                        ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _codeController.dispose();
    _superficieController.dispose();
    super.dispose();
  }
}
