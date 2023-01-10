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
    
    select {
        padding: .6em 1.2rem;
        margin: .5rem;
        border-radius: 5px;
        border: none;
    }
    .scanned {
        color: #00c83c;
    }
    .notScanned {
        color: #c80000;
    }
}

`

const ShowPackages = ({ clusterID }) => {
    const [packages, setPackages] = useState([]);
    const [clusterDrivers, setClusterDrivers] = useState([]);
    const [deliveryInfo, setDeliveryInfo] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const resPackages = await serverAxios.get(`/packages/by-cluster/${clusterID}`);
            setPackages(resPackages.data);
            const resDrivers = await serverAxios.get(`/drivers/${clusterID}`);
            setClusterDrivers(resDrivers.data);
        }
        fetchData();
    }, [clusterID]);

    const simulateDriverPickUp = async () => {
        if (deliveryInfo.driver_id === '') {
            return alert('Please select a driver');
        }
        deliveryInfo.driver_id = parseInt(deliveryInfo.driver_id);
        const res = await serverAxios.put(`/packages/package-picked-by-driver`, { ...deliveryInfo }).catch((err) => {
            if (err.response.status === 400) {
                alert(err.response.data.message);
            }
        });
        if (res?.status === 200) {
            if(alert('Simulated driver pick up successfully!')){}
            else window.location.reload();
        }
    }

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
                        <th>Select driver</th>
                    </tr>
                    {packages.map((p) =>
                        <tr key={p.id}>
                            <td>{p.voucher}</td>
                            <td>{p.postcode}</td>
                            <td>{p.cluster_name}</td>
                            <td>{p.driver_name}</td>

                            <td className={p.scanned_at ? "scanned" : "notScanned"}>{p.scanned_at ? new Date(p.scanned_at).toLocaleString() : "Not scanned yet"}</td>
                            <td>
                                <select onChange={(e) => setDeliveryInfo({driver_id: e.target.value, package_id: p.id})}>
                                    <option default value={''}>Select Driver</option>
                                    {clusterDrivers.map((d, index) => <option key={index} value={d.id}>{d.dname}</option>)}
                                </select>
                                <button onClick={simulateDriverPickUp}> Simulate driver pick up</button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </Container>
    )
}

export default ShowPackages