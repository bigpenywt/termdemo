import React from 'react';
import {render} from 'react-dom';

import Main from './components/Main.jsx';

let userRole = document.getElementById('userrole').value;

render((<Main userRole={userRole}/>), document.getElementById('index'));
