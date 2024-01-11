import React, { useState } from 'react';
import { serverAxios } from '../../api/axiosInstance';
import { AxiosError } from 'axios';
import { useCeremonyStore } from '../../state/ceremonyStore';
import { Button, Input, Popover, PopoverContent, PopoverHandler, Textarea } from '@material-tailwind/react';
import DayPick from '../ui/DayPick';


const AddCeremony = () => {
    // package is reserved word in strict mode.
    const [ceremony, setCeremony] = useState({});
    const [errors, setErrors] = useState({});
    const { addCeremony } = useCeremonyStore();
    const [date, setDate] = useState<Date>();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        // To prevent page refresh.
        e.preventDefault();
        const res: any = await serverAxios.post('/ceremonies', ceremony).catch((err: AxiosError) => {
            console.log(err.response.data);
            setErrors(err.response.data);
        });

        if (res?.status === 200){
            alert('Προστέθηκε η Δεξίωση!');
            addCeremony(res.data);
        }
    }

    const handleOnChange = (e: React.FormEvent<HTMLInputElement>) => {
        setCeremony({ ...ceremony, [e.target.name]: e.target.value })
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2 className='p-4'>Πρόσθεσε μία δεξίωση</h2>
            <div className='p-4 flex justify-around'>
                <div className=''>
                    <DayPick setDateParent={setDate} />
                </div>
                <div className='ml-3'>
                    <Input error={false} type='time' required onChange={handleOnChange} label='Ώρα' name='ctime' id='ctime' />
                </div>
            </div>
            {[
                { name: 'people', label: 'Άτομα', type: 'number' },
                { name: 'cpriority', label: 'Σημαντικότητα', type: 'number' },
            ].map((input) => (
                <div className='p-4' key={input.name}>
                    <Input error={false} type={input.type} required onChange={handleOnChange} label={input.label} name={input.name} id={input.name} />
                </div>
            ))}
            <div className='p-4'>
                <Textarea
                    resize={true}
                    onChange={handleOnChange}
                    label='Σχόλεια'
                    name='details'
                    id='details'
                />
            </div>

            <button disabled={Object.keys(errors).length > 0} className='m-4 px-4 py-2 btn hover:bg-gray-700 text-white bg-black text-sm uppercase float-right rounded'>Submit</button>
        </form>
    )
}

export default AddCeremony
