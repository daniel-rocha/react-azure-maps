export { default as AzureMap } from './components/AzureMap/AzureMap'
export { default as AzureMapHtmlMarker } from './components/AzureMapMarkers/AzureMapHtmlMarker/AzureMapHtmlMarker'
export { default as AzureMapFeature } from './components/AzureMapFeature/AzureMapFeature'
export {
  AzureMapsContext,
  AzureMapsConsumer,
  AzureMapsProvider,
  useAzureMaps
} from './contexts/AzureMapContext'
export {
  AzureMapDataSourceContext,
  AzureMapDataSourceConsumer,
  AzureMapDataSourceProvider,
} from './contexts/AzureMapDataSourceContext'
export { AzureMapVectorTileSourceProvider } from './contexts/AzureMapVectorTileSourceProvider'
export {
  AzureMapLayerContext,
  AzureMapLayerConsumer,
  AzureMapLayerProvider
} from './contexts/AzureMapLayerContext'
export {
  AzureMapIndoorManagerContext,
  AzureMapIndoorManagerConsumer,
  AzureMapIndoorManagerProvider
} from './contexts/AzureMapIndoorManagerContext'
export { default as AzureMapPopup } from './components/AzureMapPopup/AzureMapPopup'
export { default as useCreatePopup } from './components/AzureMapPopup/useCreateAzureMapPopup'

export {
  generateLinesFromArrayOfPosition,
  generatePixelHeading
} from './components/helpers/mapHelper'

export * from './types'
