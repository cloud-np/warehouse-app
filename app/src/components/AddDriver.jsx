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

const AddDriver = ({ clusterID, reFetchDrivers }) => {
    // package is reserved word in strict mode.
    const [driver, setDriver] = useState({});

    const handleSubmit = async (e) => {
        // To prevent page refresh.
        e.preventDefault();
        const res = await serverAxios.post('/drivers', {...driver, cluster_id: clusterID}).catch((err) => {
            if (err.response.status === 400) {
                alert(err.response.data.message);
            }
        });

        if (res?.status === 200){
            if (alert('Driver added successfully.')){}
            else window.location.reload();
        } 
    }

    const handleOnChange = (e) => {
        setDriver({ ...driver, [e.target.name]: e.target.value })
    }

    return (
        <Form onSubmit={handleSubmit}>
            <h2>Add Driver to Cluster</h2>
            <input onChange={handleOnChange} placeholder='Driver Name' name='dname' id='dname' />
            <button>Submit</button>
        </Form>
    )
}

export default AddDriver