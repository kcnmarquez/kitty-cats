import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './Home.scss';
import { Breed, Cat } from '../helper/common';
import { getBreeds, getCats } from '../helper/api';
import { ExclamationTriangleFill } from 'react-bootstrap-icons';

function Home() {
  const [selectedBreed, setSelectedBreed] = React.useState<string>('');
  const [breeds, setBreeds] = React.useState<ReadonlyArray<Breed>>([]);
  const [cats, setCats] = React.useState<ReadonlyArray<Cat>>([]);
  const [catCount, setCatCount] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [canLoadMore, setCanLoadMore] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  const [searchParams] = useSearchParams();

  const PAGE_LIMIT = 10;

  React.useEffect(() => {
    getBreeds()
      .then(response => {
        setBreeds(response);
      });

    const breed = searchParams.get('breed');

    if (breed) {
      setSelectedBreed(breed);
    }
  }, [searchParams]);

  React.useEffect(() => {
    if (catCount <= 0) return;

    const maxPages = Math.ceil(catCount / PAGE_LIMIT);
    setCanLoadMore(maxPages > currentPage);
  }, [catCount, currentPage]);

  React.useEffect(() => {
    if (!selectedBreed) return;

    setIsLoading(true);
    setHasError(false);
    setCats([]);
    setCatCount(0);

    getCats(selectedBreed)
      .then(({ resultsCount, data }) => {
        setIsLoading(false);

        setCatCount(resultsCount);

        if (data.length === 0) {
          // invalid breed ID
          setSelectedBreed('');
        }

        setCats(data);
        setCurrentPage(1);
      })
      .catch(error => {
        console.error(error);
        setHasError(true);
      });
  }, [selectedBreed]);

  const updateCats = React.useCallback((newCats: ReadonlyArray<Cat>) => {
    setCats((c) => [...c, ...newCats]);
  }, []);

  React.useEffect(() => {
    if (currentPage === 1) return;

    setIsLoading(true);
    setHasError(false);

    getCats(selectedBreed, currentPage - 1)
      .then(({ resultsCount, data }) => {
        setIsLoading(false);
        setCatCount(resultsCount);
        updateCats(data);
      });
  }, [currentPage, selectedBreed, updateCats]);

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
  } else {
    content = (
      <div className="row">
        {cats.length === 0 && !isLoading &&
          <div className="col-12">No cats available</div>
        }
        {cats.map(cat => {
          return (
            <div className="col-lg-4 col-md-6 col-12" key={cat.id}>
              <div className="card">
              <img className="card-img cat-image" alt="cat" src={cat.url} />
              <div className="card-body d-grid gap-2 p-0 mt-3">
                <Link to={`/${cat.id}`} className="btn btn-primary stretched-link">View details</Link>
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
        <h1>Kitty Cats</h1>

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
        {isLoading &&
          <div className="d-flex align-items-center mb-3">
            <strong>Loading...</strong>
            <div className="spinner-border ms-auto" role="status" aria-hidden="true"></div>
          </div>
        }

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
