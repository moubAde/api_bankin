# API Bankin

This is an API used for Bankin technical test

## Table des matières

- [Technologies](#Technologies)
- [Installing](#Installing)
- [Endpoints](#Endpoints)
- [Featback](#Featback)

## Technologies

- [Node JS](https://nodejs.org/fr/about/)
- [express](https://www.npmjs.com/package/express)
- [mocha](https://mochajs.org/)
- [chai](https://www.chaijs.com/)
- [nodemon](https://www.npmjs.com/package/nodemon)

## Installing

```
npm install
node index.js
```

The local server run on port 3001

## Endpoints

- [Accounts](#Accounts)

---

## Accounts

Get all user's accounts with their transactions.

**URL** : `/accounts`

**Method** : `POST`

**Auth required** : Authorization Basic credentials is composed of APP client_id and client_secret base 64 encoded

**Headers** : `Content-Type: application/json`

#### Success Response

**Code** : `200 OK`

**Content example**

```json
[
  {
    "acc_number": "000000001",
    "amount": "3000",
    "transactions": [
      {
        "label": "label 1",
        "amount": "30",
        "currency": "EUR"
      },
      {
        "label": "label 2",
        "amount": "10",
        "currency": "EUR"
      },
      {
        "label": "label 3",
        "amount": "15",
        "currency": "EUR"
      }
    ]
  }
]
```

#### Error Response

**Condition** : Something get wrong with the request.

**Code** : `400 BAD REQUEST`

**Condition** : If 'login' and 'password' combination is wrong or access token is wrong.

**Code** : `401 UNAUTHORIZED`

---

## Featback

- L'ajout de test sur le serveur.
- Un fichier server.js plus aéré.
- L'abandont de l'écriture hexadécimale dans le fichier server.js, car elle n'augmente pas la sécurité et rend le code dificile à lire.
- Renvoyer un Json même en cas d'erreur exemple {err: TextError}
- Revoir la récupération des transactions, car elle produit des erreurs par exemple l'appel de la route 'http://127.0.0.1:3000/accounts/0000000013/transactions'
- Revoir la pagination, car elle produit des pages supléments en dupliquant l'information
- Revoir la manière de faire fonctionner la pagination au lieu de renvoyer des liens vers la page actuelle et la page suivante il serait mieux de renvoyer le numéro de page actuelle et le nombre de page totale
