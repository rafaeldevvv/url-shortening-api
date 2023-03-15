# Frontend Mentor - Shortly URL shortening API Challenge solution

This is a solution to the [Shortly URL shortening API Challenge challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/url-shortening-api-landing-page-2ce3ob-G). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Links](#links)
  - [Observations](#observations)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
- [Author](#author)

## Overview

### The challenge

Users should be able to:

- View the optimal layout for the site depending on their device's screen size
- Shorten any valid URL
- See a list of their shortened links, even after refreshing the browser
- Copy the shortened link to their clipboard in a single click
- Receive an error message when the `form` is submitted if:
  - The `input` field is empty

### Links

- Solution URL: [here](https://github.com/rafaeldevvv/url-shortening-api)
- Live Site URL: [here](https://rafaeldevvv.github.io/url-shortening-api/)

### Observations

This was the project I had most fun so far. I really enjoyed building this.

I couldn't access the site of the rel.ink api for some reason so I just used another api called rebrand.ly.

And also I added node_modules to stage and committed by accident.

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Flexbox
- Mobile-first workflow
- [React](https://reactjs.org/) - JS library

### What I learned

In this part I just put the script right below the nav, because as it was just a few lines of code, I don't think there's a real problem in not creating a file just for this.

```html
<script>
  const navList = document.querySelector("#navList");
  window.addEventListener("click", (e) => {
    if (e.target.id === "toggle-button") {
      const visible = navList.getAttribute("data-visible");

      navList.setAttribute("data-visible", visible === "false" ? true : false);
    } else if (e.target.id !== navList.id) {
      navList.setAttribute("data-visible", false);
    }
  });
</script>
```

Here I just reused the hamburguer icon from another project because it was easier than creating my own.
```scss
#toggle-button {
  outline: 0;
  border: 0;
  background: none;

  width: 35px;
  aspect-ratio: 1;

  background-image: url("../images/icon-hamburger.svg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 140% 190%;
}
```

I was doing some tests and discovered that this api can return error codes in the body of the response. So I added two rejects: one for possible network failures and one for that kind of error.
```js
fetch("https://api.rebrandly.com/v1/links", {
  headers: requestHeaders,
  method: "POST",
  body: JSON.stringify(linkRequest),
})
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    if (data.httpCode >= 400) {
      reject(new Error(data.message));
    } else {
      resolve(completeUrl(data.shortUrl));
    }
  })
  .catch(reject);
```

I added this functionality because I was doing some tests and wanted to remove some of the links without cleaning up my history or removing the item from my localStorage manually. It is very convenient and was good practice.

```js
function handleRemove(linkId) {
  const newLinks = links.filter((l) => l.id !== linkId);
  localStorage.setItem("links", JSON.stringify(newLinks));
  setLinks(newLinks);
}
```

I really liked this spinner. I think it is a good way to signal that something is being done.

```js
{
  isSubmitting && (
    <div style={{ marginTop: "1em" }}>
      <div className="spinner" style={{ marginInline: "auto" }}></div>
    </div>
  );
}
```

I also added a "See more" functionality because if the user has too many links saved, it can be annoying to have a long list in the page.

```js
const [numberOfLinks, setNumberOfLinks] = useState(3);
```

I didn't know it was that simple to copy something to the clipboard.

```js
async function handleClick() {
  await navigator.clipboard.writeText(short);
  setIsCopied(true);
}
```

### Continued development

I'm currently learning React, so I want to get more knowledge on this amazing JS library. I really liked it. It is easier and simpler than plain javascript.

### Useful resources

- [Stack Overflow](https://rebrand.ly/tw2zpwa) - This helped me figure out why nth-child was selecting the wrong child and gave me a solution.
- [Stack Overflow](https://rebrand.ly/r99wmqa) - This taught me to copy something to the clipboard.

## Author

- Frontend Mentor - [@rafaeldevvv](https://www.frontendmentor.io/profile/rafaeldevvv)
- Instagram - [@rafaeldevvv](https://www.instagram.com/rafaeldevvv)
