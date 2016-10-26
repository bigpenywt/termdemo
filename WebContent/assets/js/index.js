import React from 'react';
import {render} from 'react-dom';

import Main from './components/Main.jsx';

let userRole = document.getElementById('userrole').value;
let userName = document.getElementById('username').value;

render((<Main userRole={userRole} userName={userName}/>), document.getElementById('index'));
