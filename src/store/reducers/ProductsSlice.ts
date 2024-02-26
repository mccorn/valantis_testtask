import { createSlice } from '@reduxjs/toolkit'
import { CardData } from '../../types'

type ProductsState = {
    ids: string[],
    products: {[key: string]: any}
}

const initialState:ProductsState = {
    ids: [],
    products: {},
}

export const ProductsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setIds: (state, action) => {
            state.ids = action.payload
        },
        setProducts: (state, action) => {
            const newProducts = {} as ProductsState["products"];
            action.payload?.forEach((element: CardData) => {
                if (!state.products[element.id]) newProducts[element.id] = element;
            });

            state.products = {...state.products, ...newProducts} 
        },
    }
})

export const { setIds, setProducts } = ProductsSlice.actions

export default ProductsSlice.reducer