import { useContext } from 'react';
import Image from 'next/image';
import NextLink from 'next/link';
import Carousel from 'react-material-ui-carousel';
import { Grid, Link, Typography } from '@material-ui/core';
import { useRouter } from 'next/router';
import Layout from '../components/Layout/Layout';
import useStyles from '@components/Layout/styles/styles';
import Product from '@models/Product/Product';
import ProductItem from '@components/ProductItem/ProductItem';
import { StoreContext } from '@utils/store/Store';
import db from '@database';
import axios from 'axios';

const Home = (props) => {
  const router = useRouter();
  const classes = useStyles();
  const { topRatedProducts, featuredProducts } = props;
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
      <Carousel className={classes.mt_1} animation="slide">
        {featuredProducts.map((product) => (
          <NextLink
            key={product._id}
            href={`/product/${product.slug}`}
            passHref
          >
            <Link>
              <Image
                alt={product.name}
                src={product.featuredImage}
                layout="responsive"
                width="100%"
                height="40%"
              />
            </Link>
          </NextLink>
        ))}
      </Carousel>
      <Typography variant="h2">Popular Products</Typography>
      <Grid container spacing={3}>
        {topRatedProducts.map((product) => (
          <Grid item md={4} key={product.name}>
            <ProductItem
              product={product}
              addToCartHandler={addToCartHandler}
            />
          </Grid>
        ))}
      </Grid>
    </Layout>
  );
};

export async function getServerSideProps() {
  await db.connect();
  const featuredProductsDocs = await Product.find(
    { isFeatured: true },
    '-reviews'
  )
    .lean()
    .limit(3);

  const topRatedProductsDocs = await Product.find({}, '-reviews')
    .lean()
    .sort({
      rating: -1,
    })
    .limit(6);

  await db.disconnect();
  return {
    props: {
      featuredProducts: featuredProductsDocs.map(db.convertDocToObj),
      topRatedProducts: topRatedProductsDocs.map(db.convertDocToObj),
    },
  };
}

export default Home;
