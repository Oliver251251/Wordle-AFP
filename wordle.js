document.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    SzoEllenorzes();
    return;
  } else if (e.key === "Backspace") {
    Torol();
    return;
  } else if (/^[a-zA-Z\u00C0-\u00FF\u0150-\u0151\u0170-\u0171]+$/.test(e.key)) {
    BetuBerak(e.key);
    return;
  }
});

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
      alert("A megadott szó nem szerepel a felhasználható szavak listájában!");
      return;
    }

    Mutat(false);
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
  for (let i = 0; i < mostaniSor.length; i++) {
    if (mostaniSor[i].innerHTML === tippelendoSzo[i]) {
      mostaniSor[i].classList.add("correct");
    } else if (tippelendoSzo.includes(mostaniSor[i].innerHTML)) {
      mostaniSor[i].classList.add("present");
    } else {
      mostaniSor[i].classList.add("absent");
    }

    //delay berakni
    //also billentyűk színezést berakni
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
  //console.log(mostaniSor); //kivenni teszt után
  oszlop = -1;
  tipp = "";
}

function Mutat(nyert) {
  //van értelme ennek?
  if (nyert) {
    alert("nyert");

    return;
  }
}

function UjJatek(params) {}
