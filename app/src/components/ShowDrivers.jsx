import React from 'react'
import styled from 'styled-components'
import AddDriver from './AddDriver';

const Container = styled.div`
display: flex;
justify-content: center;
align-items: center;

flex-direction: column;
button {
    margin: .5rem;
}

table {
    margin-top: 2rem;
    border-collapse: collapse;
    tr{
        border: 1px solid black;
    }

    td, th {
        padding: .8rem;
    }
}

.ready {
    color: green;
}
.notReady {
    color: red;
}
`

const ShowDrivers = ({ drivers, clusterID = null }) => {
    return (
        <Container>
            <div>
                <table>
                    <tbody>
                        <tr>
                            <th>Drivers</th>
                            <th>Cluster</th>
                            <th>Status</th>
                            <th>Packages left</th>
                        </tr>
                        {drivers.map((driver, index) =>
                            <tr key={index}>
                                <td>{driver.dname}</td>
                                <td>{driver.cname}</td>
                                <td className={driver.is_ready ? "ready" : "notReady"}>{driver.is_ready ? "Ready" : "Not Ready"}</td>
                                <td>{driver.packages_left}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {drivers.length === 0 && clusterID && <AddDriver clusterID={clusterID} />}
            </div>
        </Container>
    )
}

export default ShowDrivers