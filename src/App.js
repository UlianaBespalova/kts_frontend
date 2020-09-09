import React from 'react';
import './App.css';
import {Redirect, Route, BrowserRouter} from 'react-router-dom';

import WorldPage from './pages/WorldPage';
import CountryPage from './pages/CountryPage';

function App() {

  return (
    <BrowserRouter>
        <div className = 'App'>
            <Redirect exact from='/' to='/world' />
            <Route path='/world' component={WorldPage} />
            <Route path='/country/:country' component={CountryPage} />
        </div>
    </BrowserRouter>
  );
}


export default App;
