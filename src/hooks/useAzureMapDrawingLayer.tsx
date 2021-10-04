import { useContext, useEffect, useState } from 'react'
import { useCheckRef } from '../hooks/useCheckRef'
import { DrawingManagerType, IAzureDrawingLayerStatefulProviderProps, IAzureMapDrawingManagerProps, IAzureMapsContextProps, LayerType, MapType } from '../types'
import { AzureMapsContext } from '../contexts/AzureMapContext'
import { AzureMapDrawingManagerContext } from '../contexts/AzureMapDrawingManagerContext'

export const useAzureMapDrawingLayer = ({
  options,
  type,
  events,
  lifecycleEvents
}: IAzureDrawingLayerStatefulProviderProps) => {
  const { mapRef } = useContext<IAzureMapsContextProps>(AzureMapsContext)
  const { drawingManagerRef } = useContext<IAzureMapDrawingManagerProps>(AzureMapDrawingManagerContext)
  const [layerRef, setLayerRef] = useState<LayerType | null>(null)

  useCheckRef<DrawingManagerType, DrawingManagerType>(drawingManagerRef, drawingManagerRef, dmref => {
    setLayerRef(dmref.getLayers()[type] || null)
    return () => {
      setLayerRef(null)
    }
  })

  useCheckRef<MapType, LayerType>(mapRef, layerRef, (mref, lref) => {
    for (const eventType in events) {
      mref.events.add(eventType as any, lref, events[eventType])
    }
    for (const event in lifecycleEvents) {
      mref.events.add(event as any, lref, lifecycleEvents[event])
    }
    return () => {
      for (const eventType in events) {
        mref.events.remove(eventType as any, lref, events[eventType])
      }
      for (const event in lifecycleEvents) {
        mref.events.remove(event as any, lref, lifecycleEvents[event])
      }
    }
  })

  useEffect(() => {
    if (layerRef && options) {
      layerRef.setOptions(options)
    }
  }, [layerRef, options])

  return {
    layerRef
  }
}