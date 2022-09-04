import React from 'react'

type props = {
  isLoading: boolean,
  children: React.ReactElement
}

export default function DelayLoader({children, isLoading}: props): React.ReactElement {
  return isLoading 
  ? <h2>Loading...</h2>
  : children
}