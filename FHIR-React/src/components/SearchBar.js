import React, { useCallback, useMemo, useState } from 'react';
import '../stylesheets/SearchBar.css';
import { InputGroup, Input, Button, Form } from 'reactstrap';

const updateInputValues = (i, inputValues, value) => {
  if (!inputValues) return [];

  const newInputValues = [...inputValues];
  newInputValues[i] = value;

  return newInputValues;
};

const updateSelectedOptions = (i, selectedOptions, value) => {
  if (!selectedOptions) return [];

  const newSelectedOptions = [...selectedOptions];
  newSelectedOptions[i] = value;

  return newSelectedOptions;
};

const removeParam = (i, selectedOptions, inputValues) => {
  selectedOptions.splice(i, 1);
  inputValues.splice(i, 1);

  return { selectedOptions, inputValues };
};

export default function SearchBar({ placeholder, onSubmit, options }) {
  const [inputValues, setInputValues] = useState(['']);
  const [selectedOptions, setSelectedOptions] = useState(['name']);
  const [noOfAdditionalParams, setNoOfAdditionalParams] = useState(0);

  const SearchParamElement = useCallback(
    ({ paramNo, selectedOptions, inputValues }) => (
      <>
        <label className="search-selector-label">Parameter: </label>
        <Input
          className="search-selector"
          type="select"
          value={selectedOptions[paramNo]}
          onChange={(e) =>
            setSelectedOptions(updateSelectedOptions(paramNo, selectedOptions, e.target.value))
          }
        >
          {options.map((op) => (
            <option value={op} selected={op === selectedOptions[paramNo]}>
              {op}
            </option>
          ))}
        </Input>
        <Input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={inputValues[paramNo]}
          onChange={(e) => setInputValues(updateInputValues(paramNo, inputValues, e.target.value))}
        />
      </>
    ),
    [options, placeholder]
  );

  const addParamButton = useMemo(
    () => (
      <Button
        className="add-param-button"
        onClick={() => {
          setInputValues([...inputValues, '']);
          setSelectedOptions([...selectedOptions, 'name']);
          setNoOfAdditionalParams(noOfAdditionalParams + 1);
        }}
      >
        +
      </Button>
    ),
    [inputValues, noOfAdditionalParams, selectedOptions]
  );

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(selectedOptions, inputValues);
      }}
    >
      <InputGroup className="search-bar-group">
        <div className="search-selector-container">
          <div className="search-first-param-group">
            <SearchParamElement
              paramNo={0}
              selectedOptions={selectedOptions}
              inputValues={inputValues}
            />
            {addParamButton}
          </div>
          {[...Array(noOfAdditionalParams).keys()].map((i) => (
            <div className="search-param-group">
              <SearchParamElement
                paramNo={i + 1}
                selectedOptions={selectedOptions}
                inputValues={inputValues}
              />
              {addParamButton}
              <div class="remove-param-container">
                <Button
                  className="remove-param-button"
                  onClick={() => {
                    setNoOfAdditionalParams(
                      noOfAdditionalParams === 0 ? noOfAdditionalParams : noOfAdditionalParams - 1
                    );
                    const newParams = removeParam(i + 1, selectedOptions, inputValues);
                    setInputValues(newParams.inputValues);
                    setSelectedOptions(newParams.selectedOptions);
                    // setInputValues(inputValues.slice(0, inputValues.length - 1));
                    // setSelectedOptions(selectedOptions.slice(0, inputValues.length - 1));
                  }}
                >
                  -
                </Button>
              </div>
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
