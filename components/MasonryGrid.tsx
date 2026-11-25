import type { ReactNode } from "react";

export const SIDE_RATIO = "1/1";
export const MIDDLE_RATIO = "5/6";

type MasonryGridProps<T> = {
  items: readonly T[];
  renderItem: (item: T, index: number, ratio: string) => ReactNode;
  desktopColumns: number;
  tabletColumns: number;
  mobileColumns: number;
};

function buildColumns<T>(
  items: readonly T[],
  columnCount: number,
  ratioForColumn: (columnIndex: number) => string,
  renderItem: MasonryGridProps<T>["renderItem"],
) {
  const columns: ReactNode[][] = Array.from(
    { length: columnCount },
    () => [],
  );

  items.forEach((item, index) => {
    const columnIndex = index % columnCount;
    columns[columnIndex].push(
      renderItem(item, index, ratioForColumn(columnIndex)),
    );
  });

  return columns;
}

function renderColumns(columns: ReactNode[][], view: string) {
  return (
    <div
      className={`masonry-view masonry-view-${view}`}
      aria-hidden="true"
      inert
    >
      {columns.map((column, columnIndex) => (
        <div className="masonry-column" key={`${view}-${columnIndex}`}>
          {column}
        </div>
      ))}
    </div>
  );
}

export function MasonryGrid<T>({
  items,
  renderItem,
  desktopColumns,
  tabletColumns,
  mobileColumns,
}: MasonryGridProps<T>) {
  const ratioForColumn = (columnIndex: number) =>
    columnIndex === 1 ? MIDDLE_RATIO : SIDE_RATIO;

  const desktop = buildColumns(
    items,
    desktopColumns,
    ratioForColumn,
    renderItem,
  );
  const tablet = buildColumns(
    items,
    tabletColumns,
    ratioForColumn,
    renderItem,
  );
  const mobile = buildColumns(
    items,
    mobileColumns,
    () => SIDE_RATIO,
    renderItem,
  );

  return (
    <>
      {renderColumns(desktop, "desktop")}
      {renderColumns(tablet, "tablet")}
      {renderColumns(mobile, "mobile")}
      <ol className="masonry-accessible-list">
        {items.map((item, index) => (
          <li key={`accessible-${index}`}>
            {renderItem(
              item,
              index,
              SIDE_RATIO,
            )}
          </li>
        ))}
      </ol>
    </>
  );
}
