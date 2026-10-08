const authorMargins = document.getElementById("authorMargins");
let names = [];
articles.forEach((element) => {
  const author = element.author;
  const existing = names.find((name) => name.author === author);

  if (existing) {
    existing.publishCount += 1;
  } else {
    names.push({ author, publishCount: 1 });
  }
});
console.log(JSON.stringify(names));

/* names = [
  {"author":"Kxattof","publishCount":2},
  {"author":"Mysterious and evil author","publishCount":1},
  {"author":"Luna Whitmore","publishCount":14},
  {"author":"DragonQuillX","publishCount":9},
  {"author":"Professor Marrowbone","publishCount":6},
  {"author":"ink_and_ember","publishCount":23},
  {"author":"Thaddeus Vale","publishCount":4},
  {"author":"Sable Nightingale","publishCount":11},
  {"author":"quietwriter42","publishCount":1},
  {"author":"Odalys Ferreira","publishCount":7},
  {"author":"The Nameless Bard","publishCount":3},
  {"author":"Brindle Hollow","publishCount":18}
] */

names.sort((a, b) => b.publishCount - a.publishCount);

names.forEach((element) => {
  const div = document.createElement("div");
  div.classList.add("authorContainer");

  const nameCard = document.createElement("div");
  nameCard.classList.add("nameCard");
  div.append(nameCard);

  const pfp = document.createElement("img");
  pfp.src = "/assets/Profile_Picture2.png";
  pfp.classList.add("pfpPicture");
  nameCard.append(pfp);

  const name = document.createElement("span");
  name.innerText = element.author;
  nameCard.append(name);

  const publishCount = document.createElement("span");
  publishCount.classList.add("publishCount");
  publishCount.innerText = "Articles Published: " + element.publishCount;
  div.append(publishCount);

  authorMargins.append(div);

  div.addEventListener("click", () => {
      window.location.href = `/author/${element.author}`;
      });
});
