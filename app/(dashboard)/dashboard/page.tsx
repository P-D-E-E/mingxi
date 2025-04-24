import Link from 'next/link';

export default function Dashboard() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="text-center max-w-4xl w-full bg-white rounded-xl shadow-lg p-10">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">明曦后台管理系统</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
                    {/* 使用Next.js的Link组件 */}
                    <Link 
                        href="/dashboard/users-list" 
                        className="bg-blue-50 p-6 rounded-lg shadow hover:shadow-md transition-shadow block"
                    >
                        <h2 className="text-xl font-semibold text-blue-700">用户管理</h2>
                        <p className="text-gray-600 mt-2">管理系统用户信息</p>
                    </Link>
                    
                    <Link 
                        href="/dashboard/events/list" 
                        className="bg-green-50 p-6 rounded-lg shadow hover:shadow-md transition-shadow block"
                    >
                        <h2 className="text-xl font-semibold text-green-700">Event管理</h2>
                        <p className="text-gray-600 mt-2">管理更新Event内容</p>
                    </Link>
                    
                    <Link 
                        href="/dashboard/resources/list" 
                        className="bg-purple-50 p-6 rounded-lg shadow hover:shadow-md transition-shadow block"
                    >
                        <h2 className="text-xl font-semibold text-purple-700">Resource管理</h2>
                        <p className="text-gray-600 mt-2">管理已有资源和内容</p>
                    </Link>
                </div>
            </div>
            <footer className="mt-10 text-gray-500 text-sm">
                © 2025 Mingxi.com - 版权所有
            </footer>
        </div>
    )
}