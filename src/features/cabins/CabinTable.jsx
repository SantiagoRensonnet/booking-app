import styled from "styled-components";

import { useCabins } from "./useCabins";

import Spinner from "../../ui/Spinner";
import CabinRow from "./CabinRow";
import Table from "../../ui/Table";
import MenusController from "../../ui/MenusController";
import { useSearchParams } from "react-router";

const TableHeader = styled.header`
  display: grid;
  grid-template-columns: 0.6fr 1.8fr 2.2fr 1fr 1fr 1fr;
  column-gap: 2.4rem;
  align-items: center;

  background-color: var(--color-grey-50);
  border-bottom: 1px solid var(--color-grey-100);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  font-weight: 600;
  color: var(--color-grey-600);
  padding: 1.6rem 2.4rem;
`;

/**
 * 
 * Returns an array of objects that have a certain not null field     -- filter value is truthy
 * 
 * Returns an array of objects that lack a certain field (or is null) -- filter value is falsy
 * 
 * ### Notes
 * If the filter value is null -> the original array will be returned
 * 
 * If the filter value is not valid, not in `booleans` -> an empty array will be returned
 * 
 * 
 * @param {Object[]} array
 * array to be filtered
 * 
 * @param {string} key
 * filter key
 * 
 * @param {string} value
 * filter value
 * 
 * @param {Boolean[]} booleans
 * list of valid filter values interpreted as truthy and falsy respectively
 * 
 * @returns {Object[]}
 * Filtered array.
 * 
 * 
 */
function filterByKeyExistence(array, key, value, booleans = [true, false]) {
  if (!value) return array;
  if (!booleans.find((bool) => value === bool)) return [];
  return array.filter((el) => (value === booleans[0] ? el[key] : !el[key]));
}

export default function CabinTable() {
  const [searchParams] = useSearchParams();
  const { isLoading, error, cabins } = useCabins();

  const filterKey = "discount";
  const filterValue = searchParams.get(filterKey);

  const filteredCabins = filterByKeyExistence(cabins, filterKey, filterValue, [
    "with-discount",
    "no-discount",
  ]);

  if (isLoading) return <Spinner />;
  return (
    <MenusController>
      <Table columns="0.6fr 1.8fr 2.2fr 1fr 1fr 1fr" role="table">
        <Table.Header>
          <div></div>
          <div>Cabin</div>
          <div>Capacity</div>
          <div>Price</div>
          <div>Discount</div>
          <div></div>
        </Table.Header>
        <Table.Body
          data={filteredCabins}
          render={(cabin) => <CabinRow key={cabin.id} cabin={cabin} />}
        />
      </Table>
    </MenusController>
  );
}
