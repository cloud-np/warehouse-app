import { DocumentMagnifyingGlassIcon, PencilIcon } from '@heroicons/react/24/outline';
import { Chip, IconButton, Popover, PopoverContent, PopoverHandler, Tooltip, Typography } from '@material-tailwind/react';
import React, { useEffect } from 'react';
import { useCeremonyStore } from '../../state/ceremonyStore';
import { Ceremony } from '../../state/ceremonyStore';
import { PRIORITY_COLORS } from '../../constants/priority.colors';
import { parseDate } from '../../util';

interface Props {
    pageNumber: number;
    searchQuery: string;
    selectedTab: string;
    selectedColumn: string;
    filterUp: boolean;
};

const CeremonyRows: React.RC<Props> = (
    { pageNumber, searchQuery = '', selectedTab, selectedColumn, filterUp }: Props) => {
    const { ceremonies, fetchCeremonies } = useCeremonyStore();

    useEffect(() => {
        if (ceremonies.length === 0) {
            fetchCeremonies();
        }
    }, [fetchCeremonies]);

    const ceremoniesFilter = (ceremony: Ceremony) => {
        searchQuery = searchQuery?.toLowerCase();
        const searchIn = (ceremony[selectedTab]?.toString() ?? '').toLowerCase();
        return searchIn.includes(searchQuery);
    };

    const sortCeremonies = (a: Ceremony, b: Ceremony) => {
        if (selectedColumn === 'cdate') {
            const aDate = parseDate(a[selectedColumn]);
            const bDate = parseDate(b[selectedColumn]);
            return aDate.getTime() - bDate.getTime();
        }

        if (a[selectedColumn] > b[selectedColumn]) {
            return 1;
        }

        if (a[selectedColumn] < b[selectedColumn]) {
            return -1;
        }
        return 0;
    };

    const transFormedCeremonies = ceremonies
        .filter(ceremoniesFilter)
        .sort(sortCeremonies)
    if (filterUp) {
        transFormedCeremonies.reverse();
    }

    return (
        <tbody>
            {transFormedCeremonies
                .slice(pageNumber * 10, pageNumber * 10 + 10)
                .map((ceremony: Ceremony, index: number) => {
                const isLast = index === ceremonies.length - 1;
                const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                return (
                    <tr key={ceremony.id}>
                        <td className={classes}>
                            <div className="flex items-center gap-3">
                                <div className="flex flex-col">
                                    <Typography variant="h6" color="blue-gray" className="font-normal">
                                        {ceremony.cdate}
                                    </Typography>
                                    <Typography variant="small" color="blue-gray" className="font-normal opacity-70">
                                        {ceremony.ctime}
                                    </Typography>
                                </div>
                            </div>
                        </td>
                        <td className={classes}>
                            <div className="flex flex-col">
                                <Typography variant="small" color="blue-gray" className="font-normal">
                                    {ceremony.people}
                                </Typography>
                            </div>
                        </td>
                        <td className={classes}>
                            <div className="w-max">
                                <Chip
                                    variant="ghost"
                                    size="sm"
                                    value={ceremony.cpriority}
                                    color={PRIORITY_COLORS[ceremony.cpriority]}
                                />
                            </div>
                        </td>
                        <td className={classes}>
                            <Tooltip content="Επεξεργασία δεξίωσης">
                                <IconButton variant="text">
                                    <PencilIcon className="h-5 w-5" />
                                </IconButton>
                            </Tooltip>
                            <Popover>
                                <PopoverHandler>
                                    <IconButton variant="text">
                                        <DocumentMagnifyingGlassIcon className="h-5 w-5 mx-3" />
                                    </IconButton>
                                </PopoverHandler>
                                <PopoverContent>
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {ceremony.details}
                                    </Typography>
                                </PopoverContent>
                            </Popover>
                        </td>
                    </tr>
                );
            },
            )}
        </tbody>
    )
}

export default CeremonyRows;
