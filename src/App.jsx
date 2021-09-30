import React from "react";
import "./App.css";
import MainPage from "./Pages/MainPage";
import Store from "./Store/store";

function App() {
  const store = new Store();

  return <MainPage store={store} />;
}

export default App;
