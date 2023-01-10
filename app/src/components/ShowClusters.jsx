import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { serverAxios } from '../api/axiosInstance'
import ShowDrivers from './ShowDrivers'
import ShowPackages from './ShowPackages'

const Container = styled.div`
display: flex;
justify-content: center;
align-items: center;

flex-direction: column;
button {
    margin: .5rem;
}
`

const ShowClusters = ({ givenClusters }) => {
    const [clusterID, setClusterID] = useState(null);
    const [drivers, setDrivers] = useState([]);

    const handleClickedCluster = async (cluster_id) => {
        if (cluster_id === clusterID) {
            setClusterID(null);
            return;
        }else{
            setClusterID(cluster_id);
            const res = await serverAxios.get(`/drivers/${cluster_id}`).catch(err => alert(err));
            console.log(res.data);
            setDrivers(res.data)
        }
    }

    return (
        <Container>
            <p>View packages by Cluster. Click a cluster to reveal the packges it contains. (click again to hide them.)</p>
            <div>
                {givenClusters.map((cluster) =>
                    // This is just for demonstration reasons..
                    <button key={cluster.id} onClick={() => handleClickedCluster(cluster.id)}>
                        <h4>{cluster.cname}</h4>
                        <h2>{cluster.ccode}</h2>
                    </button>
                )}
            </div>
            {clusterID && <ShowPackages clusterID={clusterID} />}
            {clusterID && <ShowDrivers clusterID={clusterID} drivers={drivers} />}
        </Container>
    )
}

export default ShowClusters