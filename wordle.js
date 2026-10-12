document.addEventListener("keydown", EventF);

function EventF(e) {
  if (e.key === "Enter") {
    SzoEllenorzes();
    return;
  } else if (e.key === "Backspace") {
    Torol();
    return;
  } else if (/^[A-ZÁÉÍÓÖŐÚÜŰa-záéíóöőúüű\s]+$/.test(e.key)) {
    if (e.ctrlKey || e.metaKey) {
      return;
    }

    if (e.key.length !== 1 || e.altKey) {
      return;
    }

    BetuBerak(e.key);
    return;
  }
}


let szavak = [];
let tippelendoSzo = "";
let tipp = "";
let sor = 1;
let oszlop = -1;
let cellak = document.getElementsByClassName("cell");
let billentyuk = document.getElementsByClassName("key");
let mostaniSor = [];
let probaDarab = 6;

//json file beolvasás
fetch("../Backend/szavak.json")
  .then((response) => {
    if (!response.ok) throw new Error("A file nem található!");
    return response.json();
  })
  .then((data) => (szavak = data.szavak))
  .then((data) => (tippelendoSzo = SzoKivalaszt()))
  .catch((error) => console.error("Hiba a beolvasás során:", error));

function SzoKivalaszt() {
  let szo = szavak[Math.floor(Math.random() * szavak.length)]; //tesztelés erejéig így utána összevonni
  SorValt();
  console.log(szo);
  return szo;
}

function SzoEllenorzes() {
  if (tipp === tippelendoSzo) {
    Szinez();
    setTimeout(() => {
      Mutat(true);
    }, 100);
  } else if (tipp.length === 5) {
    if (!szavak.includes(tipp)) {
      //szó szerepel-e az adatbázisban ellenőrzése
      let szoveg = document.getElementsByClassName("sub")[0];
      szoveg.innerHTML = "A megadott szó nem szerepel a felhasználható szavak listájában!";
      szoveg.classList.add("present");
      setTimeout(() => {
        szoveg.classList.remove("present");
        szoveg.innerHTML = "Találd ki az 5 betűs szót 6 próbálkozásból";
      }, 3000);
      return;
    }

    //Mutat(false);
    sor++;
    Szinez();
    SorValt();
    probaDarab--;

    if (probaDarab === 0) {
      Mutat(false);
    }
  }
}

function BetuBerak(e) {
  if (tipp.length === 5) {
    return;
  }

  tipp += e;
  oszlop++;
  mostaniSor[oszlop].innerHTML = e;
}

function Szinez() {
  // A megoldásban található betűk számolása
  let maradekBetuk = {};

  for (let i = 0; i < tippelendoSzo.length; i++) {
    let betu = tippelendoSzo[i];

    if (maradekBetuk[betu]) {
      maradekBetuk[betu]++;
    } else {
      maradekBetuk[betu] = 1;
    }
  }

  // 1. kör: először a ZÖLD betűket keressük
  for (let i = 0; i < mostaniSor.length; i++) {
    if (mostaniSor[i].innerHTML === tippelendoSzo[i]) {
      mostaniSor[i].classList.add("correct");

      // Ezt a betűt már felhasználtuk
      maradekBetuk[mostaniSor[i].innerHTML]--;
    }
  }

  // 2. kör: ezután a SÁRGA / SZÜRKE betűket
  for (let i = 0; i < mostaniSor.length; i++) {
    // Ha már zöld, nem kell újra ellenőrizni
    if (mostaniSor[i].classList.contains("correct")) {
      continue;
    }

    let betu = mostaniSor[i].innerHTML;

    if (maradekBetuk[betu] > 0) {
      mostaniSor[i].classList.add("present");

      // Ezt a példányt is felhasználtuk
      maradekBetuk[betu]--;
    } else {
      mostaniSor[i].classList.add("absent");
    }
  }
}

function Torol() {
  if (tipp === "") {
    return;
  }

  tipp = tipp.substring(0, tipp.length - 1);
  mostaniSor[oszlop].innerHTML = " ";
  oszlop--;
}

function SorValt() {
  mostaniSor = [];
  for (let i = (sor - 1) * 5; i < sor * 5; i++) {
    mostaniSor.push(cellak[i]);
  }
  oszlop = -1;
  tipp = "";
}

function Mutat(nyert) {
  //van értelme ennek?
  if (nyert) {
    FelugroAblak("Nyertél!");

  }else{
    FelugroAblak("Vesztettél");
  }

  document.removeEventListener("keydown", EventF);
}


function FelugroAblak(
    szovegKi,
    nyert = false,
    megoldas = "",
    ujJatekFelirat = "Új játék",
    bezarasFelirat = "Bezárás"
) {
    // Háttér
    const felugro = document.createElement("div");
    felugro.id = "end-modal";

    // Ablak tartalma
    const tartalom = document.createElement("div");
    tartalom.classList.add("modal-content");

    // Cím
    const cim = document.createElement("h2");
    cim.textContent = nyert ? "Gratulálok!" : "Játék vége";

    // Eredmény szövege
    const szoveg = document.createElement("p");
    szoveg.textContent = szovegKi;

    // Helyes megoldás (opcionális)
    if (megoldas) {
        const megoldasElem = document.createElement("div");
        megoldasElem.id = "solution";
        megoldasElem.textContent = megoldas;
        tartalom.appendChild(cim);
        tartalom.appendChild(szoveg);
        tartalom.appendChild(megoldasElem);
    } else {
        tartalom.appendChild(cim);
        tartalom.appendChild(szoveg);
    }

    // Gombok tárolója
    const gombok = document.createElement("div");
    gombok.classList.add("modal-buttons");

    // Új játék gomb
    const ujJatekGomb = document.createElement("button");
    ujJatekGomb.id = "play-again";
    ujJatekGomb.textContent = ujJatekFelirat;

    ujJatekGomb.addEventListener("click", () => {
        felugro.remove();

        // Ha van globális új játék függvényed, itt hívhatod meg.
        if (typeof UjJatek === "function") {
            UjJatek();
        }
    });

    // Bezárás gomb
    const bezarasGomb = document.createElement("button");
    bezarasGomb.id = "close-modal";
    bezarasGomb.textContent = bezarasFelirat;

    bezarasGomb.addEventListener("click", () => {
        felugro.remove();
    });

    // Összeállítás
    gombok.appendChild(ujJatekGomb);
    gombok.appendChild(bezarasGomb);

    tartalom.appendChild(gombok);
    felugro.appendChild(tartalom);
    document.body.appendChild(felugro);

    return felugro;
}


function UjJatek() {
  window.location.reload();
}
