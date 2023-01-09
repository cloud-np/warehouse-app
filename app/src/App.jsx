import { useState } from 'react';
import './App.css'
import AddPackage from './components/AddPackage'
import ShowClusters from './components/ShowClusters'
import ShowPackages from './components/ShowPackages'

function App() {
  const [clusterID, setClusterID] = useState(null);

  const handleClickedCluster = (cluster_id) => {
    setClusterID(cluster_id);
  }

  return (
    <div className="App">
      <h1>Warehouse App</h1>
      <div className="card">
        {clusterID && <ShowPackages clusterID={clusterID} />}
        <ShowClusters setSelectedCluster={handleClickedCluster}/>
        <AddPackage />
      </div>
    </div>
  )
}

export default App
