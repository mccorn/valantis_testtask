import { configureStore } from '@reduxjs/toolkit'
import ProductsReducer from './reducers/ProductsSlice'

export const store = configureStore({
  reducer: {
    products: ProductsReducer
  },
})

export type RootState = ReturnType<typeof store.getState>