import { useState, useEffect, useContext } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import atlas from 'azure-maps-control'

import { IAzureMapPopup, IAzureMapsContextProps, MapType } from '../../types'
import { AzureMapsContext } from '../../contexts/AzureMapContext'
import { useCheckRef } from '../../hooks/useCheckRef'
export const useCreatePopup = ({
  options,
  popupContent,
  isVisible
}: Pick<IAzureMapPopup, 'popupContent' | 'options' | 'isVisible'>) => {
  const [popupRef] = useState<atlas.Popup>(
    new atlas.Popup({ ...options, content: renderToStaticMarkup(popupContent) })
  )
  const { mapRef } = useContext<IAzureMapsContextProps>(AzureMapsContext)

  useCheckRef<MapType, MapType>(mapRef, mapRef, mref => {
    mref.events.addOnce('ready', () => mref.popups.add(popupRef))
  })

  useEffect(() => {
    popupRef.setOptions({
      ...options,
      content: renderToStaticMarkup(popupContent)
    })
    if (mapRef && isVisible && !popupRef.isOpen()) {
      popupRef.open(mapRef)
    }
  }, [options, popupContent])

  return popupRef
}

export default useCreatePopup
