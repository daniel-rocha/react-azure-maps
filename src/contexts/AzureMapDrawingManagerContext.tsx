import React, { createContext, useContext, useEffect, useState } from 'react'
import 'azure-maps-drawing-tools/dist/atlas-drawing.min.css'

import atlas from 'azure-maps-control'
import { drawing, control } from 'azure-maps-drawing-tools'
import {
  DrawingManagerType,
  IAzureDrawingManagerStatefulProviderProps,
  IAzureDrawingManagerEventType,
  IAzureDrawingManagerDrawingEventType,
  IAzureMapDrawingManagerProps,
  IAzureMapsContextProps,
  MapType
} from '../types'
import { AzureMapsContext } from './AzureMapContext'
import { useCheckRef } from '../hooks/useCheckRef'
import { Shape } from 'azure-maps-control'
import { AzureMapDataSourceContext } from './AzureMapDataSourceContext'

const AzureMapDrawingManagerContext = createContext<IAzureMapDrawingManagerProps>({
  drawingManagerRef: null
})

const { Provider: DrawingManagerProvider, Consumer: AzureMapDrawingManagerConsumer } = AzureMapDrawingManagerContext
const { Provider: DataSourceProvider } = AzureMapDataSourceContext

// FIXME: this is used until ts understanding azure-maps-control.EventManager extension in azure-maps-drawing-tools is resolved
// copies EventManager definitions from azure-maps-drawing-tools
interface _EventManager {
  add(eventType: "drawingmodechanged", target: drawing.DrawingManager, callback: (e: drawing.DrawingMode) => void): void;
  add(eventType: "drawingchanged" | "drawingchanging" | "drawingcomplete" | "drawingstarted", target: drawing.DrawingManager, callback: (e: Shape) => void): void;
  remove(eventType: string, target: drawing.DrawingManager, callback: (e?: any) => void): void
} 

const AzureMapDrawingManagerStatefulProvider = ({
  options,
  children,
  events = {}
}: IAzureDrawingManagerStatefulProviderProps) => {
  const { mapRef } = useContext<IAzureMapsContextProps>(AzureMapsContext)
  const [drawingManagerRef, setDrawingManagerRef] = useState<drawing.DrawingManager | null>(null)
  const [dataSourceRef, setDataSourceRef] = useState<atlas.source.DataSource | null>(null)
  const [toolbarOnceReadyRef, setToolbarOnceReadyRef] = useState<control.DrawingToolbar | undefined>(undefined)

  useCheckRef<MapType, MapType>(mapRef, mapRef, mref => {
    mref.events.add('ready', () => {
      // NOTE: if DrawingToolbar gets instantiated before map is 'ready', weird runtime errors follow. 
      // create toolbar here instead
      const drawingManager = new drawing.DrawingManager(mref)
      const toolbar = options.toolbar ? new control.DrawingToolbar(options.toolbar) : undefined
      drawingManager.setOptions({ 
        ...options, 
        toolbar
      })

      setDrawingManagerRef(drawingManager)
      setDataSourceRef(drawingManager.getSource())
      setToolbarOnceReadyRef(toolbar)
      
      // register drawing events
      for (const eventType in events) {
        const handler = events[eventType as IAzureDrawingManagerEventType]
        if(!handler){ 
          continue 
        }

        // NOTE: duplication to have the explicit types instead of any
        if(eventType == 'drawingmodechanged'){
          (mref.events as _EventManager).add(eventType, drawingManager, handler as (a: drawing.DrawingMode) => void)
        } else {
          (mref.events as _EventManager).add(eventType as IAzureDrawingManagerDrawingEventType, drawingManager, handler as (e: Shape) => void)
        }
      }

      return () => {
        setDrawingManagerRef(null)
        setDataSourceRef(null)
        setToolbarOnceReadyRef(undefined)

        for (const eventType in events) {
          const handler = events[eventType as IAzureDrawingManagerEventType];
          if(handler){
            (mref.events as _EventManager).remove(eventType, drawingManager, handler)
          }
        }
      }
    })
  })

  useEffect(() => {
    if(drawingManagerRef && options){
      drawingManagerRef.setOptions({ ...options, toolbar: toolbarOnceReadyRef })
    }
    if(toolbarOnceReadyRef && options && options.toolbar){
      toolbarOnceReadyRef.setOptions(options.toolbar)
    }
  }, [drawingManagerRef, options, toolbarOnceReadyRef])

  return (
    <DrawingManagerProvider
      value={{
        drawingManagerRef
      }}
    >
      <DataSourceProvider value={{ dataSourceRef }}>
        {mapRef && drawingManagerRef && children}
      </DataSourceProvider>
    </DrawingManagerProvider>
  )
}

export {
  AzureMapDrawingManagerContext,
  AzureMapDrawingManagerConsumer,
  AzureMapDrawingManagerStatefulProvider as AzureMapDrawingManagerProvider
}
