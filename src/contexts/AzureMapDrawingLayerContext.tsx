import React, { createContext } from 'react'
import { useAzureMapDrawingLayer } from '../hooks/useAzureMapDrawingLayer'
import { IAzureDrawingLayerStatefulProviderProps, IAzureMapLayerProps } from '../types'

const AzureMapDrawingLayerContext = createContext<IAzureMapLayerProps>({
  layerRef: null
})
const { Provider, Consumer: AzureMapDrawingLayerConsumer } = AzureMapDrawingLayerContext

const AzureMapDrawingLayerStatefulProvider = ({
  options,
  type,
  events,
  lifecycleEvents
}: IAzureDrawingLayerStatefulProviderProps) => {
  const { layerRef } = useAzureMapDrawingLayer({
    options,
    type,
    events,
    lifecycleEvents
  })

  return (
    <Provider
      value={{
        layerRef
      }}
    ></Provider>
  )
}

export {
  AzureMapDrawingLayerContext,
  AzureMapDrawingLayerConsumer,
  AzureMapDrawingLayerStatefulProvider as AzureMapDrawingLayerProvider
}
