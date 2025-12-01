# Régions de Côte d'Ivoire

Ce document liste les 33 régions administratives de la Côte d'Ivoire utilisées dans l'application CacaoTrack.

## Districts Autonomes (2)

1. **Abidjan** (REG-001) - District Autonome d'Abidjan
2. **Yamoussoukro** (REG-002) - District Autonome de Yamoussoukro

## Régions Administratives (31)

3. **Agnéby-Tiassa** (REG-003)
4. **Bafing** (REG-004)
5. **Bagoué** (REG-005)
6. **Béré** (REG-006)
7. **Bounkani** (REG-007)
8. **Cavally** (REG-008)
9. **Folon** (REG-009)
10. **Gbêkê** (REG-010)
11. **Gbôklé** (REG-011)
12. **Gôh** (REG-012)
13. **Gontougo** (REG-013)
14. **Grands-Ponts** (REG-014)
15. **Guémon** (REG-015)
16. **Hambol** (REG-016)
17. **Haut-Sassandra** (REG-017)
18. **Iffou** (REG-018)
19. **Indénié-Djuablin** (REG-019)
20. **Kabadougou** (REG-020)
21. **La Mé** (REG-021)
22. **Lôh-Djiboua** (REG-022)
23. **Marahoué** (REG-023)
24. **Moronou** (REG-024)
25. **Nawa** (REG-025)
26. **N'Zi** (REG-026)
27. **Poro** (REG-027)
28. **San-Pédro** (REG-028)
29. **Sud-Comoé** (REG-029)
30. **Tchologo** (REG-030)
31. **Tonkpi** (REG-031)
32. **Worodougou** (REG-032)
33. **Moyen-Cavally** (REG-033)

## Utilisation dans l'application

Les régions sont utilisées pour :
- Affecter les agents de collecte à des zones géographiques spécifiques
- Filtrer et organiser les données par région
- Générer des statistiques régionales

## Gestion des régions

Les régions sont pré-chargées dans la base de données via le script de seed (`server/src/seed.ts`).

Pour réinitialiser les régions :
```bash
cd server
npm run db:seed
```

## Notes

- Chaque région possède un code unique (REG-001 à REG-033)
- Les agents peuvent être affectés à plusieurs régions
- Les régions sont basées sur le découpage administratif officiel de la Côte d'Ivoire
