export default function stitching(query: { [key: string]: any }): string {
  let page: number;
  let pageSize: number;
  let sqlQuery: string[] = [];
  if (query.page) {
    page = query.page;
    delete query.page;
  } else {
    page = 1;
  }
  if (query.pageSize) {
    pageSize = query.pageSize;
    pageSize > 500 && (pageSize = 500);
    delete query.pageSize;
  } else {
    pageSize = 20;
  }
  Object.keys(query).forEach(t => {
    sqlQuery.push(t + " = " + query[t]);
  });
  if (sqlQuery.length > 0) {
    return (
      "WHERE " +
      sqlQuery.join(" AND ") +
      " limit = " +
      pageSize +
      " offset " +
      (pageSize - 1) * page
    );
  } else {
    return " limit = " + pageSize + " offset " + (pageSize - 1) * page;
  }
}
