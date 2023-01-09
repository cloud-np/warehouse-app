import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { serverAxios } from '../api/axiosInstance';
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

const ShowDrivers = ({ clusterID }) => {
    const [drivers, setDrivers] = useState([]);

    useEffect(() => {
        const fetchDrivers = async () => {
            const res = await serverAxios.get(`/drivers/${clusterID}`);
            setDrivers(res.data);
        }
        fetchDrivers();
    }, [clusterID]);

    return (
        <Container>
            <div>
                <table>
                    <tr>
                        <th>Cluster Drivers</th>
                        <th>Status</th>
                    </tr>
                    {drivers.map((driver) =>
                        <tr key={driver.id}>
                            <td>{driver.dname}</td>
                            <td className={driver.is_ready ? "ready" : "notReady"}>{driver.is_ready ? "Ready" : "Not Ready"}</td>
                        </tr>
                    )}
                </table>
                {drivers.length === 0 && <AddDriver clusterID={clusterID} />}
            </div>
        </Container>
    )
}

export default ShowDrivers