import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  let flagR = false;
  const succes = (str) => {
    toast.success(str, {
      position: "top-center",
      autoClose: false,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
      theme: "light",
    });
  }

  const fail = (str) => {
    toast.error(str, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  }
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const redirect = (id) => {
    fetch(`${process.env.REACT_APP_SERVER}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else {
          return response.text().then(text => {
            fail(text);
            throw new Error(text);
          });
        }
      })
      .then(data => window.location.href = data)
      .catch(error => console.error(error));

  }
  if (id !== null && flagR === false) {
    redirect(id);
    flagR = true;
  }


  const [oldUrl, setOldUrl] = useState('');
  const handleOld = (event) => {
    setOldUrl(event.target.value);
  };
  const [newUrl, setNewUrl] = useState('');
  const handleNew = (event) => {
    setNewUrl(event.target.value);
  };

  const createAuto = (event) => {
    event.preventDefault();
    fetch(`${process.env.REACT_APP_SERVER}/shorten`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        oldUrl
      })
    })
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else {
          return response.text().then(text => {
            fail(text);
            throw new Error(text);
          });
        }
      })
      .then(data => succes("Your URL is : " + data))
      .catch(error => console.error(error));
  }

  const createCustom = (event) => {
    event.preventDefault();
    fetch(`${process.env.REACT_APP_SERVER}/customShorten`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        oldUrl, newUrl
      })
    })
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else {
          return response.text().then(text => {
            fail(text);
            throw new Error(text);
          });
        }
      })
      .then(data => succes("Your URL is : " + data))
      .catch(error => console.error(error));
  }
  if (flagR === false) {
    return (
      <>
        <header>
          <title>URL Shortener</title>
        </header>
        <div className="Page">
          <section className="container">
            <form className="form">
              <div className="input-box">
                <label>URL Shortner</label>
                <input
                  type="text"
                  placeholder="Enter old URL"
                  name="oldUrl"
                  value={oldUrl}
                  onChange={handleOld}
                  required
                />
                <input
                  type="text"
                  placeholder="Enter new URL"
                  name="newUrl"
                  value={newUrl}
                  onChange={handleNew}
                />
              </div>
              <button onClick={createCustom}>Create Custom URL</button>
              <button onClick={createAuto}>Create Auto URL</button>
            </form>
          </section>
        </div>
        <ToastContainer />
      </>
    );
  }
}

export default App;
