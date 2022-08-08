import React, { useState } from 'react';
import '../stylesheets/SearchBar.css';
import SearchIcon from '@material-ui/icons/Search';
import { InputGroup, Input, Button, Form } from 'reactstrap';

export default function SearchBar({ placeholder, onSubmit }) {
  const [inputValue, setInputValue] = useState('');

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(inputValue);
      }}
    >
      <InputGroup>
        <Input placeholder={placeholder} onChange={(e) => setInputValue(e.target.value)} />
        <Button type="submit">Submit</Button>
      </InputGroup>
    </Form>
  );
}
