import { useContext } from 'react';
import { Grid } from '@material-ui/core';
import { useRouter } from 'next/router';
import Layout from '../components/Layout/Layout';
import Product from '@models/Product/Product';
import ProductItem from '@components/ProductItem/ProductItem';
import { StoreContext } from '@utils/store/Store';
import db from '@database';
import axios from 'axios';

const Home = (props) => {
  const { products } = props;
  const router = useRouter();
  const { state, dispatch } = useContext(StoreContext);

  const addToCartHandler = async (product) => {
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    router.push('/cart');
  };

  return (
    <Layout>
      <div>
        <h1>Products</h1>
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item md={4} key={product.name}>
              <ProductItem
                product={product}
                addToCartHandler={addToCartHandler}
              />
            </Grid>
          ))}
        </Grid>
      </div>
    </Layout>
  );
};

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find({}, '-reviews').lean();
  await db.disconnect();
  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  };
}

export default Home;
