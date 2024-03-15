import React from 'react'
import { Link } from 'react-router-dom'
import { CiUser } from 'react-icons/ci'

export default function FoodCard({ product }) {
    return (
            <div className="flex flex-col bg-white border border-gray-200 rounded-lg shadow cursor-pointer hover:bg-gray-200">
                <img className='h-auto max-w-full' 
                src="http://metropolitanhost.com/themes/themeforest/react/costic/static/media/food-1.dfe0042d.jpg" 
                alt=""  />
                <div className="p-5 text-left text-black">
                    <h5 className="text-xl">
                        Lẩu thái
                    </h5>
                    <p className='mt-4 text-xl'>200.000 VNĐ</p>
                </div>
            </div>
    )
}
