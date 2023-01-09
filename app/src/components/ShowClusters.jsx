import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
display: flex;
justify-content: center;
align-items: center;

flex-direction: column;
button {
    margin: .5rem;
}
`

const ShowClusters = ({ givenClusters, setSelectedCluster }) => {

    return (
        <Container>
            <p>View packages by Cluster. Click a cluster to reveal the packges it contains. (click again to hide them.)</p>
            <div>
                {givenClusters.map((cluster) =>
                    // This is just for demonstration reasons..
                    <button key={cluster.id} onClick={() => setSelectedCluster(cluster.id)}>
                        <h4>{cluster.cname}</h4>
                        <h2>{cluster.ccode}</h2>
                    </button>
                )}
            </div>
        </Container>
    )
}

export default ShowClusters