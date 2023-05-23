import axios from 'axios';
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import './Home.scss';
import { BASE_URL, Breed, Cat } from '../common';
import { ExclamationTriangleFill } from 'react-bootstrap-icons';

function Home() {
  const [selectedBreed, setSelectedBreed] = React.useState<string>('');
  const [breeds, setBreeds] = React.useState<ReadonlyArray<Breed>>([]);
  const [cats, setCats] = React.useState<ReadonlyArray<Cat>>([]);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [canLoadMore, setCanLoadMore] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  const [searchParams] = useSearchParams();

  React.useEffect(() => {
    axios.get(`${BASE_URL}/breeds`)
      .then(response => {
        setBreeds(response.data);
      });

    const breed = searchParams.get('breed');

    if (breed) {
      setSelectedBreed(breed);
    }
  }, [searchParams]);

  React.useEffect(() => {
    if (currentPage === 1 && cats.length > 0) {
      setCanLoadMore(true);
    }
  }, [cats, currentPage]);

  React.useEffect(() => {
    if (!selectedBreed) return;

    setIsLoading(true);
    setHasError(false);

    axios.get(`${BASE_URL}/images/search?order=DESC&page=1&limit=50&breed_id=${selectedBreed}`)
      .then(response => {
        setIsLoading(false);

        const foo = response.headers['Pagination-Count'];
        console.log('headers: ', foo);
        console.log('response: ', response);

        if (response.data.length === 0) {
          // invalid breed ID
          setSelectedBreed('');
        }

        setCats(response.data);
        setCurrentPage(1);
      })
      .catch(error => {
        console.error(error);
        setHasError(true);
      });
  }, [selectedBreed]);

  React.useEffect(() => {
    if (currentPage === 1) return;

    setIsLoading(true);
    setHasError(false);

    axios.get(`${BASE_URL}/images/search?order=DESC&page=${currentPage}&limit=10&breed_id=${selectedBreed}`)
      .then(response => {
        setIsLoading(false);

        const foo = response.headers['Pagination-Count'];
        console.log('headers 2: ', foo);
        console.log('response data 2: ', response.data);
        const tempCats = response.data;

        const newCats = cats.map(c => c.id).filter(function(n) {
          return tempCats.map((c: Cat) => c.id).indexOf(n) === -1;
        });
        console.log('tempCats: ', tempCats);
        console.log('newCats: ', newCats);
        if (newCats.length === 0) {
          setCanLoadMore(false);
          return;
        };

        setCats(tempCats);
      });
  }, [currentPage, cats, selectedBreed]);

  const onBreedSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBreed(event.target.value);
  }

  const loadMore = () => {
    setCurrentPage(currentPage + 1);
  }

  let content;

  if (hasError) {
    content = (
      <div className="alert alert-danger" role="alert">
        <ExclamationTriangleFill className="me-2" size={24} />
        Apologies but we could not load the cat for you at this time! Miau!
      </div>
    );
  } else if (isLoading) {
    content = (
      <div className="d-flex align-items-center mb-3">
        <strong>Loading...</strong>
        <div className="spinner-border ms-auto" role="status" aria-hidden="true"></div>
      </div>
    );
  } else {
    content = (
      <div className="row">
        {cats.length === 0 &&
          <div className="col-12">No cats available</div>
        }
        {cats.map(cat => {
          return (
            <div className="col-lg-4 col-md-6 col-12" key={cat.id}>
              <div className="card">
              <img className="card-img cat-image" alt="cat" src={cat.url} />
              <div className="card-body d-grid gap-2 p-0 mt-3">
                <a className="btn btn-primary stretched-link" href={`/${cat.id}`}>View details</a>
              </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="Home">
      <div className="container">
        <h1>Cat Browser</h1>

        <div className="row">
          <div className="col-md-4 col-sm-6 col-12 mb-3">
            <label className="form-label" htmlFor="breed">Breed</label>
            <select
              id="breed"
              className="form-select"
              disabled={breeds.length === 0}
              value={(selectedBreed) || ''}
              onChange={onBreedSelect}
            >
              <option value="" disabled>Select breed</option>
              {breeds.map(breed => (
                <option key={breed.id} value={breed.id}>
                  {breed.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {content}

        {canLoadMore && !hasError &&
          <div className="row">
            <div className="col-md-3 col-sm-6 col-12">
              <button type="button" className="btn btn-secondary" onClick={loadMore}>
                Load more
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  );
}

export default Home;
