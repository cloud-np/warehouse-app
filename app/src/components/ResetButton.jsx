import React from 'react'
import axios from 'axios';
import styled from 'styled-components';

const Button = styled.button`
font-size: .8rem;
`



const ResetButton = () => {
    const handleClick = async () => {
        const res = await axios.get('http://localhost:3000/reset-db');
        if(alert(res.data.message)){}
        else window.location.reload();
    }

    return (
        <Button onClick={handleClick}>Reset Button</Button>
    )
}

export default ResetButton