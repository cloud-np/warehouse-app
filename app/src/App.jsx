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
import ResetButton from './components/ResetButton';

const Container = styled.div`
  .adders {
    display: flex;
    justify-content: center;
  }
`

function App() {
  const [clusters, setClusters] = useState([]);

  const fetchClusters = async () => {
    const res = await serverAxios.get('/clusters');
    setClusters(res.data);
  };

  useEffect(() => {
    fetchClusters();
  }, []);

  return (
    <Container className="App">
        <h1>Warehouse App</h1>
        <ResetButton />
        <div className="card">
          <ShowAllPackages />
          <ShowClusters givenClusters={clusters} />
          <div className='adders'>
            <AddCluster reFetchClusters={fetchClusters} />
          </div>
        </div>
    </Container>
  )
}

export default App
