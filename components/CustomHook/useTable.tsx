import {  useState } from 'react'

interface HeadCell {
  id: string
  label: string
}

export default function useTable(headCells: HeadCell[]) {
  interface TableProps {
    children: React.ReactNode
  }

  const TblContainer = (props) => {
    return (
      <table className="w-full whitespace-nowrap px-4">
        {props.children}
      </table>
    )
  }

  const TblHead = (props: any) => {
    return (
      <thead className="bg-white border-gray-300 border-b">
        <tr className="h-16 w-full text-sm leading-none text-gray-800">
          { headCells.map((headCell) => (
            <th className="font-semibold text-left" key={headCell.id}>{headCell.label}</th>
          ))}
        </tr>
      </thead>
    )
  }

  return {
    TblContainer,
    TblHead
  }
}
