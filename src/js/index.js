const useState = React.useState;

function shortenUrl(url) {
  return new Promise((resolve, reject) => {
    let linkRequest = {
      destination: url,
      domain: { fullName: "rebrand.ly" },
    };

    let requestHeaders = {
      "Content-Type": "application/json",
      apikey: "08125f5fc16149a485908fe8c40c24bf",
    };

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
  });

  // shortUrl - Property
}

function completeUrl(url) {
  return "https://" + url;
}

function App() {
  const [links, setLinks] = useState(
    JSON.parse(localStorage.getItem("links")) || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(url) {
    setIsSubmitting(true);
    let short;
    try {
      short = await shortenUrl(url);
    } catch (err) {
      setIsSubmitting(false);
      alert(err);
      return;
    }

    const newLinks = [{ long: url, short, id: crypto.randomUUID() }, ...links];

    localStorage.setItem("links", JSON.stringify(newLinks));
    setLinks(newLinks);
    setIsSubmitting(false);
  }

  function handleRemove(linkId) {
    const newLinks = links.filter((l) => l.id !== linkId);
    localStorage.setItem("links", JSON.stringify(newLinks));
    setLinks(newLinks);
  }

  return (
    <div className="container">
      <div className="top-part">
        <Form onSubmit={handleSubmit} disabled={isSubmitting} />

        {isSubmitting && (
          <div style={{ marginTop: "1em" }}>
            <div className="spinner" style={{ marginInline: "auto" }}></div>
          </div>
        )}
      </div>
      <ListOfLinks links={links} onRemove={handleRemove} />
    </div>
  );
}

function Form({ onSubmit, disabled }) {
  const [url, setUrl] = useState("");
  const [isEmpty, setIsEmpty] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        if (!url) {
          setIsEmpty(true);
        } else {
          setIsEmpty(false);
          onSubmit(url);
        }

      }}
    >
      <div className="field-container">
        <input
          type="url"
          placeholder="Shorten a link here..."
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
          }}
          className={`field ${isEmpty ? 'empty' : ''}`}
          disabled={disabled}
        />

        {isEmpty && <p className="error-message">Please add a link</p>}
      </div>
      <button className="btn primary-btn" type="submit" disabled={disabled}>
        Shorten It!
      </button>
    </form>
  );
}

function ListOfLinks({ links, onRemove }) {
  const [numberOfLinks, setNumberOfLinks] = useState(3);

  return (
    <div className="links-container">
      <div className="list-of-links">
        {links.map((l, i) => {
          if (i >= numberOfLinks) return;
          return <Link link={l} key={l.id} onRemove={onRemove} />;
        })}
      </div>

      {links.length > 0 && numberOfLinks < links.length && (
        <button
          className="btn secondary-btn"
          onClick={() => {
            setNumberOfLinks(numberOfLinks + 3);
          }}
          style={{
            marginInline: "auto",
            display: "block",
            marginTop: "2em",
            fontSize: '1em'
          }}
        >
          Show more
        </button>
      )}
    </div>
  );
}

function Link({ link, onRemove }) {
  const [isCopied, setIsCopied] = useState(false);

  const { long, short } = link;

  async function handleClick() {
    await navigator.clipboard.writeText(short);
    setIsCopied(true);
  }

  return (
    <div className="link">
      <div className="long">
        <a href={long} target="_blank">
          {long}
        </a>
      </div>
      <div className="short">
        <a href={short} target="_blank">
          {short}
        </a>
        <div className="buttons">
          <button
            className={`btn primary-btn ${isCopied ? "copied" : ""}`}
            onClick={handleClick}
            onTouchStart={handleClick}
            style={{cursor: 'pointer'}}
          >
            {isCopied ? "Copied!" : "Copy"}
          </button>
          <button
            className="remove-btn"
            onClick={(e) => {
              onRemove(link.id);
            }}
          >
            <i className="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.querySelector("#shorten")).render(<App />);
