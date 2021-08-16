import React from 'react';
import { Step, StepLabel, Stepper } from '@material-ui/core';
import useCheckoutStyles from './styles/styles';

const CheckoutWizard = ({ activeStep = 0 }) => {
  const classes = useCheckoutStyles();
  const steps = ['Login', 'Shipping Address', 'Payment Method', 'Place Order'];
  return (
    <Stepper
      className={classes.transparentBackground}
      activeStep={activeStep}
      alternativeLabel
    >
      {steps.map((step) => (
        <Step key={step}>
          <StepLabel>{step}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default CheckoutWizard;
