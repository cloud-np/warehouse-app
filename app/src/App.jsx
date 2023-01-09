import { useEffect, useState } from 'react';
import './App.css'
import AddCluster from './components/AddCluster';
import AddPackage from './components/AddPackage'
import ShowClusters from './components/ShowClusters'
import ShowPackages from './components/ShowPackages'
import styled from 'styled-components';
import { serverAxios } from './api/axiosInstance';
import ShowDrivers from './components/ShowDrivers';
import ShowAllPackages from './components/ShowAllPackages';

const Container = styled.div`

  .adders {
    display: flex;
  }
`

function App() {
  const [clusterID, setClusterID] = useState(null);
  const [clusters, setClusters] = useState([]);

  const fetchClusters = async () => {
    const res = await serverAxios.get('/clusters');
    setClusters(res.data);
  };

  useEffect(() => {
    fetchClusters();
  }, []);

  const handleClickedCluster = (cluster_id) => {
    if (cluster_id === clusterID) {
      setClusterID(null);
      return;
    }
    setClusterID(cluster_id);
  }

  return (
    <Container className="App">
      <h1>Warehouse App</h1>
      <div className="card">
        <ShowAllPackages />
        {clusterID && <ShowPackages clusterID={clusterID} />}
        {clusterID && <ShowDrivers clusterID={clusterID} />}
        <ShowClusters givenClusters={clusters} setSelectedCluster={handleClickedCluster} />
        <div className='adders'>
          <AddPackage />
          <AddCluster  reFetchClusters={fetchClusters} />
        </div>
      </div>
    </Container>
  )
}

export default App
