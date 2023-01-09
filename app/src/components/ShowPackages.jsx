import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { serverAxios } from '../api/axiosInstance'

const Container = styled.div`
display: flex;
justify-content: center;
align-items: center;

table {
    border-collapse: collapse;
    tr{
        border: 1px solid black;
    }
    td, th {
        padding: .8rem;
    }
}

`

const ShowPackages = ({ clusterID }) => {
    const [packages, setPackages] = useState([]);
    useEffect(() => {
        const fetchPackages = async () => {
            const res = await serverAxios.get(`/packages/${clusterID}`);
            setPackages(res.data);
        }
        fetchPackages();
    }, [clusterID]);

    return (
        <Container>
            <table>
                <tbody>
                <tr>
                    <th>Voucher</th>
                    <th>Post Code</th>
                    <th>Cluster Name</th>
                    <th>Driver Name</th>
                    <th>Scanned At</th>
                </tr>

                    {packages.map((p) =>
                        <tr key={p.id}>
                            <td>{p.voucher}</td>
                            <td>{p.postcode}</td>
                            <td>{p.cluster_name}</td>
                            <td>{p.driver_name}</td>
                            <td>{p.scanned_at ? p.scanned_at : "Not scanned yet"}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </Container>
    )
}

export default ShowPackages