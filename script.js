// ==============================
// DONNÉES DES PRODUITS
// ==============================

const produits = [
    {
        id: "sac-01",
        nom: "Sac Classique",
        prix: 15000,
        categorie: "Sac à main",
        image: "images/sac-01.jpg",
        description: "Un sac élégant et simple, adapté aux sorties et aux occasions du quotidien."
    },
    {
        id: "sac-02",
        nom: "Cabas Essentiel",
        prix: 10000,
        categorie: "Cabas",
        image: "images/sac-02.jpg",
        description: "Un cabas pratique et spacieux pour transporter facilement les affaires du quotidien."
    },
    {
        id: "sac-03",
        nom: "Sac Élégance",
        prix: 18000,
        categorie: "Sac à main",
        image: "images/sac-03.jpg",
        description: "Un modèle chic avec une finition élégante, idéal pour compléter une tenue."
    },
    {
        id: "sac-04",
        nom: "Mini Chic",
        prix: 12000,
        categorie: "Sac compact",
        image: "images/sac-04.jpg",
        description: "Un petit sac tendance et pratique pour emporter l'essentiel avec soi."
    },
    {
        id: "sac-05",
        nom: "Sac Tendance",
        prix: 20000,
        categorie: "Sac à main",
        image: "images/sac-05.jpg",
        description: "Un modèle moderne et raffiné destiné aux clientes qui aiment un style actuel."
    },
    {
        id: "sac-06",
        nom: "Sac Prestige",
        prix: 25000,
        categorie: "Sac à main",
        image: "images/sac-06.jpg",
        description: "Un sac sophistiqué avec un style élégant, adapté aux occasions spéciales."
    }
];


// ==============================
// RÉCUPÉRATION DES ÉLÉMENTS HTML
// ==============================

const grilleProduits = document.getElementById("grille-produits");
const ficheProduit = document.getElementById("fiche-produit");
const detailsProduit = document.getElementById("details-produit");
const fermerFicheProduit = document.getElementById("fermer-fiche-produit");
const ajouterPanierDetails = document.getElementById("ajouter-panier-details");
const listePanier = document.getElementById("liste-panier");
const totalPanier = document.getElementById("total-panier");
const viderPanier = document.getElementById("vider-panier");
const boutonPanier = document.getElementById("bouton-panier");


// ==============================
// PANIER EN MÉMOIRE
// ==============================

let panier = [];

let stockageDisponible = false;


// ==============================
// VÉRIFICATION DU LOCALSTORAGE
// ==============================

function verifierStockage() {
    try {
        const test = "__test_stockage__";

        localStorage.setItem(test, "ok");
        localStorage.removeItem(test);

        return true;
    } catch (erreur) {
        return false;
    }
}


// ==============================
// VALIDATION D'UNE QUANTITÉ
// ==============================

function quantiteValide(quantite) {
    return (
        Number.isInteger(quantite) &&
        quantite >= 1 &&
        quantite <= 99
    );
}


// ==============================
// RECHERCHER UN PRODUIT
// ==============================

function trouverProduit(idProduit) {
    return produits.find(function (produit) {
        return produit.id === idProduit;
    });
}


// ==============================
// VALIDATION DU PANIER
// ==============================

function panierValide(donnees) {
    if (!Array.isArray(donnees)) {
        return false;
    }

    return donnees.every(function (article) {
        if (!article || typeof article !== "object") {
            return false;
        }

        if (typeof article.id !== "string") {
            return false;
        }

        if (!trouverProduit(article.id)) {
            return false;
        }

        return quantiteValide(article.quantite);
    });
}


// ==============================
// CHARGER LE PANIER
// ==============================

function chargerPanier() {
    stockageDisponible = verifierStockage();

    if (!stockageDisponible) {
        panier = [];
        return;
    }

    try {
        const donnees = localStorage.getItem("panier-elegance-sacs");

        if (!donnees) {
            panier = [];
            return;
        }

        const panierParse = JSON.parse(donnees);

        if (panierValide(panierParse)) {
            panier = panierParse;
        } else {
            panier = [];
            localStorage.removeItem("panier-elegance-sacs");
        }
    } catch (erreur) {
        panier = [];
    }
}


// ==============================
// SAUVEGARDER LE PANIER
// ==============================

function sauvegarderPanier() {
    if (!stockageDisponible) {
        return;
    }

    try {
        const donnees = panier.map(function (article) {
            return {
                id: article.id,
                quantite: article.quantite
            };
        });

        localStorage.setItem(
            "panier-elegance-sacs",
            JSON.stringify(donnees)
        );
    } catch (erreur) {
        stockageDisponible = false;
    }
}


// ==============================
// AJOUTER AU PANIER
// ==============================

function ajouterAuPanier(idProduit) {
    const produit = trouverProduit(idProduit);

    if (!produit) {
        return;
    }

    const articleExistant = panier.find(function (article) {
        return article.id === idProduit;
    });

    if (articleExistant) {
        if (articleExistant.quantite < 99) {
            articleExistant.quantite += 1;
        }
    } else {
        panier.push({
            id: idProduit,
            quantite: 1
        });
    }

    sauvegarderPanier();
    afficherPanier();
}


// ==============================
// MODIFIER LA QUANTITÉ
// ==============================

function modifierQuantite(idProduit, nouvelleQuantite) {
    const article = panier.find(function (element) {
        return element.id === idProduit;
    });

    if (!article) {
        return;
    }

    if (!quantiteValide(nouvelleQuantite)) {
        afficherPanier();
        return;
    }

    article.quantite = nouvelleQuantite;

    sauvegarderPanier();
    afficherPanier();
}


// ==============================
// RETIRER UN PRODUIT
// ==============================

function retirerDuPanier(idProduit) {
    panier = panier.filter(function (article) {
        return article.id !== idProduit;
    });

    sauvegarderPanier();
    afficherPanier();
}


// ==============================
// VIDER LE PANIER
// ==============================

function viderToutLePanier() {
    panier = [];

    sauvegarderPanier();
    afficherPanier();
}


// ==============================
// CALCUL DU TOTAL
// ==============================

function calculerTotal() {
    return panier.reduce(function (total, article) {
        const produit = trouverProduit(article.id);

        if (!produit) {
            return total;
        }

        return total + produit.prix * article.quantite;
    }, 0);
}


// ==============================
// AFFICHER LE PANIER
// ==============================

function afficherPanier() {
    listePanier.innerHTML = "";

    if (panier.length === 0) {
        const message = document.createElement("p");
        message.textContent = "Votre panier est vide.";

        listePanier.appendChild(message);

        totalPanier.textContent = "0 FCFA";
        return;
    }

    panier.forEach(function (article) {
        const produit = trouverProduit(article.id);

        if (!produit) {
            return;
        }

        const conteneur = document.createElement("div");

        const nom = document.createElement("h3");
        nom.textContent = produit.nom;

        const prix = document.createElement("p");
        prix.textContent =
            `Prix unitaire : ${produit.prix.toLocaleString("fr-FR")} FCFA`;

        const montant = document.createElement("p");
        montant.textContent =
            `Montant : ${(produit.prix * article.quantite).toLocaleString("fr-FR")} FCFA`;

        const labelQuantite = document.createElement("label");
        labelQuantite.textContent = "Quantité : ";

        const champQuantite = document.createElement("input");
        champQuantite.type = "number";
        champQuantite.min = "1";
        champQuantite.max = "99";
        champQuantite.step = "1";
        champQuantite.value = article.quantite;
        champQuantite.inputMode = "numeric";
        champQuantite.dataset.id = produit.id;
        champQuantite.setAttribute(
            "aria-label",
            `Quantité de ${produit.nom}`
        );

        const boutonRetirer = document.createElement("button");
        boutonRetirer.type = "button";
        boutonRetirer.textContent = "Retirer";
        boutonRetirer.dataset.id = produit.id;

        labelQuantite.appendChild(champQuantite);

        conteneur.appendChild(nom);
        conteneur.appendChild(prix);
        conteneur.appendChild(labelQuantite);
        conteneur.appendChild(montant);
        conteneur.appendChild(boutonRetirer);

        listePanier.appendChild(conteneur);
    });

    totalPanier.textContent =
        `${calculerTotal().toLocaleString("fr-FR")} FCFA`;
}


// ==============================
// AFFICHAGE DES PRODUITS
// ==============================

function afficherProduits() {
    grilleProduits.innerHTML = "";

    produits.forEach(function (produit) {
        const article = document.createElement("article");

        const image = document.createElement("img");
        image.src = produit.image;
        image.alt = produit.nom;

        const titre = document.createElement("h3");
        titre.textContent = produit.nom;

        const prix = document.createElement("p");
        prix.textContent =
            `${produit.prix.toLocaleString("fr-FR")} FCFA`;

        const description = document.createElement("p");
        description.textContent = produit.description;

        const boutonDetails = document.createElement("button");
        boutonDetails.type = "button";
        boutonDetails.textContent = "Voir les détails";
        boutonDetails.dataset.id = produit.id;

        const boutonPanier = document.createElement("button");
        boutonPanier.type = "button";
        boutonPanier.textContent = "Ajouter au panier";
        boutonPanier.dataset.id = produit.id;

        article.appendChild(image);
        article.appendChild(titre);
        article.appendChild(prix);
        article.appendChild(description);
        article.appendChild(boutonDetails);
        article.appendChild(boutonPanier);

        grilleProduits.appendChild(article);
    });
}


// ==============================
// OUVERTURE DES DÉTAILS
// ==============================

function ouvrirDetails(idProduit) {
    const produit = trouverProduit(idProduit);

    if (!produit) {
        return;
    }

    detailsProduit.innerHTML = "";

    const image = document.createElement("img");
    image.src = produit.image;
    image.alt = produit.nom;

    const titre = document.createElement("h3");
    titre.textContent = produit.nom;

    const categorie = document.createElement("p");
    categorie.textContent = `Catégorie : ${produit.categorie}`;

    const prix = document.createElement("p");
    prix.textContent =
        `Prix : ${produit.prix.toLocaleString("fr-FR")} FCFA`;

    const description = document.createElement("p");
    description.textContent = produit.description;

    detailsProduit.appendChild(image);
    detailsProduit.appendChild(titre);
    detailsProduit.appendChild(categorie);
    detailsProduit.appendChild(prix);
    detailsProduit.appendChild(description);

    ajouterPanierDetails.dataset.id = produit.id;

    ficheProduit.showModal();
}


// ==============================
// ÉVÉNEMENT SUR LE CATALOGUE
// ==============================

grilleProduits.addEventListener("click", function (event) {
    if (!event.target.matches("button")) {
        return;
    }

    const idProduit = event.target.dataset.id;

    if (event.target.textContent === "Voir les détails") {
        ouvrirDetails(idProduit);
    }

    if (event.target.textContent === "Ajouter au panier") {
        ajouterAuPanier(idProduit);
    }
});


// ==============================
// AJOUT DEPUIS LA FENÊTRE
// ==============================

ajouterPanierDetails.addEventListener("click", function () {
    const idProduit = ajouterPanierDetails.dataset.id;

    ajouterAuPanier(idProduit);
});


// ==============================
// FERMETURE DE LA FENÊTRE
// ==============================

fermerFicheProduit.addEventListener("click", function () {
    ficheProduit.close();
});


// ==============================
// ÉVÉNEMENTS DU PANIER
// ==============================

listePanier.addEventListener("change", function (event) {
    if (event.target.matches('input[type="number"]')) {
        const idProduit = event.target.dataset.id;
        const nouvelleQuantite = Number(event.target.value);

        modifierQuantite(idProduit, nouvelleQuantite);
    }
});

listePanier.addEventListener("click", function (event) {
    if (!event.target.matches("button")) {
        return;
    }

    const idProduit = event.target.dataset.id;

    retirerDuPanier(idProduit);
});


// ==============================
// VIDER LE PANIER
// ==============================

viderPanier.addEventListener("click", function () {
    viderToutLePanier();
});


// ==============================
// BOUTON PANIER
// ==============================

boutonPanier.addEventListener("click", function () {
    document.getElementById("panier").scrollIntoView({
        behavior: "smooth"
    });
});


// ==============================
// INITIALISATION
// ==============================

chargerPanier();
afficherProduits();
afficherPanier();