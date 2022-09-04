/* eslint-disable react/require-default-props */
import React from 'react';
import { Spinner } from 'react-bootstrap';
import s from './DelayLoader.module.scss';

type props = {
  isLoading: boolean;
  children: React.ReactElement;
  error?: string;
};

export default function DelayLoader({
  children,
  isLoading,
  error = '',
}: props): React.ReactElement {
  if (error)
    return (
      <div className={s.wrapper}>
        <h1>{error}</h1>
      </div>
    );

  return isLoading ? (
    <div className={s.wrapper}>
      <Spinner animation="border" variant="primary" />
    </div>
  ) : (
    children
  );
}
