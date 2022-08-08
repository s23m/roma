import React from 'react';
import './SearchBar.css';
import SearchIcon from '@material-ui/icons/Search';

export default function SearchBar({ placeholder }) {
  return (
    <div className="search">
      <div className="searchInput">
        <input type="text" placeholder={placeholder} />
        <div className="searchIcon">
          <SearchIcon />
        </div>
      </div>
    </div>
  );
}
