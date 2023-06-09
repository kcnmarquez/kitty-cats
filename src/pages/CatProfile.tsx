import React from 'react';
import { ArrowLeft, ExclamationTriangleFill } from 'react-bootstrap-icons';
import { Link, useParams } from 'react-router-dom';
import './CatProfile.scss';
import { Cat } from '../helper/common';
import { getCat } from '../helper/api';

function CatProfile() {
  const [cat, setCat] = React.useState<Cat>();
  const [hasError, setHasError] = React.useState(false);

  const { id } = useParams();

  React.useEffect(() => {
    if (!id) return;

    getCat(id)
      .then(response => {
        setHasError(false);
        setCat(response);
      })
      .catch(error => {
        console.error(error);
        setHasError(true);
      });
  }, [id]);

  let cardBody = (<h5 className="m-4">Loading...</h5>);
  let backLink = '/';

  if (cat && cat?.breeds) {
    const breed = cat?.breeds[0];
    backLink = `/?breed=${breed.id}`;
    cardBody = (
      <>
        <img className="card-img img-fluid" alt={breed.name} src={cat.url} />
        <div className="card-body">
          <h4>{breed.name}</h4>
          <h5>Origin: {breed.origin}</h5>
          <h6>{breed.temperament}</h6>
          <p className="mb-0">{breed.description}</p>
        </div>
      </>
    );
  }

  return (
    <div className="Cat">
      <div className="container">
        <div className="card">
          <div className="mb-2">
            <Link to={backLink} className="btn btn-link back-btn">
              <ArrowLeft className="me-2" />
              Back
            </Link>
          </div>
          {hasError &&
            <div className="alert alert-danger m-0" role="alert">
              <ExclamationTriangleFill className="me-2" size={24} />
              Apologies but we could not load the cat for you at this time! Miau!
            </div>
          }
          {!hasError && cardBody}
        </div>
      </div>
    </div>
  );
}

export default CatProfile;
