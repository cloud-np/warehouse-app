import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { serverAxios } from '../api/axiosInstance';

const Container = styled.div`
display: flex;
justify-content: center;
align-items: center;

flex-direction: column;
button {
    margin: .5rem;
}
`

const ShowClusters = ({ setSelectedCluster }) => {
    const [clusters, setClusters] = useState([]);

    useEffect(() => {
        const fetchClusters = async () => {
            const res = await serverAxios.get('/clusters');
            setClusters(res.data);
        };
        fetchClusters();
    }, []);

    return (
        <Container>
            <p>Click a cluster to reveal the packges it contains. (click again to hide them.)</p>
            <div>
                {clusters.map((cluster) =>
                    // This is just for demonstration reasons..
                    <button onClick={() => setSelectedCluster(cluster.id)}>
                        <h4>{cluster.cname}</h4>
                        <h2>{cluster.ccode}</h2>
                    </button>
                )}
            </div>
        </Container>
    )
}

export default ShowClusters