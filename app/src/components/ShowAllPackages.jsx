import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { serverAxios } from '../api/axiosInstance'
import AddPackage from './AddPackage'
import ShowDrivers from './ShowDrivers'

const Container = styled.div`
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;

table {
    border-collapse: collapse;
    margin: .8rem;
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
        /* background-color: #1b1b1b; */
        color: #00c83c;
    }
    .notScanned {
        color: #c80000;
    }
}
    .pagination{
        display: flex;
        justify-content: space-between;
        width: 90%;
    }

`

const ShowAllPackages = () => {
    const [packages, setPackages] = useState([]);
    const [pageNum, setPageNum] = useState(0);
    const [drivers, setDrivers] = useState([]);

    const fetchPackages = async () => {
        const res = await serverAxios.get(`/packages/${pageNum}`);
        setPackages(res.data);
    }

    useEffect(() => {
        fetchPackages();
    }, [pageNum]);

    const fetchDrivers = async () => {
        const res = await serverAxios.get(`/drivers`).catch(err => alert(err));
        setDrivers(res.data);
    }

    useEffect(() => {
        fetchDrivers();
    }, [])

    const simulateDriverPickUp = async (package_id) => {
        const res = await serverAxios.put(`/packages/package-picked-by-driver`, { package_id }).catch((err) => {
            if (err.response.status === 400) {
                alert(err.response.data.message);
            }
        });
        if (res?.status === 200) {
            if(alert('Simulated driver pick up successfully!')){}
            else window.location.reload();
        }
    }
    const previousPage = () => {
        if (pageNum < 0) setPageNum(0)
        else             setPageNum(pageNum - 1)
    }

    return (
        <Container>

            <ShowDrivers drivers={drivers} />
            <table>
                <thead>
                    <tr>
                        <th>Voucher</th>
                        <th>Post Code</th>
                        <th>Cluster Name</th>
                        <th>Driver Name</th>
                        <th>Scanned At</th>
                        <th>Select driver</th>
                    </tr>
                </thead>
                <tbody>
                    {packages.map((p) => {

                        return (
                            <tr key={p.id}>
                                <td>{p.voucher}</td>
                                <td>{p.postcode}</td>
                                <td>{p.cluster_name}</td>
                                <td>{p.driver_name}</td>

                                <td className={p.scanned_at ? "scanned" : "notScanned"}>{p.scanned_at ? new Date(p.scanned_at).toLocaleString() : "Not scanned yet"}</td>
                                <td>
                                    <button onClick={() => simulateDriverPickUp(p.id)}>Simulate driver pick up</button>
                                </td>
                            </tr>
                        )
                    }
                    )}
                </tbody>
            </table>
            <div className='pagination'>
                <button onClick={previousPage}>Previous page</button>
                <button onClick={() => setPageNum(pageNum + 1)}>Next page</button>
            </div>
            <AddPackage reFetchDrivers={fetchDrivers} reFetchPackages={fetchPackages} />
        </Container>
    )
}

export default ShowAllPackages