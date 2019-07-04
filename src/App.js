import React, { useState, useEffect } from "react";
import axios from "axios";

export default function App() {
  const [repositories, setRepositories] = useState([]);
  const [location, setLocation] = useState({});

  useEffect(() => {
    const watchID = navigator.geolocation.watchPosition(handlePosition);

    return () => navigator.geolocation.clearWatch(watchID);
  }, []);

  function handlePosition({ coords }) {
    const { latitude, longitude } = coords;
    setLocation({ latitude, longitude });
  }

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(
        "https://api.github.com/users/naeliofreires/repos"
      );
      setRepositories(response.data);
    }

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = repositories.filter(repo => repo.favorite);
    document.title = `${filtered.length} Favoritos`;
  }, [repositories]);

  function handleFavorite(id) {
    const newRepositories = repositories.map(repo => {
      return repo.id === id ? { ...repo, favorite: !repo.favorite } : repo;
    });

    setRepositories(newRepositories);
  }

  return (
    <>
      <h1>Minhas Coordenadas</h1>
      <b>Latitude: </b> {location.latitude} <br />
      <b>Longitude: </b> {location.longitude}
      <br />
      <h1>Meus Repo no GitHub</h1>
      <ul>
        {repositories.map(repo => (
          <li key={repo.id}>
            {repo.favorite && <span>[ * ]</span>}
            {repo.name}
            <button onClick={() => handleFavorite(repo.id)}>Favoritar</button>
          </li>
        ))}
      </ul>
    </>
  );
}
