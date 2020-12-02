import styled from "styled-components";
import { Button } from "../Utils";
import { memo } from 'react';

const FilterButton = styled(Button)`
  font-size: 1em;
  margin: 8px 10px;
  padding: 1px 1px 1px 5px;
`;

const Filter = styled(({ className, setFilter }) => {
  console.log('rerender Fitler');
  return (
    <div className={className}>
      <FilterButton onClick={() => setFilter("done")} value="✔" />
      <FilterButton
        style={{ fontSize: "1.5em" }}
        onClick={() => setFilter("undone")}
        value="⨯"
      />
      <FilterButton onClick={() => setFilter(null)} value="All" />
    </div>
  );
})`
  position: absolute;
  background-color: white;
  left: -70px;
  top: 50px;
  background-color: #fefefe;
  box-shadow: 3px 3px 10px #cccccc;
  border-radius: 7px;
  margin: 2px 0px;
`;

const MemorizedFilter = memo(Filter);

export default MemorizedFilter