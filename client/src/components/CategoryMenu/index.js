import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useSelector, useDispatch } from 'react-redux';
import { updateCategories, updateCurrentCategory } from '../Store/slice';
import { QUERY_CATEGORIES } from '../../utils/queries';
import { idbPromise } from '../../utils/helpers';

function CategoryMenu() {
  const dispatch = useDispatch();
  const state = useSelector(state => state.product);
  console.log(state);

  const { categories } = state;

  const { loading, data: categoryData } = useQuery(QUERY_CATEGORIES);

  useEffect(() => {
    if (categoryData) {
      dispatch(updateCategories({ categories: categoryData.categories }));
      categoryData.categories.forEach(category => {
        idbPromise('categories', 'put', category);
      });
    } else if (!loading) {
      idbPromise('categories', 'get').then(categories => {
        dispatch(updateCategories({ categories: categories }));
      });
    }
  }, [categoryData, loading, dispatch]);

  const handleClick = id => {
    dispatch(updateCurrentCategory({ currentCategory: id }));
  };

  return (
    <div>
      <h2>Choose a Category:</h2>
      {categories.map(item => (
        <button
          key={item._id}
          onClick={() => {
            handleClick(item._id);
          }}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryMenu;