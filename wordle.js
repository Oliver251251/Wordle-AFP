document.addEventListener("keypress", function (e) {
  SzoEllenorzes(e);
});

let szavak = [];
let tippelendoSzo = "";

//json file beolvasás
fetch("szavak.json")
  .then((response) => {
    if (!response.ok) throw new Error("A file nem található!");
    return response.json();
  })
  .then((data) => (szavak = data.szavak))
  .then((data) => (tippelendoSzo = SzoKivalaszt()))
  .catch((error) => console.error("Hiba a beolvasás során:", error));

function SzoKivalaszt() {
  let szo = szavak[Math.floor(Math.random() * szavak.length)]; //tesztelés erejéig így utána összevonni

  console.log(szo);
  return szo;
}

function SzoEllenorzes(e) {
  if (e.key !== "Enter") {
    return;
  }

  //let tipp = document.getElementById();
  console.log("enter");
}
