import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from './routes/Home';
import Create from './routes/Create';
import DateSchedule from './routes/DateSchedule';
import { Router, Switch, Route } from 'wouter';
import "./commons/bootstrap.css";
import "./commons/index.css";
import logo from "./commons/blind-app-logo.png"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route path="/"><Home /></Route>
        <Route path="/create"><Create /></Route>
        <Route path="/edit"><Create /></Route>
        <Route path="/edit/:checkSum/:data">{params => <Create linkCheckSum={parseInt(params.checkSum)} linkData={params.data} />}</Route>
        <Route path="/date/:data">{params => <DateSchedule data={params.data} />}</Route>
        <Route path="/watcher/:checkSum/:data">{params => <DateSchedule checkSum={parseInt(params.checkSum)} data={params.data} />}</Route>
        <Route path="/test">{params => <DateSchedule test={true} />}</Route>
        <Route path="*">
          <div className="full">
            <h1>404 Error</h1>
            <h2><a style={{ fontFamily: "inherit" }} href="/">Return home</a></h2>
          </div>
        </Route>
      </Switch>
    </Router>
  </React.StrictMode>
);
