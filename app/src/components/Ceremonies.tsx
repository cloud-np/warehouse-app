import { MagnifyingGlassIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { PencilIcon, UserPlusIcon, DocumentMagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { Card, CardHeader, Input, Typography, Button, CardBody, Chip, CardFooter, Tabs, TabsHeader, Tab, Avatar, IconButton, Tooltip } from "@material-tailwind/react";
import React, { useState } from 'react';
import { serverAxios } from '../api/axiosInstance';
import { Ceremony, useCeremonyStore } from '../state/ceremonyStore';


const Ceremonies = () => {
    const [ceremony, setCeremony] = useState(null);
    // const [people, setPeople] = useState([]);
    const { ceremonies } = useCeremonyStore();

    const handleClickedCeremony = async (clickedCeremony: Ceremony) => {
        if (clickedCeremony.id === ceremony.id) {
            setCeremony(null);
        } else {
            setCeremony(clickedCeremony);
            const res: any = await serverAxios.get(`/people/${clickedCeremony.id}`).catch(err => alert(err));
            console.log(res.data);
            setPeople(res.data)
        }
    }

    return (
        <div className="flex flex-col w-full">
        </div>
    )
}

export default Ceremonies


