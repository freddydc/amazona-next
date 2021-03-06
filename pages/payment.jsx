import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@components/Layout/Layout';
import useStyles from '@components/Layout/styles/styles';
import {
  Button,
  FormControl,
  FormControlLabel,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Typography,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { StoreContext } from '@utils/store/Store';
import CheckoutWizard from '@components/Checkout/CheckoutWizard';
import Cookies from 'js-cookie';

const Payment = () => {
  const router = useRouter();
  const classes = useStyles();
  const [paymentMethod, setPaymentMethod] = useState('');
  const { state, dispatch } = useContext(StoreContext);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const {
    cart: { shippingAddress },
  } = state;

  useEffect(() => {
    if (!shippingAddress.address) {
      router.push('/shipping');
    } else {
      setPaymentMethod(Cookies.get('paymentMethod') || '');
    }
  }, []);

  const submitHandler = (e) => {
    closeSnackbar();
    e.preventDefault();
    if (!paymentMethod) {
      enqueueSnackbar('Payment method is required', { variant: 'error' });
    } else {
      dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethod });
      Cookies.set('paymentMethod', paymentMethod);
      router.push('/placeorder');
    }
  };

  return (
    <Layout title="Payment Method">
      <CheckoutWizard activeStep={2} />
      <form className={classes.form} onSubmit={submitHandler}>
        <Typography component="h1" variant="h1">
          Payment Method
        </Typography>
        <List>
          <ListItem>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="Payment Method"
                name="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel
                  label="PayPal"
                  value="PayPal"
                  control={<Radio />}
                ></FormControlLabel>
                <FormControlLabel
                  label="Stripe"
                  value="Stripe"
                  control={<Radio />}
                ></FormControlLabel>
                <FormControlLabel
                  label="Bitcoin"
                  value="Bitcoin"
                  control={<Radio />}
                ></FormControlLabel>
              </RadioGroup>
            </FormControl>
          </ListItem>
          <ListItem>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Continue
            </Button>
          </ListItem>
          <ListItem>
            <Button
              type="button"
              variant="contained"
              onClick={() => router.push('/shipping')}
              fullWidth
            >
              Back
            </Button>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
};

export default Payment;
