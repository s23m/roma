import React, { useState } from 'react';
import '../stylesheets/SearchBar.css';
import { InputGroup, Input, Button, Form } from 'reactstrap';

export default function SearchBar({ placeholder, onSubmit: onSubmitHandler, options }) {
  const [inputValue, setInputValue] = useState('');
  const [selectedOption, setSelectedOption] = useState('name');

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmitHandler(selectedOption, inputValue);
      }}
    >
      <InputGroup>
        <Input placeholder={placeholder} onChange={(e) => setInputValue(e.target.value)} />

        <label>Search by: </label>
        <Input 
          type="select"
          value={selectedOption} 
          onChange={(e) => setSelectedOption(e.target.value)}
        >
          {options.map((op) => <option value={op}>{op}</option>)}
        </Input>

        <Button type="submit">Submit</Button>

      </InputGroup>
    </Form>
  );
}
