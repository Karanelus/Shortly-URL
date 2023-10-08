const link_poleForm = document.querySelector("#link_shredder__form");
const link_poleSubmit = document.querySelector("#link_shredder__typetext");
const link_container = document.querySelector("#ShortLinkContainer ul");
const a_AllOfType = document.querySelectorAll("a");
const burgerMenu = document.querySelector("#burgermenu");
let shortLinkList = [];

burgerMenu.addEventListener("click", (e) => {
  e.target.id === "burgermenu" || e.target.className === "burgermenu__clickevent"
    ? burgerMenu.classList.toggle("burgermenu--open")
    : null;
});

link_poleForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const API_response = link_poleSubmit.value;
  fetch(`https://api.shrtco.de/v2/shorten?url=${API_response.trim()}`)
    .then((response) => response.json())
    .then((data) => createButton(data));

  return API_response;
});

const renderPage_shortLink = () => {
  link_container.innerHTML = "";

  shortLinkList.forEach((shortLinks) => {
    const addNewShortLink = `
    <li>
      <div>
        <span>${shortLinks.original_link}</span>
        <span class="short_link">${shortLinks.short_link}</span>
      </div>
      <button class="CopyButton" copy_status="0">Copy</button>
      <div class="closeButton"></div>
    </li>
    `;

    link_container.innerHTML += addNewShortLink;
  });
};

const createButton = (data) => {
  if (data.ok == false) {
    link_poleForm.setAttribute("pole_status", "error");
    link_poleSubmit.value = "";
  } else if (data.ok == true) {
    const newShortLink = {
      original_link: data.result.original_link,
      short_link: data.result.full_short_link,
    };

    shortLinkList.push(newShortLink);
    link_poleSubmit.value = "";

    link_poleForm.setAttribute("pole_status", "");
    renderPage_shortLink();

    return newShortLink;
  }
};

link_poleSubmit.addEventListener("input", () => {
  link_poleForm.setAttribute("pole_status", "");
});

document.querySelector("#ShortLinkContainer").addEventListener("click", (e) => {
  if (e.target.className === "closeButton") {
    const closeButtons = [...document.querySelectorAll("div.closeButton")];
    const elementCB_Index = closeButtons.indexOf(e.target);
    shortLinkList = shortLinkList.filter((el, index) => {
      return index !== elementCB_Index;
    });

    renderPage_shortLink();
    return { closeButtons, elementCB_Index };
  }
  if (e.target.tagName === "BUTTON") {
    const CopyButton_active = e.target;
    const CopyButton_copiedText = CopyButton_active.previousElementSibling.lastElementChild.textContent;
    navigator.clipboard.writeText(CopyButton_copiedText);

    CopyButton_active.innerText = "Copied!";
    CopyButton_active.setAttribute("copy_status", "1");

    setTimeout(() => {
      CopyButton_active.innerText = "Copy";
      CopyButton_active.setAttribute("copy_status", "0");
    }, 1400);

    return CopyButton_active;
  }
});
