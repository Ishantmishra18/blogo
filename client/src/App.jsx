import React, { useState } from 'react';
import Upload from './Components/upload';
import Dashboard from './Components/dashboard';

function App() {
  const [user, setUser] = useState(null);

  return (
    <div className="App">
      {user ? <Dashboard /> : <Upload />}
    </div>
  );
}

export default App;