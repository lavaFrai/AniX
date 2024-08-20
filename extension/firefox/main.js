function determineHost() {
  const url = new URL(window.location.href);
  return {
    host: url.host,
    pathname: url.pathname,
  };
}

function addButtonToAnixart(pathname) {
  // find a container and an open in app link with button
  const container = document.querySelector('div[style="text-align: center;"]');
  const openInAppLink = document.querySelector('a[href^="anixart"');
  const openInAppLinkButton = openInAppLink.querySelector("button");
  openInAppLinkButton.style = "margin-top: 0px !important;"; // disable default button margin
  openInAppLinkButton.classList = "btn btn-secondary"; // change default button from primary to secondary

  // create a custom footer
  const footer = document.createElement("div");
  footer.style =
    "display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; align-items: center; margin-top: 20px;";

  // create and set custom link
  const link = document.createElement("a");
  const button = document.createElement("button");
  button.style = "margin-top: 0px !important;";
  button.classList = "btn btn-primary";
  button.textContent = "Открыть в Anix";

  const url = new URL(window.location.href);
  link.href = `https://anix.wah.su${pathname}?ref=anixart.tv&source=extension`;
  link.appendChild(button);

  // append link and open in app link to footer
  footer.appendChild(link);
  footer.appendChild(openInAppLink);

  // append footer to container
  container.appendChild(footer);
}

function kinopoiskIsAnimeGenrePresent() {
  const genre = document.querySelector('a[href^="/lists/movies/genre--anime"]');

  if (genre) {
    return true;
  }
  return false;
}

function addButtonToKinopoisk() {
  let isAnime = kinopoiskIsAnimeGenrePresent();
  if (!isAnime) {
    console.log("genre not found");
    return;
  }
  let title = document.querySelector('h1[itemprop="name"]');
  if (!title) {
    console.log("title not found");
    return;
  }
  title = title.textContent.split(" (")[0];

  const buttonStyle = `
  display: inline-block;
  font-weight: 400;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-color: transparent;
  border: 1px solid transparent;
  font-size: 1.5rem;
  line-height: 1.5;
  border-radius: .25rem;
  transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
  padding: 1rem 2rem;
  color: #fff;
  background-color: #F04E4E;
  border-color: #F04E4E;
  `;

  const buttonHoverStyle = `
  color: #fff !important;
  background-color: #E23D3D !important;
  border-color: #E23D3D !important;
  `

  const link = document.createElement("a");
  const button = document.createElement("button");

  link.style =
    "text-decoration: none; position: fixed; bottom: 0; right: 0; margin: 1.5rem; z-index: 1000;";
  link.href = "https://anix.wah.su/search?q=" + title + "&ref=kinopoisk.ru&source=extension";
  link.appendChild(button);
  button.style = buttonStyle;
  button.onmouseover = function () {
    button.style = buttonStyle + buttonHoverStyle
  }
  button.onmouseout = function () {
    button.style = buttonStyle;
  }
  button.textContent = "Найти в Anix";

  document.body.appendChild(link);
}

const { host, pathname } = determineHost();

if (host == "anixart.tv") {
  addButtonToAnixart(pathname);
} else if (host == "www.kinopoisk.ru") {
  addButtonToKinopoisk();
}
