import React, { useState } from 'react'
import styled from 'styled-components'
import { serverAxios } from '../api/axiosInstance';

const Form = styled.form`

padding: 2rem;
flex-direction: column;
align-items: center;
display: flex;
input {
    margin: .5rem;
    padding: .7rem;
    border: none;
    border-radius: 5px;
}
button {
    margin: .3rem;
    background-color: #1b1b1b;
}
`

const AddCluster = ({ reFetchClusters }) => {
    // package is reserved word in strict mode.
    const [cluster, setCluster] = useState({});

    const handleSubmit = async (e) => {
        // To prevent page refresh.
        e.preventDefault();
        const res = await serverAxios.post('/clusters', cluster).catch((err) => {
            if (err.response.status === 400) {
                alert(err.response.data.message);
            }
        });

        if (res?.status === 200){
            alert('Cluster added successfully!');
            reFetchClusters();
        } 
    }

    const handleOnChange = (e) => {
        setCluster({ ...cluster, [e.target.name]: e.target.value })
    }

    return (
        <Form onSubmit={handleSubmit}>
            <h2>Add a Cluster to warehouse</h2>
            <input onChange={handleOnChange} placeholder='Cluster Name' name='cname' id='cname' />
            <input onChange={handleOnChange} placeholder='Cluster Code' name='ccode' id='ccode' />
            <button>Submit</button>
        </Form>
    )
}

export default AddCluster