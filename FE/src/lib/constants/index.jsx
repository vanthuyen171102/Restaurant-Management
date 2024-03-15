import {
	HiOutlineViewGrid,
	HiOutlineCube,
	HiOutlineShoppingCart,
	HiOutlineUsers,
	HiOutlineDocumentText,
	HiOutlineAnnotation,
	HiOutlineQuestionMarkCircle,
	HiOutlineCog
} from 'react-icons/hi'

export const DASHBOARD_SIDEBAR_LINKS = [
	{
		key: 'dashboard',
		label: 'Dashboard',
		path: '/',
		icon: <HiOutlineViewGrid />
	},
	{
		key: 'san-pham',
		label: 'Sản phẩm',
		path: '/san-pham',
		icon: <HiOutlineCube />
	},
	{
		key: 'hoa-don',
		label: 'Hóa đơn',
		path: '/hoa-don',
		icon: <HiOutlineShoppingCart />
	},
	{
		key: 'ban-an',
		label: 'Bàn ăn',
		path: '/ban-an',
		icon: <HiOutlineUsers />
	},
	{
		key: 'giao-dich',
		label: 'Giao dich',
		path: '/giao-dich',
		icon: <HiOutlineDocumentText />
	},
	{
		key: 'tin-nhan',
		label: 'Tin nhắn',
		path: '/tin-nhan',
		icon: <HiOutlineAnnotation />
	}
]

