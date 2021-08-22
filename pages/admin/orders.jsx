import React, { useContext, useEffect, useReducer } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import dynamic from 'next/dynamic';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import { getError } from '@utils/error/error';
import { StoreContext } from '@utils/store/Store';
import axios from 'axios';

function orderReducer(state, action) {
  switch (action.type) {
    case 'FETCH_ORDERS_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_ORDERS_SUCCESS':
      return { ...state, loading: false, orders: action.payload, error: '' };
    case 'FETCH_ORDERS_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

const OrderDashboard = () => {
  const classes = useStyles();
  const router = useRouter();
  const { state } = useContext(StoreContext);
  const { userInfo } = state;

  const initialState = {
    loading: true,
    orders: [],
    error: '',
  };

  const [{ loading, error, orders }, dispatch] = useReducer(
    orderReducer,
    initialState
  );

  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }
    const fetchOrders = async () => {
      try {
        dispatch({ type: 'FETCH_ORDERS_REQUEST' });
        const { data } = await axios.get('/api/admin/orders', {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_ORDERS_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_ORDERS_FAIL', payload: getError(err) });
      }
    };
    fetchOrders();
  }, []);

  return (
    <Layout title="Orders">
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={classes.section}>
            <List>
              <NextLink href="/admin/dashboard" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Admin Dashboard"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/admin/orders" passHref>
                <ListItem selected button component="a">
                  <ListItemText primary="Orders"></ListItemText>
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
                  Orders
                </Typography>
              </ListItem>
              <ListItem>
                {loading ? (
                  <CircularProgress />
                ) : error ? (
                  <Typography className={classes.error}>{error}</Typography>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Id</TableCell>
                          <TableCell>User</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>Total</TableCell>
                          <TableCell>Paid</TableCell>
                          <TableCell>Delivered</TableCell>
                          <TableCell>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order._id}>
                            <TableCell>{order._id.substring(18, 24)}</TableCell>
                            <TableCell>
                              {order.user ? order.user.name : 'Deleted User'}
                            </TableCell>
                            <TableCell>
                              {order.createdAt.substring(0, 10)}
                            </TableCell>
                            <TableCell>${order.totalPrice}</TableCell>
                            <TableCell>
                              {order.isPaid
                                ? `paid at ${order.paidAt.substring(0, 10)}`
                                : 'not paid'}
                            </TableCell>
                            <TableCell>
                              {order.isDelivered
                                ? `delivered at ${order.deliveredAt.substring(
                                    0,
                                    10
                                  )}`
                                : 'not delivered'}
                            </TableCell>
                            <TableCell>
                              <NextLink href={`/order/${order._id}`} passHref>
                                <Button variant="contained">Details</Button>
                              </NextLink>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(OrderDashboard), { ssr: false });
