// export async function test() {
//   return fetch("/api/rem-cosmos", {
//     method: "POST",
//     body: "select value r from r where r.type = 'PropertyIndex' ",
//   }).then((e) => e.json());
// }

export interface Cluster {
  id?: string;
  code: any;
  name: string;
  finantialStatementId: string;
  strategyId: number;
  riskFreeRate: number;
  ervIndexMethodId: string;
  vpvIndexMethodId: string;
  famIndexMethodId: string;
  landValueIndexMethodId: string;
  targetRentIndexMethodId: string;
  renewalRentIndexMethodId: string;
}

export function queryClusters() {
  return query(
    `
    select value r.data from r 
    where r.type = 'PropertyIndex' 
    `
  );
}
export function queryCluster(
  id: string,
  processId: string
): Promise<Cluster[]> {
  return query(
    `
    select value r.data from r 
    where r.type = 'Cluster' 
    ${id !== null ? `and r.data.id = ${escape(id)}` : ""}
    and r.pk = ${escape(processId)}
    `
  );
}

function query(text: string) {
  return fetch("/db", {
    method: "POST",
    body: text,
  }).then((e) => e.json());
}

function escape(value: string) {
  return value === null || value === undefined ? "null" : `'${value}'`;
}
