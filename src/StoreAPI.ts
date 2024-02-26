import md5 from "md5-ts";

const url = "hhtp://api.valantis.store:40000/";
const key = md5("Valantis_20240226");
const headers = { "X-Auth": key, 'Content-Type': 'application/json' };

export type filterParams = {
    product?: string,
    brand?: string,
    price?: string,
}

class StoreAPI {
    async getIdsAll() {
        const body = JSON.stringify({
            "action": "get_ids",
        })

        const response = await fetch(url, { method: "POST", headers, body }).catch(console.log); // withCredentials: true, 
        return await response?.json();
    }

    async getIdsByFilter(params: filterParams) {
        const body = JSON.stringify({
            "action": "filter",
            params
        })

        const response = await fetch(url, { method: "POST", headers, body }).catch(console.log);
        return await response?.json();
    }

    async getItems(ids: string[]) {
        const body = JSON.stringify({
            "action": "get_items",
            "params": { ids }
        })

        const response = await fetch(url, { method: "POST", headers, body }).catch(console.log);
        return await response?.json();
    }
}

export default new StoreAPI();