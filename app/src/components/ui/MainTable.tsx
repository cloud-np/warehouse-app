import React, { Children, isValidElement, useState } from 'react';
import { MagnifyingGlassIcon, ChevronUpDownIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Card, CardHeader, Input, Typography, Button, CardBody, CardFooter, Tabs, TabsHeader, Tab } from "@material-tailwind/react";
import { TableConfig, TableType } from '../../models/table.config';
import AddCeremony from '../ceremony/AddCeremony';


const MainTable: React.FC<TableConfig> = ({ title, subTitle, tabs, columns, tableType, children }: TableConfig) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [pageNumber, setPageNumber] = useState(0);
    const [selectedTab, setSelectedTab] = useState('all');
    const [selectedColumn, setSelectedColumn] = useState<string>(columns[0].value);
    const [filterUp, setFilterUp] = useState(true);
    const [openFormForType, setOpenFormForType] = useState(TableType.CEREMONIES);

    const handleTabChange = (newValue: string) => {
        setSelectedTab(newValue);
    };

    const handleColumnClick = (column: { label: string, value: string }) => {
        console.log(column);
        setSelectedColumn(column.value);
        setFilterUp(!filterUp);
    }

    const handlePlusClick = () => {
        switch (tableType) {
            case TableType.CEREMONIES:
                setOpenFormForType(TableType.CEREMONIES);
                break;
            case TableType.PEOPLE:
                setOpenFormForType(TableType.PEOPLE);
                break;
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    // Function to clone each child and pass additional props
    const renderChildrenWithProps = () => {
        return Children.map(children, (child: unknown) => {
            // Only clone the element if it's a valid element
            if (isValidElement(child)) {
                return React.cloneElement(child, { searchQuery, pageNumber, selectedTab, selectedColumn, filterUp });
            }
            return child;
        });
    };

    return (
        <Card className="h-full m-4">
            <CardHeader floated={false} shadow={false} className="rounded-none">
                <div className="mb-8 flex items-center justify-between gap-8">
                    <div>
                        <Typography variant="h5" color="blue-gray">
                            {title}
                        </Typography>
                        <Typography color="gray" className="mt-1 ml-2 font-normal">
                            {subTitle}
                        </Typography>
                    </div>
                    <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                        <Button variant="outlined" size="sm">
                            view all
                        </Button>
                        <Button className="flex items-center gap-3" size="sm" onClick={handlePlusClick} >
                            <PlusIcon strokeWidth={2} className="h-4 w-4" /> Προσθηκη
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <Tabs value={selectedTab} className="w-full md:w-max">
                        <TabsHeader>
                            {tabs.map((tab: { label: string, value: string }) => (
                                <Tab onClick={() => handleTabChange(tab.value)} key={tab.value} value={tab.value}>
                                    &nbsp;{tab.label}&nbsp;
                                </Tab>
                            ))}
                        </TabsHeader>
                    </Tabs>
                    <div className="w-full md:w-72">
                        <Input
                            label="Search"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                        />
                    </div>
                </div>
            </CardHeader>
            <CardBody className="overflow-scroll px-0">
                <table className="mt-4 w-full min-w-max table-auto text-left">
                    <thead>
                        <tr>
                            {columns.map((column: { label: string, value: string }, index: number) => (
                                <th onClick={() => handleColumnClick(column)} key={column.value} className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                                    <Typography variant="small" color="blue-gray" className="flex items-center justify-between gap-1 font-normal leading-none opacity-70">
                                        {column.label}{" "}
                                        {index !== columns.length - 1 && (
                                            <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                                        )}
                                    </Typography>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    {renderChildrenWithProps()}
                </table>
            </CardBody>
            <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                {/*
                <Typography variant="small" color="blue-gray" className="font-normal">
                    Page 1 of 10
                </Typography>
                */}
                <div className="flex gap-2">
                    <Button variant="outlined" size="sm" onClick={() => setPageNumber(pageNumber - 1)}>
                        Previous
                    </Button>
                    <Button variant="outlined" size="sm" onClick={() => setPageNumber(pageNumber + 1)}>
                        Next
                    </Button>
                </div>
            </CardFooter>
            {openFormForType === TableType.CEREMONIES && (<AddCeremony />)}
            {openFormForType === TableType.PEOPLE && true}
        </Card>
    )
}

export default MainTable;
