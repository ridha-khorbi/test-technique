import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter, Switch, Route, Link,Redirect } from 'react-router-dom';
import Brands from './components/brands';
import Brand from './components/brand';

/* ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
); */



const routing = (
  <BrowserRouter>
    <div>
  
      <Switch>
        <Route
                exact
                path="/"
                render={() => {
                    return (
                      
                      <Redirect to="/brand/" />
                    )
                }}
              /> 
        <Route path="/brands" component={Brands} />
      {/*   <Route path="/brand" component={Brand} /> */}
       <Route exact path="/brand/:id?" component={Brand} />
      </Switch>
    </div>
  </BrowserRouter>
)
 
ReactDOM.render(routing, document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
