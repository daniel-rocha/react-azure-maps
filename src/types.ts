import { ComponentClass, CSSProperties, ReactElement, ReactNode, FunctionComponent } from 'react'
import atlas, {
  AnimationOptions,
  CameraBoundsOptions,
  CameraOptions,
  DataSourceOptions,
  HeatMapLayerOptions,
  HtmlMarker,
  HtmlMarkerEvents,
  HtmlMarkerOptions,
  ImageLayerOptions,
  LineLayerOptions,
  Map,
  MapDataEvent,
  MapErrorEvent,
  MapEvent,
  MapMouseEvent,
  MapMouseWheelEvent,
  MapTouchEvent,
  Options,
  PolygonExtrusionLayerOptions,
  PolygonLayerOptions,
  PopupEvents,
  PopupOptions,
  ServiceOptions,
  Shape,
  StyleOptions,
  SymbolLayerOptions,
  TargetedEvent,
  TileLayerOptions,
  TrafficOptions,
  UserInteractionOptions,
  Control,
  BubbleLayerOptions,
  LayerOptions,
  VectorTileSourceOptions
} from 'azure-maps-control'

import { indoor, control } from 'azure-maps-indoor'

export type IAzureMapOptions = ServiceOptions &
  StyleOptions &
  UserInteractionOptions &
  (CameraOptions | CameraBoundsOptions)

export type IAzureMapChildren =
  | ReactElement<IAzureMapHtmlMarker>
  | ReactElement<IAzureMapPopup>
  | ReactElement<IAzureMapDataSourceProps>
  | ReactElement<IAzureMapIndoorManagerStatefulProviderProps>

export type IAzureMap = {
  children?: Array<IAzureMapChildren> | IAzureMapChildren
  providedMapId?: string
  containerClassName?: string
  styles?: CSSProperties
  LoaderComponent?: ComponentClass<any> | FunctionComponent<any>
  options?: IAzureMapOptions
  imageSprites?: IAzureMapImageSprite[]
  controls?: IAzureMapControls[]
  customControls?: IAzureCustomControls[]
  events?: IAzureMapEvent | any
  cameraOptions?: AzureSetCameraOptions
  trafficOptions?: TrafficOptions
  userInteraction?: UserInteractionOptions
  styleOptions?: StyleOptions
  serviceOptions?: ServiceOptions
}
export type IAzureCustomControls = {
  control: Control
  controlOptions?: ControlOptions
}

export type IAzureMapControls = {
  controlName: string
  controlOptions?: Options
  options?: ControlOptions | undefined
}

export type IAzureMapImageSprite = {
  id: string
  templateName?: string
  color?: string
  secondaryColor?: string
  scale?: number
  icon?: string | HTMLImageElement | ImageData
}

export type IAzureMapContextState = {
  mapRef: Map | null
  isMapReady: boolean | false
  setMapRef(mapRef: Map): void
  removeMapRef(): void
  setMapReady(isMapReady: boolean): void
}

export type IAzureMapHtmlMarkerEvent = {
  eventName: keyof HtmlMarkerEvents
  callback: (e: TargetedEvent) => void
}

export type IAzureMapPopupEvent = {
  eventName: keyof PopupEvents
  callback: (e: TargetedEvent) => void
}

export type IAzureMapMouseEvents = {
  [T in keyof HtmlMarkerEvents]: (e: TargetedEvent) => void
}

export type IAzureMapHtmlMarker = {
  id?: string
  isPopupVisible?: boolean
  markerContent?: ReactElement
  options?: HtmlMarkerOptions
  events?: Array<IAzureMapHtmlMarkerEvent>
}

export type IAzureMapPopup = {
  isVisible?: boolean
  options?: PopupOptions
  events?: Array<IAzureMapPopupEvent>
  popupContent: ReactElement
}

export type IAzureMapDataSourceContextState = {
  dataSourceRef: atlas.source.DataSource | atlas.source.VectorTileSource | null
}

export type IAzureMapLayerContextState = {
  layerRef: atlas.layer.SymbolLayer | atlas.layer.ImageLayer | atlas.layer.TileLayer | null
}

export type IAzureDataSourceChildren =
  | (IAzureMapFeature & ReactNode)
  | ReactElement<IAzureMapFeature>
  | ReactElement<IAzureLayerStatefulProviderProps>

export type IAzureVectorTileSourceChildren = ReactElement<IAzureLayerStatefulProviderProps>

export type IAzureMapDataSourceEvent = {
  [property in IAzureMapDataSourceEventType]: (e: Shape[]) => void
}

export type IAzureMapVectorTileSourceEvent = {
  [property in IAzureMapSourceEventType]?: (e: atlas.source.VectorTileSource) => void
}

export type IAzureMapEvent = {
  [property in IAzureMapEventsType]: (
    e:
      | MapDataEvent
      | MapErrorEvent
      | MapTouchEvent
      | MapMouseEvent
      | string
      | MapMouseWheelEvent
      | MapEvent
      | atlas.layer.Layer
      | atlas.source.Source
  ) => void
}

export type IAzureDataSourceStatefulProviderProps = {
  id: string
  children?:
  | Array<IAzureDataSourceChildren | IAzureDataSourceChildren[] | null>
  | IAzureDataSourceChildren
  | null
  options?: DataSourceOptions
  events?: IAzureMapDataSourceEvent | any
  dataFromUrl?: string
  collection?:
  | atlas.data.FeatureCollection
  | atlas.data.Feature<atlas.data.Geometry, any>
  | atlas.data.Geometry
  | atlas.data.GeometryCollection
  | Shape
  | Array<atlas.data.Feature<atlas.data.Geometry, any> | atlas.data.Geometry | Shape>
  index?: number
}

export type IAzureVectorTileSourceStatefulProviderProps = {
  id: string
  children?:
  | Array<IAzureVectorTileSourceChildren | IAzureVectorTileSourceChildren[] | null>
  | IAzureVectorTileSourceChildren
  | null
  options?: VectorTileSourceOptions
  events?: IAzureMapVectorTileSourceEvent
  // NOTE: not sure yet why this is needed, haven't seen this used in AzureMapsDataSource, though IAzureGeoJSONDataSourceStatefulProviderProps has it
  index?: number
}

export type IAzureMapLayerEvent = {
  [property in IAzureMapLayerEventType]: (
    e: MapMouseEvent | MapTouchEvent | MapMouseWheelEvent
  ) => void
}

export type IAzureMapLifecycleEvent = {
  [property in IAzureMapLayerLifecycleEvents]: (e: atlas.layer.Layer) => void
}

export type IAzureLayerStatefulProviderProps = {
  id?: string
  options?:
  | (SymbolLayerOptions &
    HeatMapLayerOptions &
    ImageLayerOptions &
    LineLayerOptions &
    PolygonExtrusionLayerOptions &
    PolygonLayerOptions &
    TileLayerOptions &
    BubbleLayerOptions &
    LayerOptions)
  | Options
  type: IAzureMapLayerType
  events?: IAzureMapLayerEvent | any
  onCreateCustomLayer?: (dataSourceRef: DataSourceType, mapRef: MapType | null) => atlas.layer.Layer
  lifecycleEvents?: IAzureMapLifecycleEvent | any
}

export type IAzureMapIndoorManagerEvent = {
  facilitychanged?: (e: indoor.IFacilityChangeEvent) => void,
  levelchanged?: (e: indoor.ILevelChangeEvent) => void
}

export type IAzureMapIndoorManagerEventType = keyof IAzureMapIndoorManagerEvent

export type IAzureMapIndoorManagerStatefulProviderProps = {
  options: Omit<indoor.IndoorManagerOptions, 'levelControl'> & { 'levelControl'?: control.LevelControlOptions },
  children?: ReactElement,
  dynamicStyling?: boolean,
  facility?: { facilityId: string, levelOrdinal: number },
  events?: IAzureMapIndoorManagerEvent 
}

export type IAzureMapLayerLifecycleEvents = 'layeradded' | 'layerremoved'

export type IAzureMapEventsType =
  | IAzureMapLayerEventType
  | IAzureMapLayerLifecycleEvents
  | IAzureMapDataSourceEventType
  | IAzureMapAddEventsType
  | IAzureMapSourceEventType
  // Adds a data event to the map.
  | 'data'
  | 'sourcedata'
  | 'styledata'
  // Adds an event to the map.
  | 'error'
  // Adds a style image missing event to the map.
  | 'styleimagemissing'

export type IAzureMapAddEventsType =
  | 'boxzoomstart'
  | 'boxzoomend'
  | 'dragstart'
  | 'drag'
  | 'dragend'
  | 'idle'
  | 'load'
  | 'movestart'
  | 'move'
  | 'moveend'
  | 'pitchstart'
  | 'pitch'
  | 'pitchend'
  | 'ready'
  | 'render'
  | 'resize'
  | 'rotatestart'
  | 'rotate'
  | 'rotateend'
  | 'tokenacquired'
  | 'zoomstart'
  | 'zoom'
  | 'zoomend'

export type IAzureMapDataSourceEventType = 'dataadded' | 'dataremoved'

export type IAzureMapSourceEventType = 'sourceadded' | 'sourceremoved'

export type IAzureMapLayerEventType =
  // Mouse events
  | 'mousedown'
  | 'mouseup'
  | 'mouseover'
  | 'mousemove'
  | 'click'
  | 'dblclick'
  | 'mouseout'
  | 'mouseenter'
  | 'mouseleave'
  | 'contextmenu'
  // Wheel events
  | 'wheel'
  // Touch events
  | 'touchstart'
  | 'touchend'
  | 'touchmove'
  | 'touchcancel'

export type IAzureMapLayerType =
  | 'SymbolLayer'
  | 'HeatLayer'
  | 'ImageLayer'
  | 'LineLayer'
  | 'PolygonExtrusionLayer'
  | 'PolygonLayer'
  | 'TileLayer'
  | 'BubbleLayer'
  | 'HtmlMarkerLayer'
  | 'custom'

export type IAzureMapFeatureType =
  | 'Point'
  | 'MultiPoint'
  | 'LineString'
  | 'MultiLineString'
  | 'Polygon'
  | 'MultiPolygon'

export type IAzureMapFeature = {
  id?: string
  type: IAzureMapFeatureType
  coordinate?: atlas.data.Position
  coordinates?: Array<atlas.data.Position>
  multipleCoordinates?: Array<Array<atlas.data.Position>>
  multipleDimensionCoordinates?: Array<Array<Array<atlas.data.Position>>>
  bbox?: atlas.data.BoundingBox
  variant?: IAzureMapFeatureVariant
  properties?: Options
  // Shape functions:
  setCoords?:
  | atlas.data.Position
  | atlas.data.Position[]
  | atlas.data.Position[][]
  | atlas.data.Position[][][]
  setProperties?: Options
}

export type IAzureMapLayerProps = IAzureMapLayerContextState
export type IAzureMapMouseEventRef = HtmlMarker // && other possible iterfaces
export type IAzureMapsContextProps = IAzureMapContextState
export type IAzureMapDataSourceProps = IAzureMapDataSourceContextState
export type DataSourceType = atlas.source.DataSource | atlas.source.VectorTileSource
export type LayerType = atlas.layer.SymbolLayer | atlas.layer.ImageLayer | atlas.layer.TileLayer
export type MapType = atlas.Map
export type GeometryType = atlas.data.Geometry
export type FeatureType = atlas.data.Feature<atlas.data.Geometry, any>
export type ShapeType = atlas.Shape
export type IAzureMapFeatureVariant = 'shape' | 'feature'

// Azure types
export type AzureDataLineString = atlas.data.LineString
export type AzureDataPosition = atlas.data.Position
export type ControlOptions = atlas.ControlOptions
export type AzureSetCameraOptions = ((CameraOptions | CameraBoundsOptions) & AnimationOptions) | any
export { AuthenticationType } from 'azure-maps-control'
