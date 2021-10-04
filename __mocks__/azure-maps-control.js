class DataSource {
  add = jest.fn()
  clear = jest.fn()
  remove = jest.fn()
  importDataFromUrl = jest.fn()
  setOptions = jest.fn()
}

module.exports = {
  Map: jest.fn(() => ({
    controls: {
      add: jest.fn(),
      remove: jest.fn()
    },
    events: {
      add: jest.fn((eventName, callback = () => {}) => {
        callback()
      }),
      remove: jest.fn()
    },
    imageSprite: {
      add: jest.fn(),
      createFromTemplate: jest.fn()
    },
    sources: {
      add: jest.fn(),
      remove: jest.fn()
    },
    layers: {
      add: jest.fn(),
      remove: jest.fn()
    },
    popups: {
      getPopups: jest.fn(() => []),
      remove: jest.fn()
    },
    markers: {
      add: jest.fn(),
      remove: jest.fn()
    },
    setTraffic: jest.fn(),
    setUserInteraction: jest.fn(),
    setCamera: jest.fn(),
    setStyle: jest.fn(),
    setServiceOptions: jest.fn()
  })),

  HtmlMarker: jest.fn((...args) => ({
    args,
    setOptions: jest.fn(),
    getOptions: jest.fn(() => ({
      popup: {
        isOpen: jest.fn(() => true),
        open: jest.fn(() => false),
        togglePopup: jest.fn(),
        close: jest.fn()
      }
    }))
  })),
  data: {
    LineString: jest.fn(() => ({})),
    Position: jest.fn(() => ({}))
  },
  Pixel: jest.fn(() => ({
    getHeading: jest.fn(() => 'Heading')
  })),
  Popup: jest.fn(() => ({
    setOptions: jest.fn(),
    isOpen: jest.fn(() => false),
    open: jest.fn(),
    close: jest.fn()
  })),
  control: {
    CompassControl: jest.fn(() => ({ compassOption: 'option' })),
    PitchControl: jest.fn(() => ({ pitchOption: 'option' })),
    StyleControl: jest.fn(() => ({ styleOption: 'option' })),
    ZoomControl: jest.fn(() => ({ zoomOption: 'option' })),
    TrafficControl: jest.fn(() => ({ trafficOption: 'option' })),
    TrafficLegendControl: jest.fn(() => ({ trafficLegendOption: 'option' }))
  },
  layer: {
    ImageLayer: jest.fn((options, id) => ({ layer: 'ImageLayer', options, id })),
    TileLayer: jest.fn((options, id) => ({ layer: 'TileLayer', options, id })),
    SymbolLayer: jest.fn((options, id, datasourceRef) => ({
      layer: 'SymbolLayer',
      options,
      id,
      datasourceRef,
      setOptions: jest.fn(),
      getId: jest.fn(() => id)
    })),
    HeatMapLayer: jest.fn((options, id, datasourceRef) => ({
      layer: 'HeatLayer',
      options,
      id,
      datasourceRef
    })),
    LineLayer: jest.fn((options, id, datasourceRef) => ({
      layer: 'LineLayer',
      options,
      id,
      datasourceRef
    })),
    PolygonExtrusionLayer: jest.fn((options, id, datasourceRef) => ({
      layer: 'PolygonExtrusionLayer',
      options,
      id,
      datasourceRef
    })),
    PolygonLayer: jest.fn((options, id, datasourceRef) => ({
      layer: 'PolygonLayer',
      options,
      id,
      datasourceRef
    })),
    BubbleLayer: jest.fn((options, id, datasourceRef) => ({
      layer: 'BubbleLayer',
      options,
      id,
      datasourceRef
    }))
  },
  source: {
    DataSource,
    VectorTileSource: jest.fn((id, options) => ({
      getId: jest.fn(() => id),
      getOptions: jest.fn(() => options)
    })) 
  },
  Shape: jest.fn(() => ({
    setCoordinates: jest.fn(),
    setProperties: jest.fn()
  })),
  data: {
    Position: jest.fn((...args) => args),
    BoundingBox: jest.fn((...args) => args),
    Point: jest.fn(coords => ({ coords, type: 'Point' })),
    MultiPoint: jest.fn((coords, bbox) => ({ coords, bbox, type: 'MultiPoint' })),
    LineString: jest.fn((coords, bbox) => ({ coords, bbox, type: 'LineString' })),
    MultiLineString: jest.fn((multipleCoordinates, bbox) => ({
      multipleCoordinates,
      bbox,
      type: 'MultiLineString'
    })),
    Polygon: jest.fn((coords, bbox) => ({ coords, bbox, type: 'Polygon' })),
    MultiPolygon: jest.fn((multipleDimensionCoordinates, bbox) => ({
      multipleDimensionCoordinates,
      bbox,
      type: 'MultiPolygon'
    })),
    Feature: jest.fn()
  }
}
