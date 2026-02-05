import styled from "styled-components";
import { useSearchParams } from "react-router";

import { useCabins } from "./useCabins";

import CabinRow from "./CabinRow";
import Spinner from "../../ui/Spinner";
import Empty from "../../ui/Empty";
import Table from "../../ui/Table";
import MenusController from "../../ui/MenusController";
import {
  camelCase,
  filterByKeyExistence,
  sortByColumn,
} from "../../utils/helpers";

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

export default function CabinTable() {
  const [searchParams] = useSearchParams();
  const { isLoading, error, cabins } = useCabins();

  if (isLoading) return <Spinner />;

  if(!cabins.length) return <Empty resourceName="cabins" />

  const filteredCabins = filterByKeyExistence(
    cabins,
    "discount",
    searchParams.get("discount"),
    ["with-discount", "no-discount"]
  );

  const [colName, order] = searchParams.get("sort_by")
    ? camelCase(searchParams.get("sort_by")).split(".")
    : ["name", "asc"];

  const sortedCabins = sortByColumn(filteredCabins, colName, order);

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
          data={sortedCabins}
          render={(cabin) => <CabinRow key={cabin.id} cabin={cabin} />}
        />
      </Table>
    </MenusController>
  );
}
