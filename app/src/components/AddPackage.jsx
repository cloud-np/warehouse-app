import React, { useState } from 'react'
import styled from 'styled-components'
import { serverAxios } from '../api/axiosInstance';

const Form = styled.form`

/* background-color: #31313190; */
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

const AddPackage = () => {
    // package is reserved word in strict mode.
    const [myPackage, setMyPackage] = useState({});

    const handleSubmit = async (e) => {
        // To prevent page refresh.
        e.preventDefault();
        const res = await serverAxios.post('/packages', myPackage).catch((err) => {
            if (err.response.status === 400) {
                alert(err.response.data.message);
            }
        });

        if (res.status === 200) alert('Package added successfully! If it is not showing up, it means it does not belong to a cluster.');
    }

    const handleOnChange = (e) => {
        // console.log(e.target.value);
        setMyPackage({ ...myPackage, [e.target.name]: e.target.value })
    }

    return (
        <Form onSubmit={handleSubmit}>
            <h2>Add Package to warehouse</h2>
            <input onChange={handleOnChange} placeholder='Voucher' name='voucher' id='voucher' />
            <input onChange={handleOnChange} placeholder='Postcode' name='postcode' id='postcode' />
            <button>Submit</button>
        </Form>
    )
}

export default AddPackage