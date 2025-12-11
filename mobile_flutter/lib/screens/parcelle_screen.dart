import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'dart:convert';
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
  final List<Map<String, double>> _gpsPoints = [];
  bool _isMapping = false;
  bool _isLoading = false;
  Position? _currentPosition;

  @override
  void initState() {
    super.initState();
    _checkLocationPermission();
  }

  Future<void> _checkLocationPermission() async {
    bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Veuillez activer le GPS')),
      );
      return;
    }

    LocationPermission permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Permission GPS refusée')),
        );
        return;
      }
    }

    if (permission == LocationPermission.deniedForever) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Permission GPS refusée définitivement'),
        ),
      );
      return;
    }

    _getCurrentLocation();
  }

  Future<void> _getCurrentLocation() async {
    try {
      Position position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
      );
      setState(() => _currentPosition = position);
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erreur GPS: $e')),
      );
    }
  }

  void _startMapping() {
    if (_currentPosition == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Position GPS non disponible')),
      );
      return;
    }

    setState(() {
      _isMapping = true;
      _gpsPoints.clear();
      _gpsPoints.add({
        'latitude': _currentPosition!.latitude,
        'longitude': _currentPosition!.longitude,
      });
    });

    Geolocator.getPositionStream(
      locationSettings: const LocationSettings(
        accuracy: LocationAccuracy.high,
        distanceFilter: 5,
      ),
    ).listen((Position position) {
      if (_isMapping) {
        setState(() {
          _gpsPoints.add({
            'latitude': position.latitude,
            'longitude': position.longitude,
          });
          _currentPosition = position;
        });
      }
    });

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Mapping démarré. Marchez autour de la parcelle.'),
        backgroundColor: Colors.green,
      ),
    );
  }

  void _stopMapping() {
    setState(() => _isMapping = false);
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Mapping arrêté')),
    );
  }

  double _calculateArea() {
    if (_gpsPoints.length < 3) return 0;

    double area = 0;
    for (int i = 0; i < _gpsPoints.length; i++) {
      int j = (i + 1) % _gpsPoints.length;
      area += _gpsPoints[i]['latitude']! * _gpsPoints[j]['longitude']!;
      area -= _gpsPoints[j]['latitude']! * _gpsPoints[i]['longitude']!;
    }
    area = (area.abs() / 2) * 111320 * 111320 / 10000;
    return area;
  }

  double _calculatePerimeter() {
    if (_gpsPoints.length < 2) return 0;

    double perimeter = 0;
    for (int i = 0; i < _gpsPoints.length; i++) {
      int j = (i + 1) % _gpsPoints.length;
      perimeter += Geolocator.distanceBetween(
        _gpsPoints[i]['latitude']!,
        _gpsPoints[i]['longitude']!,
        _gpsPoints[j]['latitude']!,
        _gpsPoints[j]['longitude']!,
      );
    }
    return perimeter;
  }

  Future<void> _saveParcelle() async {
    if (!_formKey.currentState!.validate()) return;

    if (_gpsPoints.length < 3) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Il faut au moins 3 points GPS'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    setState(() => _isLoading = true);

    try {
      final area = _calculateArea();
      final perimeter = _calculatePerimeter();

      await ApiService.post('/parcelles', {
        'code': _codeController.text.trim(),
        'superficie': double.parse(_superficieController.text.trim()),
        'polygone_gps': json.encode(_gpsPoints),
        'superficie_gps': area,
        'perimetre': perimeter,
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
                        '📍 Mapping GPS',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        'Points enregistrés: ${_gpsPoints.length}',
                        style: const TextStyle(fontSize: 16),
                      ),
                      if (_currentPosition != null)
                        Text(
                          'Position: ${_currentPosition!.latitude.toStringAsFixed(6)}, ${_currentPosition!.longitude.toStringAsFixed(6)}',
                          style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                        ),
                      if (_gpsPoints.length >= 3) ...[
                        const SizedBox(height: 8),
                        Text(
                          'Superficie GPS: ${_calculateArea().toStringAsFixed(2)} ha',
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF8B4513),
                          ),
                        ),
                        Text(
                          'Périmètre: ${_calculatePerimeter().toStringAsFixed(0)} m',
                          style: const TextStyle(fontSize: 14),
                        ),
                      ],
                      const SizedBox(height: 16),
                      Row(
                        children: [
                          Expanded(
                            child: ElevatedButton.icon(
                              onPressed: _isMapping ? _stopMapping : _startMapping,
                              icon: Icon(_isMapping ? Icons.pause : Icons.play_arrow),
                              label: Text(_isMapping ? 'Arrêter' : 'Démarrer'),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: _isMapping ? Colors.orange : Colors.green,
                              ),
                            ),
                          ),
                          if (_gpsPoints.isNotEmpty) ...[
                            const SizedBox(width: 8),
                            ElevatedButton.icon(
                              onPressed: () {
                                setState(() => _gpsPoints.clear());
                              },
                              icon: const Icon(Icons.delete),
                              label: const Text('Effacer'),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.red,
                              ),
                            ),
                          ],
                        ],
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
                  labelText: 'Superficie déclarée (ha) *',
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
