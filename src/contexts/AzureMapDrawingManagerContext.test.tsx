import { renderHook } from '@testing-library/react-hooks'
import { Map, Shape } from 'azure-maps-control'
import { drawing } from 'azure-maps-drawing-tools'
import React, { useContext } from 'react'
import { IAzureDrawingManagerStatefulProviderProps } from '../types'
import { AzureMapsContext, AzureMapsProvider } from './AzureMapContext'
import { AzureMapDrawingManagerProvider, AzureMapDrawingManagerContext } from './AzureMapDrawingManagerContext'

const mapContextProps = {
  mapRef: null,
  isMapReady: false,
  setMapReady: jest.fn(),
  removeMapRef: jest.fn(),
  setMapRef: jest.fn()
}

const mapRef = new Map('fake', {})

const useContextConsumer = () => {
  const drawingManagerContext = useContext(AzureMapDrawingManagerContext)
  return drawingManagerContext
}

const wrapWithDrawingManagerContext = (props: IAzureDrawingManagerStatefulProviderProps) => ({
  children
}: {
  children?: any
}) => {
  return (
    <AzureMapsContext.Provider
      value={{
        ...mapContextProps,
        mapRef
      }}
    >
      <AzureMapDrawingManagerProvider {...{ ...props }}>{children}</AzureMapDrawingManagerProvider>
    </AzureMapsContext.Provider>
  )
}

describe('AzureMapDataSourceProvider tests', () => {
  it('should add drawing manager datasource to map ref on map ready', () => {  
    mapRef.sources.add = jest.fn()
    const { result } = renderHook(() => useContextConsumer(), {
      wrapper: wrapWithDrawingManagerContext({ options: {} })
    })

    expect(mapRef.sources.add).toHaveBeenCalledWith(result.current.drawingManagerRef?.getSource())
  })

  it('should add passed events to the map with DrawingManager target', () => {  
    (mapRef.events.add as any) = jest.fn((eventType, targetOrCallback, callback) => {
      if(callback){
        callback()
      } else {
        // for ready event 
        targetOrCallback()
      }
    })

    const drawingmodechanged = (mode: drawing.DrawingMode) => {}
    const drawingstarted = (shape: Shape) => {}
    const { result } = renderHook(() => useContextConsumer(), {
      wrapper: wrapWithDrawingManagerContext({ options: {}, events: { drawingstarted, drawingmodechanged }})
    })

    expect(mapRef.events.add).toHaveBeenCalledWith(
      'drawingmodechanged',
      result.current.drawingManagerRef,
      drawingmodechanged
    )

    expect(mapRef.events.add).toHaveBeenCalledWith(
      'drawingstarted',
      result.current.drawingManagerRef,
      drawingstarted
    )
  })

  it('should discard drawing event when it is undefined', () => {  
    mapRef.events.add = jest.fn((eventName: any, callback: any) => callback())
    const { result } = renderHook(() => useContextConsumer(), {
      wrapper: wrapWithDrawingManagerContext({ options: {}, events: { drawingstarted: undefined }})
    })

    // only ready event handler should have been added
    expect(mapRef.events.add).toHaveBeenCalledWith('ready', expect.any(Function))
  })

  it('should add toolbar control to map ref on map ready', () => { 
    mapRef.controls.add = jest.fn() 
    const { result } = renderHook(() => useContextConsumer(), {
      wrapper: wrapWithDrawingManagerContext({ options: { toolbar: { position: 'top-right' }}})
    })

    expect(mapRef.controls.add).toBeCalledTimes(1)
  })
})
