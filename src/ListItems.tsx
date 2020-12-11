import React from "react";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import Row from "./Row";
import InfiniteLoader from "react-window-infinite-loader";

interface Dictionary<T> {
  [Key: string]: T;
}

let items: Dictionary<number> = {};
let requestCache: Dictionary<string> = {};

const getUrl = (rows: number, start: number) =>
  `https://public.opendatasoft.com/api/records/1.0/search/?dataset=worldcitiespop&sort=population&fields=population,accentcity&rows=${rows}&start=${start}&facet=country`;

const ListItems = () => {
  const loadMoreItems = (
    visibleStartIndex: number,
    visibleStopIndex: number
  ) => {
    const key = [visibleStartIndex, visibleStopIndex].join(":"); // 0:10
    if (requestCache[key]) {
      return null;
    }

    const length = visibleStopIndex - visibleStartIndex;

    const visibleRange = [...Array(length).keys()].map(
      (x) => x + visibleStartIndex
    );
    const itemsRetrieved = visibleRange.every((index) => !!items[index]);

    if (itemsRetrieved) {
      requestCache[key] = key;
      return null;
    }

    return fetch(getUrl(length, visibleStartIndex))
      .then((response) => response.json())
      .then((data) => {
        data.records.forEach((city: any, index: number) => {
          items[index + visibleStartIndex] = city.fields;
        });
      })
      .catch((error) => console.error("Error:", error));
  };

  const isItemLoaded = (index: number) => !!items[index];

  return (
    <AutoSizer>
      {({ height, width }) => {
        return (
          <InfiniteLoader
            isItemLoaded={isItemLoaded}
            loadMoreItems={loadMoreItems}
            itemCount={1000}
          >
            {({ onItemsRendered, ref }) => (
              <List
                className="List"
                height={height}
                itemCount={1000}
                itemSize={35}
                width={width}
                itemData={items}
                ref={ref}
                onItemsRendered={onItemsRendered}
              >
                {Row}
              </List>
            )}
          </InfiniteLoader>
        );
      }}
    </AutoSizer>
  );
};

export default ListItems;
