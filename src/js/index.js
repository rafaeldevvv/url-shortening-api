const useState = React.useState;

async function shortenLink(url) {
  let linkRequest = {
    destination: url,
    domain: { fullName: "rebrand.ly" },
  };

  let requestHeaders = {
    "Content-Type": "application/json",
    apikey: "08125f5fc16149a485908fe8c40c24bf",
  };

  return await fetch("https://api.rebrandly.com/v1/links", {
    headers: requestHeaders,
    method: "POST",
    body: JSON.stringify(linkRequest),
  }).then((response) => response.json());
}

function App() {
  const [links, setLinks] = useState(
    JSON.parse(localStorage.getItem("links")) || [
      { id: 5, shortened: "a", original: "b" },
    ]
  );

  async function handleSubmit(url) {
    let newLink = await shortenLink(url);

    setLinks([
      {
        original: newLink.destination,
        shortened: newLink.short,
        id: crypto.randomUUID(),
      },
      ...links,
    ]);
  }

  return (
    <div>
      <div className="container">
        <Form onSubmit={handleSubmit} />
      </div>
      <LinkList links={links} />
    </div>
  );
}

function Form({ onSubmit }) {
  const [url, setUrl] = useState("");
  const [isEmpty, setIsEmpty] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!e.target.elements.url.value) {
          setIsEmpty(true);
        } else {
          onSubmit(url);
        }
      }}
    >
      <div>
      <input
        type="url"
        name="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="field"
        placeholder="Shorten a link here..."
      />
        {isEmpty && <p className='errorMessage'>Please add a link</p>}
      </div>
      <button type="submit" className="btn primary-btn">
        Shorten it!
      </button>
    </form>
  );
}

function LinkList({ links }) {
  return (
    <div className="links">
      {links.map((l) => (
        <Link key={l.id} link={l} />
      ))}
    </div>
  );
}

function Link({ link }) {
  function handleClick() {}

  return (
    <div className="link">
      <div className="previous">
        <a href={link.original}>{link.original}</a>
      </div>
      <div className="short">
        <a href={link.shortened}>{link.shortened}</a>
        <button onClick={handleClick} class='btn primary-btn'>Copy</button>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.querySelector("#shorten")).render(<App />);
