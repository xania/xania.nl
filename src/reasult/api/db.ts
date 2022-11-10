// export async function test() {
//   return fetch("/api/rem-cosmos", {
//     method: "POST",
//     body: "select value r from r where r.type = 'PropertyIndex' ",
//   }).then((e) => e.json());
// }

import { Fields } from "./types";

export interface Cluster {
  id: string;
  code: any;
  name: string;
  financialStatementId: string;
  strategyId: number;
  riskFreeRate: number;
  indexMethods: { [P in keyof typeof Fields]: string };
}

export function queryClusters() {
  return query(
    "rem",
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
    "rem",
    `
    select value entity from r 
    join entity in r.data
    where r.type = 'Cluster' 
    ${id !== null ? `and entity.id = ${escape(id)}` : ""}
    and r.pk = ${escape(processId)}
    `
  );
}

export function query(client: string, text: string) {
  return fetch(`/api/cosmos/${client}`, {
    method: "POST",
    body: text,
  }).then((e) => e.json());
}

function escape(value: string) {
  return value === null || value === undefined ? "null" : `'${value}'`;
}
