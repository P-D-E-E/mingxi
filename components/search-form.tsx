import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchFormProps {
  onSearch: (value: string) => void;
}

export default function SearchForm({ onSearch }: SearchFormProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    onSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form className="relative" onSubmit={handleSubmit}>
      <label htmlFor="action-search" className="sr-only">搜索</label>
      <input
        id="action-search"
        className="form-input pl-9 bg-white dark:bg-slate-800"
        type="search"
        placeholder="请输入搜索关键词..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />  
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
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
              d="M11 2a9 9 0 100 18 9 9 0 000-18zm0 0l6 6m-6-6l-6 6"
            />
          </svg>
        </span>
    </form>
  );
}
