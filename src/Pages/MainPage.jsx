import React from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import Form from "../Components/Form";
import Inform from "./Inform";
import Test from "../Components/Test";
import "./MainPage.css";

const MainPage = ({ store }) => {
  const history = useHistory();
  // eslint-disable-next-line no-unused-vars
  const onSubmit = (data) => {
    history.push("/inform");
  };

  return (
    <div>
      <Switch>
        <Route path="/" exact>
          <Form onSubmit={onSubmit} />
        </Route>
        <Route path="/inform">
          <Inform />
        </Route>
        <Route path="/test">
          <Test store={store} />
        </Route>
      </Switch>
    </div>
  );
};

export default MainPage;
