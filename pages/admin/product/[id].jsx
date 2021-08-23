import React, { useContext, useEffect, useReducer } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import useStyles from '@components/Layout/styles/styles';
import Layout from '@components/Layout/Layout';
import {
  Button,
  Card,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@material-ui/core';
import { getError } from '@utils/error/error';
import { Controller, useForm } from 'react-hook-form';
import { StoreContext } from '@utils/store/Store';
import { useSnackbar } from 'notistack';
import axios from 'axios';

function productReducer(state, action) {
  switch (action.type) {
    case 'FETCH_PRODUCT_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_PRODUCT_SUCCESS':
      return { ...state, loading: false, error: '' };
    case 'FETCH_PRODUCT_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

const ProductEdit = ({ params }) => {
  const productId = params.id;
  const router = useRouter();
  const classes = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { state } = useContext(StoreContext);
  const { userInfo } = state;

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();

  const initialState = {
    loading: true,
    error: '',
  };

  const [{ loading, error }, dispatch] = useReducer(
    productReducer,
    initialState
  );

  useEffect(() => {
    if (!userInfo) {
      return router.push('/login');
    } else {
      const fetchData = async () => {
        try {
          dispatch({ type: 'FETCH_PRODUCT_REQUEST' });
          const { data } = await axios.get(`/api/admin/products/${productId}`, {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });
          dispatch({ type: 'FETCH_PRODUCT_SUCCESS' });
          setValue('name', data.name);
          setValue('slug', data.slug);
          setValue('price', data.price);
          setValue('image', data.image);
          setValue('category', data.category);
          setValue('brand', data.brand);
          setValue('countInStock', data.countInStock);
          setValue('description', data.description);
        } catch (err) {
          dispatch({ type: 'FETCH_PRODUCT_FAIL', payload: getError(err) });
        }
      };
      fetchData();
    }
  }, []);

  const submitHandler = async ({ name }) => {
    closeSnackbar();
    try {
      await axios.put(
        `/api/admin/products/${productId}`,
        { name },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      enqueueSnackbar('Product updated successfully', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  return (
    <Layout title={`Edit Product ${productId.substring(18, 24)}`}>
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={classes.section}>
            <List>
              <NextLink href="/admin/dashboard" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Admin Dashboard" />
                </ListItem>
              </NextLink>
              <NextLink href="/admin/orders" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Orders" />
                </ListItem>
              </NextLink>
              <NextLink href="/admin/products" passHref>
                <ListItem selected button component="a">
                  <ListItemText primary="Products" />
                </ListItem>
              </NextLink>
            </List>
          </Card>
        </Grid>
        <Grid item md={9} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography component="h1" variant="h1">
                  Edit Product {productId.substring(18, 24)}
                </Typography>
              </ListItem>
              <ListItem>
                {loading && <CircularProgress />}
                {error && (
                  <Typography className={classes.error}>{error}</Typography>
                )}
              </ListItem>
              <ListItem>
                <form
                  className={classes.form}
                  onSubmit={handleSubmit(submitHandler)}
                >
                  <List>
                    <ListItem>
                      <Controller
                        name="name"
                        control={control}
                        defaultValue=""
                        rules={{ required: true }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            id="name"
                            label="Name"
                            fullWidth
                            error={Boolean(errors.name)}
                            helperText={errors.name ? 'Enter product name' : ''}
                            {...field}
                          />
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="slug"
                        control={control}
                        defaultValue=""
                        rules={{ required: true }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            id="slug"
                            label="Slug"
                            fullWidth
                            error={Boolean(errors.slug)}
                            helperText={errors.slug ? 'Enter product slug' : ''}
                            {...field}
                          />
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="price"
                        control={control}
                        defaultValue=""
                        rules={{ required: true }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            id="price"
                            label="Price"
                            fullWidth
                            error={Boolean(errors.price)}
                            helperText={
                              errors.price ? 'Enter product price' : ''
                            }
                            {...field}
                          />
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="image"
                        control={control}
                        defaultValue=""
                        rules={{ required: true }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            id="image"
                            label="Image"
                            fullWidth
                            error={Boolean(errors.image)}
                            helperText={
                              errors.image ? 'Enter product image' : ''
                            }
                            {...field}
                          />
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="category"
                        control={control}
                        defaultValue=""
                        rules={{ required: true }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            id="category"
                            label="Category"
                            fullWidth
                            error={Boolean(errors.category)}
                            helperText={
                              errors.category ? 'Enter product category' : ''
                            }
                            {...field}
                          />
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="brand"
                        control={control}
                        defaultValue=""
                        rules={{ required: true }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            id="brand"
                            label="Brand"
                            fullWidth
                            error={Boolean(errors.brand)}
                            helperText={
                              errors.brand ? 'Enter product brand' : ''
                            }
                            {...field}
                          />
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="countInStock"
                        control={control}
                        defaultValue=""
                        rules={{ required: true }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            id="countInStock"
                            label="Count in stock"
                            fullWidth
                            error={Boolean(errors.countInStock)}
                            helperText={
                              errors.countInStock
                                ? 'Enter product count in stock'
                                : ''
                            }
                            {...field}
                          />
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="description"
                        control={control}
                        defaultValue=""
                        rules={{ required: true }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            id="description"
                            label="Description"
                            fullWidth
                            error={Boolean(errors.description)}
                            helperText={
                              errors.description
                                ? 'Enter product description'
                                : ''
                            }
                            {...field}
                          />
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                      >
                        Update
                      </Button>
                    </ListItem>
                  </List>
                </form>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export async function getServerSideProps({ params }) {
  return { props: { params } };
}

export default dynamic(() => Promise.resolve(ProductEdit), { ssr: false });
