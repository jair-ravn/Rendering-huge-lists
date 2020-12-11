import React from "react";
import styled from "styled-components";

const ListItemOdd = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ListItemEven = styled(ListItemOdd)`
  background-color: #f8f8f0;
`;

interface Data {
  items: any[];
}

interface Props {
  index: number;
  style: React.CSSProperties;
  data: any[];
}

const Row = ({ index, style, data }: Props) => {
  const isItemLoaded = (idx: number) => data && idx < Object.keys(data).length;

  const Wrapper = index % 2 ? ListItemOdd : ListItemEven;

  return (
    <Wrapper style={style}>
      {isItemLoaded(index)
        ? `${data[index].accentcity}: ${data[index].population}`
        : "Loading..."}
    </Wrapper>
  );
};

export default Row;
