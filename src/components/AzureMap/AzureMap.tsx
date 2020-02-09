import React, { memo, useContext, useEffect, useState } from 'react'
import atlas from 'azure-maps-control'
import { IAzureMap, IAzureMapImageSprite, IAzureMapsContextProps, MapType } from '../../types'
import { AzureMapsContext } from '../../contexts/AzureMapContext'
import { Guid } from 'guid-typescript'
import 'azure-maps-control/dist/atlas.min.css'
import 'mapbox-gl/src/css/mapbox-gl.css'
import { useCheckRef } from '../../hooks/useCheckRef'

const createImageSprites = async (mapRef: MapType, spriteArray: [IAzureMapImageSprite]) => {
  const promiseArray: Array<Promise<any>> = []
  if (mapRef) {
    spriteArray.forEach((value: IAzureMapImageSprite) => {
      const spritePromise = mapRef.imageSprite.createFromTemplate(
        value.id,
        value.templateName,
        value.color,
        value.secondaryColor,
        value.scale
      )
      promiseArray.push(spritePromise)
    })
    await Promise.all(promiseArray)
  }
}

const AzureMap = memo(
  ({
    children, // @TODO We need to cover and type all possible childrens that we can pass to this component as child for. ex. Markers etc
    LoaderComponent = () => <div>Loading ...</div>,
    providedMapId,
    containerClassName,
    styles,
    mapCenter,
    options = {},
    imageSprites
  }: IAzureMap) => {
    const { setMapRef, removeMapRef, mapRef, setMapReady, isMapReady } = useContext<
      IAzureMapsContextProps
    >(AzureMapsContext)
    const [mapId] = useState(providedMapId || Guid.create().toString())

    useEffect(() => {
      if (mapRef) {
        mapRef.setCamera(mapCenter)
      }
    }, [mapCenter])

    useCheckRef<MapType, MapType>(mapRef, mapRef, mref => {
      mref.events.add('ready', () => {
        if (imageSprites) {
          createImageSprites(mref, imageSprites)
        }
        setMapReady(true)
      })
    })

    useEffect(() => {
      setMapRef(new atlas.Map(mapId, options))
      return () => {
        removeMapRef()
      }
    }, [])

    return (
      <>
        {!isMapReady && LoaderComponent && <LoaderComponent />}
        <div className={containerClassName} id={mapId} style={{ ...styles, height: '100%' }}>
          {isMapReady && children}
        </div>
      </>
    )
  }
)

export default AzureMap
