import { useEffect, useState } from 'react';
import './App.css'
import StoreAPI, { filterParams } from './StoreAPI.ts';
import { useDispatch, useSelector } from 'react-redux';
import { setIds, setProducts } from './store/reducers/ProductsSlice.ts';
import Gallery from './components/Gallery';
import { RootState } from './store';

type ChangeInputEvent = React.ChangeEvent<HTMLInputElement>;

function App() {
  const [brandFilterValue, setBrandFilterValue] = useState("");
  const [productNameFilterValue, setProductNameFilterValue] = useState("");
  const [priceFilterValue, setPriceFilterValue] = useState("");
  const [page, setPage] = useState(0);
  const [data, setData] = useState([]) as any[];
  const dispatch = useDispatch();
  const { ids, products } = useSelector((state: RootState) => state.products);
  const countPerPage = 50;

  const updateData = (page: number) => {
    setData(ids.slice(page * countPerPage, (page + 1) * countPerPage).map((id: string) => products[id]))
  }

  const handleSetFilters = () => {
    const params = {} as filterParams;

    if (productNameFilterValue) params.product = productNameFilterValue
    if (brandFilterValue) params.brand = brandFilterValue
    if (Number(priceFilterValue)) params.price = Number(priceFilterValue)

    if (params.product || params.brand || params.price) {
      StoreAPI.getIdsByFilter(params).then(data => {
        const filtered = [...(new Set(data.result))];
        dispatch(setIds(filtered));
      })
    } else {
      StoreAPI.getIdsAll().then(data => {
        const filtered = [...(new Set(data.result))];
        dispatch(setIds(filtered));
      })
    }
  }

  const handleChangePage = (page = 0) => {
    setPage(page);

    const filteredIds = ids.slice(page * countPerPage, (page + 1) * countPerPage).filter(id => !products[id])
    if (filteredIds?.length) {
      setData(null);
      StoreAPI.getItems(filteredIds)
        .then(data => {
          dispatch(setProducts(data.result));
        })
    } else {
      updateData(page);
    }
  }

  const handleChangePrice = (event: ChangeInputEvent) => {
    Number.isNaN(+event.target.value) ? null : setPriceFilterValue(event.target.value)
  }

  useEffect(() => {
    StoreAPI.getIdsAll().then(data => {
      const filtered = [...(new Set(data.result))];
      dispatch(setIds(filtered));
    })
  }, [])

  useEffect(() => handleChangePage(page), [ids])

  useEffect(() => updateData(page), [products])

  return (
    <div className="flex">
      <aside className="filterForm column">
        <input value={productNameFilterValue} placeholder={"input name"} onInput={(e: ChangeInputEvent) => setProductNameFilterValue(e.target.value)} />
        <input value={brandFilterValue} placeholder={"input brand"} onInput={(e: ChangeInputEvent) => setBrandFilterValue(e.target.value)} />
        <input value={priceFilterValue} placeholder={"input price"} onInput={handleChangePrice} />
        <button onClick={() => handleSetFilters()}>Применить</button>
      </aside>
      <main>
        <Gallery
          data={data}
          countPerPage={countPerPage}
          totalCount={ids.length}
          onChangePage={handleChangePage}
        />
      </main>
    </div>
  )
}

export default App
