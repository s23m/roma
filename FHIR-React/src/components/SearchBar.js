import { useState } from 'react';
import '../stylesheets/SearchBar.css';
import { InputGroup, Input, Button, Form } from 'reactstrap';

export default function SearchBar({ placeholder, onSubmitHandler, options }) {
  const [inputValue, setInputValue] = useState('');
  const [selectedOption, setSelectedOption] = useState('name');

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmitHandler(selectedOption, inputValue);
      }}
    >
      <InputGroup className="search-bar-group">
        <div className="search-selector-container">
          <label className="search-selector-label">Search by: </label>
          <Input
            className="search-selector"
            type="select"
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            {options.map((op) => (
              <option value={op}>{op}</option>
            ))}
          </Input>
        </div>
        <div className="search-input-container">
          <Input
            type="text"
            className="search-input"
            placeholder={placeholder}
            onChange={(e) => setInputValue(e.target.value)}
          />

          <Button type="submit">Submit</Button>
        </div>
      </InputGroup>
    </Form>
  );
}
