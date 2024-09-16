/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
export function abortWrapper(p1: Promise<any>): Promise<any> {
  let abort;
  const p2 = new Promise((resolve, reject) => (abort = reject));
  const p = Promise.race([p1, p2]);
  // @ts-ignore
  p.abort = abort;
  return p;
}
