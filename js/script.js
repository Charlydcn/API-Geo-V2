const inputCP = document.querySelector(".cp")
const selectVille = document.querySelector(".ville")
const mapContainer = document.querySelector("#map")
/*
    on déclare ville, map et marker de manière globale pour pouvoir les modifier à l'infini, pour permettre à l'utilisateur
    de chercher plusieurs villes
*/
var ville = null
var map = null
var marker = null

// à chaque entrée dans l'input text,
inputCP.addEventListener('input', () => {
    let value = inputCP.value // on récupère la value de l'input
    selectVille.innerText = null // on vide le placeholder de la liste déroulante

    // si l'input est de 5 ou plus (la longueur d'un code postal français)
    if(value.length >= 5) {
        // endpoint de l'API Geo du Gouvernement Français
        fetch(`https://geo.api.gouv.fr/communes?codePostal=${value}&fields=code,nom,centre`)
        .then((response) => response.json())
        .then((data) => {
            // pour éviter les erreur inutiles dans la console
            if(data.length > 0) {
                if(mapContainer.style.display === 'none') {
                    mapContainer.style.display = 'block'
                }
                // pour chaque ville de la réponse de l'API, on hydrate la liste déroulante
                data.forEach((ville) => {
                    let option = document.createElement('option')
                    option.value = `${ville.code}`
                    option.innerHTML = `${ville.nom}`
                    selectVille.appendChild(option)
                })

                // on récupère les coordonnées et la ville dans la réponse
                let latitude = data[0]['centre']['coordinates'][1]
                let longitude = data[0]['centre']['coordinates'][0]
                ville = data[0]['nom']

                // on set la map avec les coordonnées et le zoom par défaut
                map = L.map('map').setView([latitude, longitude], 11)
                /*
                    si on veut ajouter des paramètres à la carte :
                    map = L.map('map').setView([latitude, longitude], {
                        parametre1: 'valeur',
                        parametre2: 'valeur',
                        parametre3: 'valeur',
                    }, 11)
                */

                // on ajoute un marqueur avec une popup au clique dessus ayant comme valeur la ville
                marker = L.marker([latitude, longitude]).addTo(map).bindPopup(ville)

                // si on clique sur le marqueur, la popup apparait
                marker.on('click', () => {
                    marker.openPopup()
                })

                // on ajoute une couche à la map, avec un tableau de paramètres
                L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                }).addTo(map)
            }           
        })

        // si le code postal comprend plusieurs communes, si l'utilisateur sélectionne une autre ville dans la liste déroulante,
        selectVille.addEventListener('change', () => {
            const selectedOption = selectVille.options[selectVille.selectedIndex]
            const selectedValue = selectedOption.textContent
            
            // on change le contenu de la popup du marqueur
            marker.bindPopup(selectedValue)
        })
        
    // si l'input est inférieur à 5, on supprime la map et on cache le container
    } else {
        if(map) {
            mapContainer.style.display = 'none'
            map.remove()
            map = null
        }
    }
})

// Exemple d'utilisation de l'API REST personnalisée (voir fichier www/CDA/SfAPI_Users)
// fetch('https://127.0.0.1:8000/api/membres')
// .then((response) => response.json())
//         .then((data) => {
//             const membres = data['hydra:member']

//             membres.forEach((membre) => {
//                 console.log(`Bienvenue ${membre['title']}. ${membre['last']} ${membre['first']} !`)
//             })
//         })