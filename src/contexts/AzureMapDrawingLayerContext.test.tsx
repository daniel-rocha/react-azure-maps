import React from 'react'
import { render } from '@testing-library/react'
import { AzureMapDrawingLayerProvider } from './AzureMapDrawingLayerContext'

describe('AzureMapDrawingLayerProvider', () => {
  it('should create and render AzureMapDrawingLayerProvider', () => {
    const { container } = render(<AzureMapDrawingLayerProvider type="polygonLayer" options={{fillColor: 'green'}}/>)
    expect(container).toMatchSnapshot()
  })
})
