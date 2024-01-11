import React from 'react';
import './App.css';
import AddCluster from './components/AddCluster';
import styled from 'styled-components';
import MainTable from './components/ui/MainTable';
import { CEREMONIES_TABLE_CONFIG } from './constants/ceremonies.const.table';
import CeremonyRows from './components/ceremony/CeremonyRows';

const Container = styled.div`
  .adders {
    display: flex;
    justify-content: center;
  }
`

function App() {
    return (
        <Container>
            <h1>Βρες Δεξίωση - Άτομο</h1>
            <h2>Search bar here</h2>
            <h5>Search Based things</h5>
            <input />
            {/* <ResetButton /> */}
            <MainTable {...CEREMONIES_TABLE_CONFIG}>
                <CeremonyRows />
            </MainTable>

            <div className="card">
                <div className='adders'>
                    <AddCluster />
                </div>
            </div>
        </Container>
    )
}

export default App
