import atlas, { source, layer } from 'azure-maps-control'
import { ReactNode } from 'react'
import { renderHook } from '@testing-library/react-hooks'
import { useAzureMapLayer } from './useAzureMapLayer'
import { Map } from 'azure-maps-control'
import { drawing } from 'azure-maps-drawing-tools'
import React from 'react'
import { AzureMapsContext } from '../contexts/AzureMapContext'
import { AzureMapDrawingManagerContext } from '../contexts/AzureMapDrawingManagerContext'
import { IAzureLayerStatefulProviderProps, LayerType } from '../types'
import { useAzureMapDrawingLayer } from './useAzureMapDrawingLayer'

const mapContextProps = {
  mapRef: null,
  isMapReady: false,
  setMapReady: jest.fn(),
  removeMapRef: jest.fn(),
  setMapRef: jest.fn()
}
const mapRef = new Map('fake', {})

const wrapWithAzureMapContext = ({ children }: { children?: ReactNode | null }) => {
  const drawingManagerRef = new drawing.DrawingManager(mapRef, {})
  return (
    <AzureMapsContext.Provider
      value={{
        ...mapContextProps,
        mapRef
      }}
    >
      <AzureMapDrawingManagerContext.Provider
        value={{ drawingManagerRef }}
      >
        {children}
      </AzureMapDrawingManagerContext.Provider>
    </AzureMapsContext.Provider>
  )
}

describe('userMapDrawingLayer tests', () => {
  it('should create standard layer and set options', () => {
    const options = {iconOptions: { image: 'marker-blue' }}
    const { result } = renderHook(
      () =>
        useAzureMapDrawingLayer({
          type: 'pointLayer',
          options
        }),
      { wrapper: wrapWithAzureMapContext }
    )
    
    expect((result.current.layerRef as unknown as { layer: string }).layer).toBe("SymbolLayer")
    expect(result.current.layerRef?.setOptions).toBeCalledWith(options)
  })

  it('should handle add events to layerRef', () => {
    mapRef.events.add = jest.fn()
    const options = {iconOptions: { image: 'marker-blue' }}
    const events = { click: () => {} }
    renderHook(
      () =>
        useAzureMapDrawingLayer({
          type: 'pointLayer',
          options,
          events
        }),
      { wrapper: wrapWithAzureMapContext }
    )
    expect(mapRef.events.add).toHaveBeenCalledWith('click', expect.any(Object), events.click)
  })

  it('should handle add lifeCycleEvents to layerRef', () => {
    mapRef.events.add = jest.fn()
    const lifecycleEvents = { onCreate: () => {} }
    const options = {iconOptions: { image: 'marker-blue' }}
    renderHook(
      () =>
        useAzureMapDrawingLayer({
          type: 'pointLayer',
          options,
          lifecycleEvents
        }),
      { wrapper: wrapWithAzureMapContext }
    )
    expect(mapRef.events.add).toHaveBeenCalledWith(
      'onCreate',
      expect.any(Object),
      lifecycleEvents.onCreate
    )
  })
})