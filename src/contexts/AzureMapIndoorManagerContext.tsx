import React, { createContext, useContext, useEffect, useState } from 'react'
import { indoor, control } from 'azure-maps-indoor'
import { IAzureMapIndoorManagerEventType, IAzureMapIndoorManagerStatefulProviderProps, IAzureMapsContextProps, MapType } from '../types'
import { AzureMapsContext } from './AzureMapContext'
import { useCheckRef } from '../hooks/useCheckRef'

const AzureMapIndoorManagerContext = createContext<{}>({ 
  indoorManagerRef: null 
})

const { Provider: IndoorManagerProvider, Consumer: AzureMapIndoorManagerConsumer } = AzureMapIndoorManagerContext

const AzureMapIndoorManagerStatefulProvider = ({
  options,
  children,
  dynamicStyling = false,
  facility = { facilityId: '', levelOrdinal: 0 },
  events = {}
}: IAzureMapIndoorManagerStatefulProviderProps) => {
  const { mapRef } = useContext<IAzureMapsContextProps>(AzureMapsContext)
  const [ indoorManagerRef, setIndoorManagerRef ] = useState<indoor.IndoorManager | null>(null)
  const [ levelControlRef, setLevelControlRef ] = useState<control.LevelControl | undefined>(undefined)

  useCheckRef<MapType, MapType>(mapRef, mapRef, mref => {
    mref.events.add('ready', () => {
      const indoorManager = new indoor.IndoorManager(mref)
      const levelControl = options.levelControl ? new control.LevelControl(options.levelControl) : undefined
      indoorManager.setOptions({
        ...options,
        levelControl
      })
      
      indoorManager.setDynamicStyling(dynamicStyling)
      indoorManager.setFacility(facility.facilityId, facility.levelOrdinal)

      setIndoorManagerRef(indoorManager)
      setLevelControlRef(levelControl)

      // TODO: gracefully handle the change of props events object
      for(const eventType in events){
        const handler = events[eventType as IAzureMapIndoorManagerEventType]
        if(!handler){ 
          continue 
        }

        mref.events.add(eventType as any, indoorManager, handler)
      }

      return () => {
        indoorManager.dispose()
        setIndoorManagerRef(null)
        setLevelControlRef(undefined)

        for(const eventType in events){
          const handler = events[eventType as IAzureMapIndoorManagerEventType]
          if(!handler){ 
            continue 
          }

          mref.events.remove(eventType, indoorManager, handler)
        }
      }
    })
  })

  useCheckRef(indoorManagerRef, options, (imref, options) => {
    imref.setOptions({
      ...options,
      levelControl: options.levelControl ? levelControlRef : undefined
    })
  })

  useCheckRef(levelControlRef, options.levelControl, () => {
    if(!options.levelControl){
      setLevelControlRef(undefined)
    } else {
      // NOTE: LevelControl does not yet support dynamically updating options yet 
      // levelControlRef.setOptions(options.levelControl)
      if(indoorManagerRef){
        const levelControl = new control.LevelControl(options.levelControl)
        setLevelControlRef(levelControl)
        indoorManagerRef.setOptions({
          ...options,
          levelControl
        })
      }
    }
  })

  useCheckRef(indoorManagerRef, dynamicStyling, (imref) => {
    imref.setDynamicStyling(dynamicStyling)
  })

  useCheckRef(indoorManagerRef, facility, (imref) => {
    imref.setFacility(facility.facilityId, facility.levelOrdinal)
  })

  return (
    <IndoorManagerProvider value={{indoorManagerRef}}>
      {mapRef && indoorManagerRef && children}
    </IndoorManagerProvider>
  )
}

export {
  AzureMapIndoorManagerContext,
  AzureMapIndoorManagerConsumer,
  AzureMapIndoorManagerStatefulProvider as AzureMapIndoorManagerProvider
}