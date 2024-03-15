import React from 'react'
import { Link } from 'react-router-dom'
import { CiUser } from 'react-icons/ci'

export default function DinnerTable({ name, id, max, status }) {
    return (
        <Link to={id} className="hover:no-underline">
            <div className="rounded-lg dark:bg-indigo-900 bg-white p-4 shadow-lg">
                <div className="text-indigo-500 text-xl">{name}</div>
                <div className="mt-12">
                    <div className="flex justify-between">
                    {
                            ((status) => {
                                switch (status) {
                                    case 'empty':
                                        return <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">Bàn trống</span>;
                                    case 'in-use':
                                        return <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Được sử dụng</span>;
                                    default:
                                        return null;
                                }
                            })(status)
                        }
                        
                        <div class="flex items-center bg-purple-100 text-purple-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-purple-900 dark:text-purple-300">
                            <CiUser className="mr-2" />4
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}
