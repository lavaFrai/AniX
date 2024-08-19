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
const pathname = url.pathname;
link.href = `https://anix.wah.su${pathname}`;
link.appendChild(button);

// append link and open in app link to footer
footer.appendChild(link);
footer.appendChild(openInAppLink);

// append footer to container
container.appendChild(footer);
