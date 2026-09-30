# Décisions — Modèle des journées et contrôles

## Statut

Décisions validées avant développement.

## 1. Bibliothèque des journées

Le roulement dispose d'une bibliothèque contenant toutes les journées utilisables.

Une journée possède notamment :
- son code (`K110`, `K111`, `K150`, etc.) ;
- sa résidence ;
- ses jours de positionnement autorisés selon sa numérotation et ses variantes ;
- ses horaires de début et de fin ;
- son éventuel rattachement à un RHR ;
- les informations nécessaires au contrôle de sa compatibilité avec les autres cases.

## 2. Menu de chaque case de la grille

Chaque case doit permettre de sélectionner l'un des types suivants :

- **Journée** : choix d'une journée dans la bibliothèque ;
- **Repos** : RP ;
- **FAC** ;
- **RM** ;
- **DISPO**.

Les anciennes valeurs `AF`, `S` et `C` ne font pas partie des choix du menu.

## 3. Contrôle à la sélection

Toute sélection déclenche un contrôle immédiat de compatibilité avec le contexte de la grille.

Le contrôle tient notamment compte :
- de la journée sélectionnée et de ses horaires ;
- du jour concerné ;
- des cases voisines ;
- des contraintes de positionnement des journées ;
- des RP constitués par l'enchaînement des cases.

### Exemple validé

Si une journée K placée un vendredi se termine après 19 h, le choix `Repos` le samedi doit être signalé comme incompatible avec l'enchaînement correspondant.

## 4. Une anomalie ne bloque pas la sélection

Le logiciel **n'interdit pas** une sélection incompatible.

Il doit :
1. accepter la sélection ;
2. analyser la situation ;
3. signaler l'anomalie.

Objectif : permettre de reconstruire fidèlement une grille existante, même si celle-ci comporte des anomalies, puis permettre de les identifier et de les corriger.

## 5. Contrôle immédiat et contrôle global

Deux niveaux sont prévus :

### Contrôle immédiat

Déclenché lors de chaque modification d'une case. Il signale les incompatibilités détectables à partir de la sélection et de son voisinage.

### Contrôle global

Analyse l'ensemble de la grille et produit la liste des anomalies réglementaires et structurelles.

## 6. RHR

Deux journées reliées par un RHR constituent un bloc indissociable.

La relation entre les deux journées doit être conservée dans le modèle afin que le déplacement ou la modification de l'une entraîne le traitement approprié de l'autre.

## 7. Principe d'implémentation

La grille contient des références vers la bibliothèque des journées ou des valeurs de type RP/FAC/RM/DISPO.

Les contrôles sont calculés à partir de ces données plutôt que d'une simple valeur textuelle affichée dans une cellule.
