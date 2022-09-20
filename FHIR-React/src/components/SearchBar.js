import React, { useMemo, useState } from 'react';
import '../stylesheets/SearchBar.css';
import { InputGroup, Input, Button, Form } from 'reactstrap';

export default function SearchBar({ placeholder, onSubmit, options }) {
  const [inputValue, setInputValue] = useState('');
  const [selectedOption, setSelectedOption] = useState('name');
  const [noOfAdditionalParams, setNoOfAdditionalParams] = useState(0);

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(selectedOption, inputValue);
      }}
    >
      <InputGroup className="search-bar-group">
        <div className="search-selector-container">
          <div className="search-first-param-group">
            <label className="search-selector-label">Parameter: </label>
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
            <Input
              type="text"
              className="search-input"
              placeholder={placeholder}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Button
              className="add-param-button"
              onClick={() => setNoOfAdditionalParams(noOfAdditionalParams + 1)}
            >
              +
            </Button>
          </div>
          {[...Array(noOfAdditionalParams).keys()].map((i) => (
            <div className="search-param-group">
              <label className="search-selector-label">Parameter: </label>
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
              <Input
                type="text"
                className="search-input"
                placeholder={placeholder}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Button
                className="add-param-button"
                onClick={() => setNoOfAdditionalParams(noOfAdditionalParams + 1)}
              >
                +
              </Button>
              <Button
                className="remove-param-button"
                onClick={() =>
                  setNoOfAdditionalParams(
                    noOfAdditionalParams === 0 ? noOfAdditionalParams : noOfAdditionalParams - 1
                  )
                }
              >
                -
              </Button>
            </div>
          ))}
          <div className="search-param-group"></div>
        </div>
        <Button type="submit" className="search-submit">
          Submit
        </Button>
      </InputGroup>
    </Form>
  );
}
