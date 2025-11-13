# Student-Course API

Une API Node.js simple permettant de gérer des **étudiants** et des **cours**, avec possibilité d’inscrire et de désinscrire des étudiants.  
Ce projet inclut des **tests unitaires et d’intégration complets**, ainsi qu’un pipeline **GitHub Actions (CI)**.

---

## Fonctionnalités

- Gestion CRUD des **étudiants** (`/students`)
- Gestion CRUD des **cours** (`/courses`)
- Inscription / désinscription d’un étudiant à un cours
- Pagination et filtres (par nom, email, titre, enseignant)
- Validation des contraintes :
  - Email étudiant unique
  - Titre de cours unique
  - Maximum 3 étudiants par cours
  - Suppression impossible d’un étudiant inscrit
- Enregistrement des données en mémoire via un service `storage` simple

---

## Installation

### 1. Cloner le dépôt
```bash
git clone https://github.com/MARQUESDINISJoaoGabriel/student-course-api.git
cd student-course-api
````

### 2. Installer les dépendances

```bash
npm install
```

---

## Exécution des tests

### Lancer les tests unitaires et d’intégration

```bash
npm test
```

### Vérifier le linting

```bash
npm run lint
```

Les tests couvrent :

* **Unitaires** : logique du stockage (`src/services/storage.js`)
* **Intégration** : endpoints Express complets (`src/app.js`)

Un rapport de couverture est automatiquement généré dans le dossier :

```
coverage/
```

---

## Intégration Continue (CI)

Le projet est testé automatiquement via **GitHub Actions** à chaque `push` ou `pull request` sur la branche `master`.

### 📄 `.github/workflows/ci.yml`

```yaml
name: Tests CI

on:
  push:
    branches:
      - master
  pull_request:
    branches:
      - master

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Run linter
        run: npm run lint
      - name: Run tests (with coverage)
        run: npm test
      - name: Upload coverage report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage
```

---

## Exemple de tests

### Exemple d’un test d’intégration (GET /students)

```js
test('GET /students should return seeded students', async () => {
  const res = await request(app).get('/students');
  expect(res.statusCode).toBe(200);
  expect(res.body.students.length).toBe(3);
  expect(res.body.students[0].name).toBe('Alice');
});
```

### Exemple d’un test unitaire (stockage)

```js
test('should not allow duplicate student email', () => {
  const result = storage.create('students', {
    name: 'Eve',
    email: 'alice@example.com',
  });
  expect(result.error).toBe('Email must be unique');
});
```
---

## Notes techniques

* Framework : **Express.js**
* Tests : **Jest + Supertest**
* CI : **GitHub Actions**
* Stockage : **in-memory (sans base de données)**

---
```
