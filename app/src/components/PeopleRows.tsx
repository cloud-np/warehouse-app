import { DocumentMagnifyingGlassIcon, PencilIcon } from '@heroicons/react/24/outline';
import { Chip, IconButton, Tooltip, Typography } from '@material-tailwind/react';
import React from 'react';
import { Person } from '../../state/personStore';
import { PRIORITY_COLORS } from '../../constants/priority.colors';

interface Props {
    people: Person[];
};

// id: number;
// fname: string;
// lname: string;
// email: string;
// phone_number: string;
// proffesion: string;
// ppriority: number;
// ceremony_id: number;

const PeopleRows: React.RC<Props> = ({ people }: Props) => {
    return (
        <tbody>
            {people.map(
                (person: Person, index: number) => {
                    const isLast = index === people.length - 1;
                    const classes = isLast
                        ? "p-4"
                        : "p-4 border-b border-blue-gray-50";

                    const fullName = person.fname + " " + person.lname;
                    return (
                        <tr key={person.email}>
                            <td className={classes}>
                                <div className="flex items-center gap-3">
                                    <div className="flex flex-col">
                                        <Typography variant="small" color="blue-gray" className="font-normal">
                                            {fullName}
                                        </Typography>
                                        <Typography variant="small" color="blue-gray" className="font-normal opacity-70">
                                            {person.email}
                                        </Typography>
                                    </div>
                                </div>
                            </td>
                            <td className={classes}>
                                <Typography variant="small" color="blue-gray" className="font-normal">
                                    {person.phone_number}
                                </Typography>
                            </td>
                            <td className={classes}>
                                <div className="flex flex-col">
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {person.proffesion}
                                    </Typography>
                                    {/*
                                        <Typography variant="small" color="blue-gray" className="font-normal opacity-70">
                                            {org}
                                        </Typography>
                                    */}
                                </div>
                            </td>
                            <td className={classes}>
                                <div className="w-max">
                                    <Chip
                                        variant="ghost"
                                        size="sm"
                                        value={person.ppriority}
                                        color={PRIORITY_COLORS[person.ppriority]}
                                    />
                                </div>
                            </td>
                            <td className={classes}>
                                <Typography variant="small" color="blue-gray" className="font-normal">
                                    hi
                                    {/*date*/}
                                </Typography>
                            </td>
                            <td className={classes}>
                                <Tooltip content="Επεξεργασία χρήστη">
                                    <IconButton variant="text">
                                        <PencilIcon className="h-5 w-5" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip content="Δες σχόλια">
                                    <IconButton variant="text">
                                        {/* Here handle clikc to show details */}
                                        <DocumentMagnifyingGlassIcon className="h-5 w-5 mx-3" />
                                    </IconButton>
                                </Tooltip>
                            </td>
                        </tr>
                    );
                },
            )}
        </tbody>
    )
}

export default PeopleRows;
