class Parcelle {
  final int? id;
  final String code;
  final double superficie;
  final int? producteurId;
  final String? polygoneGps;
  final double? superficieGps;
  final double? perimetre;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  Parcelle({
    this.id,
    required this.code,
    required this.superficie,
    this.producteurId,
    this.polygoneGps,
    this.superficieGps,
    this.perimetre,
    this.createdAt,
    this.updatedAt,
  });

  factory Parcelle.fromJson(Map<String, dynamic> json) {
    return Parcelle(
      id: json['id'],
      code: json['code'],
      superficie: (json['superficie'] as num).toDouble(),
      producteurId: json['producteur_id'],
      polygoneGps: json['polygone_gps'],
      superficieGps: json['superficie_gps'] != null ? (json['superficie_gps'] as num).toDouble() : null,
      perimetre: json['perimetre'] != null ? (json['perimetre'] as num).toDouble() : null,
      createdAt: json['created_at'] != null ? DateTime.parse(json['created_at']) : null,
      updatedAt: json['updated_at'] != null ? DateTime.parse(json['updated_at']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      if (id != null) 'id': id,
      'code': code,
      'superficie': superficie,
      'producteur_id': producteurId,
      'polygone_gps': polygoneGps,
      'superficie_gps': superficieGps,
      'perimetre': perimetre,
      if (createdAt != null) 'created_at': createdAt!.toIso8601String(),
      if (updatedAt != null) 'updated_at': updatedAt!.toIso8601String(),
    };
  }
}
