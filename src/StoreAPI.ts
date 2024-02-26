import md5 from "md5-ts";

const url = "http://api.valantis.store:40000/";
const key = md5("Valantis_20240226");
const headers = { "X-Auth": key, 'Content-Type': 'application/json' };
const retryOptions = {
  retryCatchIf: (response: Response) => response.status !== 200,
  retryIf: (response: Response) => response.status === 200,
  retries: 4
}

export type filterParams = {
  product?: string,
  brand?: string,
  price?: number,
}

interface retryPromiseOptions<T> {
  retryCatchIf?: (response: T) => boolean,
  retryIf?: (response: T) => boolean,
  retries?: number
}

function retryPromise<T>(promise: () => Promise<T>, options: retryPromiseOptions<T>) {
  const { retryIf = (_: T) => false, retryCatchIf = (_: T) => true, retries = 1 } = options
  let _promise = promise();

  for (var i = 1; i < retries; i++)
    _promise = _promise.catch((value) => retryCatchIf(value) ? promise() : Promise.reject(value))
      .then((value) => retryIf(value) ? promise() : Promise.reject(value));

  return _promise;
}

class StoreAPI {
  async getIdsAll() {
    const body = JSON.stringify({
      "action": "get_ids",
    })

    return await this.retryFetch(url, { method: "POST", headers, body });
  }

  async getIdsByFilter(params: filterParams) {
    const body = JSON.stringify({
      "action": "filter",
      params
    })

    return await this.retryFetch(url, { method: "POST", headers, body });
  }

  async getItems(ids: string[]) {
    const body = JSON.stringify({
      "action": "get_items",
      "params": { ids }
    })

    return await this.retryFetch(url, { method: "POST", headers, body });
  }

  async retryFetch(url: string, options: RequestInit) {
    return await retryPromise(() => fetch(url, options), retryOptions).then(response => response.json()).catch(console.log)
  }
}

export default new StoreAPI();