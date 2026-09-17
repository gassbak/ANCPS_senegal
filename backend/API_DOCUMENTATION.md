# API — Annuaire des Certifications du Sénégal

## 1. Adresse du backend

Pour le développement :

http://localhost:5000


## 2. Authentification

### Inscription

POST /api/auth/register

Body :

{
  "name": "Ali",
  "email": "ali@test.com",
  "password": "123456"
}

Réponse :

{
  "message": "Utilisateur créé"
}


### Connexion

POST /api/auth/login

Body :

{
  "email": "ali@test.com",
  "password": "123456"
}

Réponse :

{
  "message": "Connexion réussie",
  "token": "JWT_TOKEN"
}


## 3. Profil

GET /api/auth/profile

Header :

Authorization: Bearer JWT_TOKEN


## 4. Certifications

### Liste

GET /api/certifications

Cette route est publique.


### Une certification

GET /api/certifications/:id

Exemple :

GET /api/certifications/ID


### Créer

POST /api/certifications

Authentification :

Authorization: Bearer JWT_TOKEN

Body :

{
  "title": "Développeur Web",
  "sigle": "DW",
  "description": "Formation en développement web",
  "niveau": "Licence",
  "duree": "12 mois",
  "modalite": "Présentiel",
  "domaine": "ID_DOMAINE",
  "sousDomaine": "ID_SOUS_DOMAINE",
  "metiers": [
    "ID_METIER"
  ],
  "competences": [
    "ID_COMPETENCE"
  ],
  "organisme": "ID_ORGANISME",
  "etablissements": [
    "ID_ETABLISSEMENT"
  ]
}


### Modifier

PUT /api/certifications/:id

Authentification :

Authorization: Bearer JWT_TOKEN


### Supprimer

DELETE /api/certifications/:id

Authentification :

Authorization: Bearer JWT_TOKEN


## 5. Domaines

GET /api/domaines

GET /api/domaines/:id

GET /api/domaines/sous-domaines

GET /api/domaines/sous-domaines/:id


## 6. Métiers

GET /api/metiers

GET /api/metiers/:id


## 7. Compétences

GET /api/competences

GET /api/competences/:id


## 8. Organismes certificateurs

GET /api/organismes

GET /api/organismes/:id


## 9. Établissements

GET /api/etablissements

GET /api/etablissements/:id


## 10. Sources

GET /api/sources

GET /api/sources/:id


## 11. Documents

GET /api/documents

GET /api/documents/:id


## 12. Reconnaissances

GET /api/reconnaissances

GET /api/reconnaissances/:id


## 13. Recherche

GET /api/search/certifications

Exemple :

/api/search/certifications?q=web

Autres filtres :

?q=web
&niveau=Licence
&modalite=Présentiel
&domaine=ID_DOMAINE
&sousDomaine=ID_SOUS_DOMAINE
&organisme=ID_ORGANISME
&etablissement=ID_ETABLISSEMENT
&metier=ID_METIER
&competence=ID_COMPETENCE


## 14. Contributions

### Créer une contribution

POST /api/contributions

Authentification obligatoire.

Header :

Authorization: Bearer JWT_TOKEN

Body :

{
  "type": "Modification",
  "contenu": "Nouvelle information",
  "certification": "ID_CERTIFICATION"
}


### Liste

GET /api/contributions

Authentification obligatoire.


### Une contribution

GET /api/contributions/:id


### Modifier le statut

PUT /api/contributions/:id/status

Body :

{
  "statut": "acceptee",
  "commentaire": "Informations vérifiées"
}


## 15. Historique / Audit

GET /api/audit

Réservé à l'administration.

Header :

Authorization: Bearer JWT_TOKEN


## 16. Rôles

admin
editor
verifier
etablissement


## 17. Codes HTTP

200 = succès

201 = création réussie

400 = données incorrectes

401 = authentification nécessaire

403 = accès interdit

404 = ressource introuvable

500 = erreur serveur