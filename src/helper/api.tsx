import axios from 'axios';

const BASE_URL = 'https://api.thecatapi.com/v1';

const config = {
  headers: {
    'x-api-key': process.env.REACT_APP_API_KEY,
  },
}

export const getBreeds = async (): Promise<any> => {
  return await axios.get(`${BASE_URL}/breeds`, config)
    .then(response => {
      return response.data;
    });
}

// Note: page starts at 0
export const getCats = async (breedId: string, page = 0): Promise<any> => {
  return axios.get(`${BASE_URL}/images/search`, {
    ...config,
    params: {
      order: 'ASC',
      page,
      limit: 10,
      breed_ids: breedId,
    },
  })
    .then(response => {
      return {
        resultsCount: response.headers['pagination-count'],
        data: response.data,
      };
    });
}

export const getCat = async (catId: string): Promise<any> => {
  return axios.get(`${BASE_URL}/images/${catId}`, config)
    .then(response => {
      return response.data;
    });
}