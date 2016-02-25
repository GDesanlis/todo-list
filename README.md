# TODO MVC en AngularJS 2

##**Utilisation**

- Créer une base de données mongo "todo" ("mongo use todo").
- Créer une collection "tasks" dans cette dernière (db.createCollection('tasks');). 
- Dans les dossiers back et front, lancer les commandes :
	- "npm install".
	- "npm start" (ou "gulp" pour le front).

---------

###**Frontend**

<kbd>*AngularJS 2 / TypeScript + Bootstrap*</kbd>

**2 écrans :**

- Ecran de liste des "todos" :

	- Avec bouton "Créer" pour passer sur le second écran de création.
	- Sur chaque tâche : 
		- Un bouton "Edit" permet de passer sur le second écran en édition (i.e. avec les données renseignées et éditables).
		- Un bouton permettant de "Supprimer" la tâche.

- Ecran de création d'une tâche :

	- Avec un champ de type texte.
	- Bouton "Save" qui sauvegarde la tâche en base.
	- Retour sur écran de liste avec la tâche ajoutée.

>**BONUS :**
>
>- Définir un statut sur les tâches, par exemple "A faire", "En cours", "Terminée".
>- Possibilité de changer le statut de la tâche depuis l'application.
>- Sur l'écran de liste, possibilité de grouper ou filtrer les tâches par statut.

###**Backend**

<kbd>*Hapi JS + MongoDB*</kbd>

- Routes REST pour la création, le listing, la mise à jour et la suppression des tâches.
- Stockage des données dans MongoDB.
