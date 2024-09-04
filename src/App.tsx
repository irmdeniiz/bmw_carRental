import { useEffect, useState } from "react";
import Filter from "./components/filter";
import Header from "./components/header";
import Hero from "./components/hero";
import Searchbar from "./components/searchbar";
import fetchCars from "./utils/fetchCars";
import { CarType } from "./types";
import Warning from "./components/warning";
import Card from "./components/card";
import LoadMore from "./components/loadmore";
import { useSearchParams } from "react-router-dom";

const App = () => {
  const [params, setParams] = useSearchParams();

  const [cars, setCars] = useState<CarType[] | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [limit, setLimit] = useState<number>(5);

  useEffect(() => {
    // urldeki bütün param'ları bir nesne haline getir
    const paramsObj = Object.fromEntries(params.entries());

    fetchCars({ limit, ...paramsObj })
      .then((data) => setCars(data))
      .catch((err) => setIsError(true));
  }, [limit, params]);

  return (
    <div className="min-h-screen text-white bg-[rgb(23,23,23)]">
      <Header />

      <Hero />

      <div className="mt-12 padding-x padding-y max-width">
        <div className="home__text-container">
          <h1 className="text-4xl font-extrabold">Araba Kataloğu</h1>
          <p>Beğenebileceğin arabları keşfet</p>
        </div>
        <div className="home__filters">
          <Searchbar />

          <div className="home__filter-container">
            <Filter />
            <Filter />
          </div>
        </div>

        {/*
         * Araçları Listeleme
        1) Cars null ise > Henüz API'dan cevap gelmemiştir
        2) iseError true ise > API'dan hata gelemiştir
        3) Cars boş dizi ise > Aranılan kriterlere uygun veri yok
        4) Cars dolu bir ise > API'dan araçlar gelmiştir
         */}

        {!cars ? (
          <Warning>Yükleniyor..</Warning>
        ) : isError ? (
          <Warning>Üzgünüz bir sorun oluştu</Warning>
        ) : cars.length < 1 ? (
          <Warning>Aranılan kriterlere uygun araç bulunamadı</Warning>
        ) : (
          cars.length > 1 && (
            <section>
              <div className="home__cars-wrapper">
                {cars.map((car, i) => (
                  <Card car={car} key={i} />
                ))}
              </div>

              <LoadMore
                limit={limit}
                handleClick={() => {
                  setLimit(limit + 5);
                }}
              />
            </section>
          )
        )}
      </div>
    </div>
  );
};

export default App;
