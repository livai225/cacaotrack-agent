class Producteur {
  final int? id;
  final String nom;
  final String prenom;
  final String? telephone;
  final String? cni;
  final String? photo;
  final int? villageId;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  Producteur({
    this.id,
    required this.nom,
    required this.prenom,
    this.telephone,
    this.cni,
    this.photo,
    this.villageId,
    this.createdAt,
    this.updatedAt,
  });

  factory Producteur.fromJson(Map<String, dynamic> json) {
    return Producteur(
      id: json['id'],
      nom: json['nom'],
      prenom: json['prenom'],
      telephone: json['telephone'],
      cni: json['cni'],
      photo: json['photo'],
      villageId: json['village_id'],
      createdAt: json['created_at'] != null ? DateTime.parse(json['created_at']) : null,
      updatedAt: json['updated_at'] != null ? DateTime.parse(json['updated_at']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      if (id != null) 'id': id,
      'nom': nom,
      'prenom': prenom,
      'telephone': telephone,
      'cni': cni,
      'photo': photo,
      'village_id': villageId,
      if (createdAt != null) 'created_at': createdAt!.toIso8601String(),
      if (updatedAt != null) 'updated_at': updatedAt!.toIso8601String(),
    };
  }
}
