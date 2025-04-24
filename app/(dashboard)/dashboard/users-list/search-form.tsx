import { useState, FormEvent } from 'react';

// 添加类型定义
interface SearchFormProps {
  onSearch: (searchTerm: string) => void;
}

function SearchForm({ onSearch }: SearchFormProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // 添加事件参数类型
  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="搜索用户"
          className="border rounded p-2 pl-10"
        />
        <span className="absolute left-2 top-1/2 transform -translate-y-1/2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 4a7 7 0 100 14 7 7 0 000-14zm0 0l6 6m-6-6l-6 6"
            />
          </svg>
        </span>
      </div>
      <button type="submit" className="ml-2 bg-blue-500 text-white rounded px-4 py-2">搜索</button>
    </form>
  );
}

export default SearchForm;